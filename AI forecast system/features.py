from __future__ import annotations

from dataclasses import dataclass, field
from typing import Sequence

import numpy as np
import pandas as pd


@dataclass(slots=True)
class FeatureBuilder:
    """Constructs feature matrices for residual modeling."""

    lag_steps: Sequence[int]
    rolling_window: int = 4
    columns_: list[str] | None = field(init=False, default=None)

    def __post_init__(self) -> None:
        self.lag_steps = tuple(sorted(set(int(lag) for lag in self.lag_steps if lag > 0)))
        if not self.lag_steps:
            raise ValueError("At least one positive lag step is required.")

    def fit_transform(self, df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
        X, y, meta = self._transform(df)
        self.columns_ = list(X.columns)
        return X, y, meta

    def transform(self, df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
        if self.columns_ is None:
            raise RuntimeError("FeatureBuilder must be fit before calling transform().")
        X, y, meta = self._transform(df)
        X = X.reindex(columns=self.columns_, fill_value=0.0)
        return X, y, meta

    def _transform(self, df: pd.DataFrame) -> tuple[pd.DataFrame, pd.Series, pd.DataFrame]:
        df = df.copy()
        features = pd.DataFrame(index=df.index)

        index = df.index
        features["sin_hour"] = np.sin(2 * np.pi * index.hour / 24)
        features["cos_hour"] = np.cos(2 * np.pi * index.hour / 24)
        features["sin_doy"] = np.sin(2 * np.pi * index.dayofyear / 365.25)
        features["cos_doy"] = np.cos(2 * np.pi * index.dayofyear / 365.25)
        features["is_weekend"] = (index.weekday >= 5).astype(int)

        if "p_clear" in df.columns:
            denom = df["p_clear"].replace(0.0, np.nan)
            features["clear_ratio"] = (df["power_w"] / denom).fillna(0.0)
            features["p_clear"] = df["p_clear"]
        if "ghi_clearsky" in df.columns:
            features["ghi_clearsky"] = df["ghi_clearsky"]

        weather_cols = [
            "IRRADIATION",
            "AMBIENT_TEMPERATURE",
            "MODULE_TEMPERATURE",
            "WIND_SPEED",
            "HUMIDITY",
        ]
        for col in weather_cols:
            if col in df.columns:
                features[col.lower()] = df[col]

        lag_sources = [
            "power_w",
            "p_clear",
            "residual",
            "IRRADIATION",
        ]
        for source in lag_sources:
            if source not in df.columns:
                continue
            series = df[source]
            for lag in self.lag_steps:
                features[f"{source.lower()}_lag_{lag}"] = series.shift(lag)
            if self.rolling_window > 1:
                features[f"{source.lower()}_roll_mean"] = series.rolling(
                    self.rolling_window
                ).mean()
                features[f"{source.lower()}_roll_std"] = series.rolling(
                    self.rolling_window
                ).std()

        target = df["residual"]
        metadata_cols = ["power_w", "p_clear", "capacity_kw"]
        if "load_w" in df.columns:
            metadata_cols.append("load_w")
        metadata = df[metadata_cols].copy()

        valid_mask = ~(features.isna().any(axis=1) | target.isna())
        features = features.loc[valid_mask]
        target = target.loc[valid_mask]
        metadata = metadata.loc[valid_mask]

        return features.astype(float), target.astype(float), metadata
