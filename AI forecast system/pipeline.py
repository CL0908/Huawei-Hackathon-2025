from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Any, Dict

import numpy as np
import pandas as pd

from .config import ForecastConfig
from .data import load_training_frame
from .features import FeatureBuilder
from .model import QuantileRegressor
from .synthetic import SyntheticCommunityGenerator

LOGGER = logging.getLogger(__name__)


class SolarForecastPipeline:
    """Coordinates data preparation, modeling, and evaluation."""

    def __init__(self, config: ForecastConfig) -> None:
        self.config = config
        self.feature_builder = FeatureBuilder(
            lag_steps=config.lag_steps,
            rolling_window=config.rolling_window,
        )
        self.model = QuantileRegressor(
            quantiles=config.quantiles,
            cv_splits=config.cv_splits,
            random_state=config.random_seed,
        )
        self.synthetic_generator = SyntheticCommunityGenerator(
            config=config.synthetic,
            random_seed=config.random_seed,
        )

    def run(self) -> dict[str, Any]:
        cfg = self.config
        cfg.ensure_directories()

        LOGGER.info("Loading training data for plant %s", cfg.plant.plant_id)
        train_df = load_training_frame(cfg)

        LOGGER.info("Constructing training features.")
        X_train, y_train, metadata_train = self.feature_builder.fit_transform(train_df)

        LOGGER.info("Running time-series cross-validation.")
        cv_metrics = self.model.cross_validate(X_train, y_train, metadata_train)

        LOGGER.info("Fitting final quantile models.")
        self.model.fit(X_train, y_train)

        model_dir = cfg.output_dir / "models"
        model_paths = self.model.save(model_dir, cfg.plant.plant_id.lower())

        metrics_path = cfg.output_dir / "training_metrics.json"
        metrics_path.write_text(json.dumps(cv_metrics, indent=2))

        LOGGER.info("Simulating synthetic photovoltaic community.")
        synthetic_df = self.synthetic_generator.generate()
        synthetic_summary = self._forecast_synthetic(synthetic_df)

        summary = {
            "model_paths": [str(path) for path in model_paths],
            "training_metrics_path": str(metrics_path),
            "training_metrics": cv_metrics,
            "synthetic_summary": synthetic_summary,
        }
        summary_path = cfg.output_dir / "pipeline_summary.json"
        summary_path.write_text(json.dumps(summary, indent=2))
        return summary

    def _forecast_synthetic(self, synthetic: pd.DataFrame) -> dict[str, Any]:
        quantiles = self.model.quantiles
        site_frames: list[pd.DataFrame] = []
        evaluations: dict[str, Dict[str, float]] = {}

        for site_id, site_df in synthetic.groupby(level=1):
            site_df = site_df.droplevel(1)
            X_site, _, meta = self.feature_builder.transform(site_df)
            preds = self.model.predict(X_site)

            site_power = pd.DataFrame(
                {f"power_p{int(q*100)}": meta["p_clear"].to_numpy() + preds[q] for q in quantiles},
                index=meta.index,
            )
            site_power["power_actual"] = meta["power_w"]
            site_power["p_clear"] = meta["p_clear"]
            site_power["site_id"] = site_id
            if "load_w" in meta.columns:
                site_power["load_w"] = meta["load_w"].to_numpy()
            site_frames.append(site_power)

            evaluation = self._evaluate_predictions(
                actual=meta["power_w"].to_numpy(),
                p_clear=meta["p_clear"].to_numpy(),
                preds=preds,
                capacity_kw=float(meta["capacity_kw"].iloc[0]),
            )
            evaluations[site_id] = evaluation

        combined = pd.concat(site_frames).set_index("site_id", append=True).sort_index()
        predictions_path = self.config.output_dir / "synthetic_predictions.csv"
        combined.to_csv(predictions_path)

        community = (
            combined.groupby(level=0)
            [[col for col in combined.columns if col.startswith("power_p") or col in ("power_actual", "load_w")]]
            .sum()
            .sort_index()
        )
        if "load_w" in community.columns:
            for col in [c for c in community.columns if c.startswith("power_p")]:
                net_col = col.replace("power", "net_power")
                community[net_col] = community[col] - community["load_w"]
            if "power_actual" in community.columns:
                community["net_power_actual"] = community["power_actual"] - community["load_w"]

        community_path = self.config.output_dir / "synthetic_predictions_community.csv"
        community.to_csv(community_path)
        aggregates = self._aggregate_energy(community)
        aggregates["predictions_path"] = str(predictions_path)
        aggregates["community_predictions_path"] = str(community_path)
        aggregates["site_metrics"] = evaluations
        return aggregates

    def _aggregate_energy(self, community: pd.DataFrame) -> dict[str, Any]:
        interval_hours = self.config.synthetic.interval_minutes / 60.0
        power_cols = [col for col in community.columns if col.startswith("power_p")]
        energy = community[power_cols] * interval_hours / 1000.0
        total_energy = energy.sum()
        total_co2 = total_energy * self.config.emission_factor_kg_per_kwh
        daily_energy = energy.resample("D").sum()
        daily_co2 = daily_energy * self.config.emission_factor_kg_per_kwh

        daily_energy_dict = {
            ts.isoformat(): row.to_dict()
            for ts, row in daily_energy.iterrows()
        }
        daily_co2_dict = {
            ts.isoformat(): row.to_dict()
            for ts, row in daily_co2.iterrows()
        }

        result: dict[str, Any] = {
            "total_energy_kwh": total_energy.to_dict(),
            "total_co2_kg": total_co2.to_dict(),
            "daily_energy_kwh": daily_energy_dict,
            "daily_co2_kg": daily_co2_dict,
        }

        if "load_w" in community.columns:
            load_energy = community["load_w"] * interval_hours / 1000.0
            result["total_load_kwh"] = float(load_energy.sum())
            result["daily_load_kwh"] = {
                ts.isoformat(): float(val)
                for ts, val in load_energy.resample("D").sum().items()
            }
            net_cols = [col for col in community.columns if col.startswith("net_power_p")]
            if net_cols:
                net_energy = community[net_cols] * interval_hours / 1000.0
                result["total_net_energy_kwh"] = {
                    col.replace("net_power", "net_power"): float(net_energy[col].sum())
                    for col in net_energy.columns
                }
                result["daily_net_energy_kwh"] = {
                    ts.isoformat(): row.to_dict()
                    for ts, row in net_energy.resample("D").sum().iterrows()
                }
            if "net_power_actual" in community.columns:
                net_actual_energy = community["net_power_actual"] * interval_hours / 1000.0
                result["total_net_actual_energy_kwh"] = float(net_actual_energy.sum())
                result["daily_net_actual_energy_kwh"] = {
                    ts.isoformat(): float(val)
                    for ts, val in net_actual_energy.resample("D").sum().items()
                }

        return result

    @staticmethod
    def _evaluate_predictions(
        actual: np.ndarray,
        p_clear: np.ndarray,
        preds: dict[float, np.ndarray],
        capacity_kw: float,
    ) -> dict[str, float]:
        capacity_w = capacity_kw * 1000.0
        results: dict[str, float] = {}
        if 0.5 in preds:
            mae = np.mean(np.abs(actual - (p_clear + preds[0.5])))
            results["nmae_pct"] = float(mae / capacity_w * 100.0)
        if 0.1 in preds and 0.9 in preds:
            low = p_clear + preds[0.1]
            high = p_clear + preds[0.9]
            coverage = np.mean((actual >= low) & (actual <= high))
            results["coverage_pct"] = float(coverage * 100.0)
        return results
