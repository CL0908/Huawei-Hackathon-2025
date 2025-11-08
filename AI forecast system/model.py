from __future__ import annotations

import logging
from pathlib import Path
from typing import Any, Dict, Mapping, Sequence

import joblib
import numpy as np
import pandas as pd
from lightgbm import LGBMRegressor
from sklearn.metrics import mean_absolute_error
from sklearn.model_selection import TimeSeriesSplit

LOGGER = logging.getLogger(__name__)


class QuantileRegressor:
    """Wrapper around LightGBM for quantile regression with time-series CV."""

    def __init__(
        self,
        quantiles: Sequence[float],
        cv_splits: int,
        random_state: int,
    ) -> None:
        self.quantiles = tuple(sorted(quantiles))
        self.cv_splits = cv_splits
        self.random_state = random_state
        self.models: dict[float, LGBMRegressor] = {}

    def _new_model(self, alpha: float) -> LGBMRegressor:
        return LGBMRegressor(
            objective="quantile",
            alpha=alpha,
            n_estimators=400,
            learning_rate=0.05,
            subsample=0.8,
            colsample_bytree=0.8,
            num_leaves=64,
            min_child_samples=25,
            min_split_gain=0.0,
            random_state=self.random_state,
            n_jobs=-1,
            verbose=-1,
        )

    def cross_validate(
        self,
        X: pd.DataFrame,
        y: pd.Series,
        metadata: pd.DataFrame,
    ) -> dict[str, float]:
        tscv = TimeSeriesSplit(n_splits=self.cv_splits)
        preds: dict[float, np.ndarray] = {
            q: np.full_like(y.to_numpy(), fill_value=np.nan, dtype=float)
            for q in self.quantiles
        }

        X_values = X.to_numpy(dtype=np.float32)
        y_values = y.to_numpy(dtype=np.float32)

        for fold, (train_idx, val_idx) in enumerate(tscv.split(X_values), start=1):
            LOGGER.info("TimeSeriesSplit fold %d/%d", fold, self.cv_splits)
            X_train, X_val = X_values[train_idx], X_values[val_idx]
            y_train = y_values[train_idx]
            for q in self.quantiles:
                model = self._new_model(alpha=q)
                model.fit(X_train, y_train)
                preds[q][val_idx] = model.predict(X_val)

        metrics: dict[str, float] = {"cv_folds": float(self.cv_splits)}
        actual_power = metadata["power_w"].to_numpy(dtype=np.float32)
        p_clear = metadata["p_clear"].to_numpy(dtype=np.float32)
        cap_kw = float(metadata["capacity_kw"].iloc[0])
        cap_w = cap_kw * 1000.0

        for q, residual_preds in preds.items():
            mask = ~np.isnan(residual_preds)
            if not mask.any():
                continue
            power_hat = p_clear[mask] + residual_preds[mask]
            mae = mean_absolute_error(actual_power[mask], power_hat)
            label = f"q{int(q*100)}"
            metrics[f"{label}_mae_w"] = float(mae)
            metrics[f"{label}_nmae_pct"] = float(mae / cap_w * 100.0)

        if 0.1 in preds and 0.9 in preds:
            low = p_clear + preds[0.1]
            high = p_clear + preds[0.9]
            coverage = np.mean(
                (actual_power >= low) & (actual_power <= high)
            )
            metrics["coverage_pct"] = float(coverage * 100.0)

        return metrics

    def fit(self, X: pd.DataFrame, y: pd.Series) -> None:
        X_values = X.to_numpy(dtype=np.float32)
        y_values = y.to_numpy(dtype=np.float32)
        for q in self.quantiles:
            LOGGER.info("Training final quantile model alpha=%.2f", q)
            model = self._new_model(alpha=q)
            model.fit(X_values, y_values)
            self.models[q] = model

    def predict(self, X: pd.DataFrame) -> dict[float, np.ndarray]:
        if not self.models:
            raise RuntimeError("Models have not been trained.")
        X_values = X.to_numpy(dtype=np.float32)
        predictions: dict[float, np.ndarray] = {}
        for q, model in self.models.items():
            predictions[q] = model.predict(X_values)
        return predictions

    def save(self, directory: Path, prefix: str) -> list[Path]:
        directory.mkdir(parents=True, exist_ok=True)
        saved_paths: list[Path] = []
        for q, model in self.models.items():
            path = directory / f"{prefix}_quantile_{int(q*100):02d}.pkl"
            joblib.dump(model, path)
            saved_paths.append(path)
        return saved_paths
