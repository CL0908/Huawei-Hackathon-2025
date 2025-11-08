from __future__ import annotations

import logging
from pathlib import Path

import numpy as np
import pandas as pd
import pvlib

from .config import ForecastConfig

LOGGER = logging.getLogger(__name__)


def _normalise_columns(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df.columns = [col.upper().strip() for col in df.columns]
    return df


def _read_dataset(path: Path) -> pd.DataFrame:
    if not path.exists():
        raise FileNotFoundError(f"Dataset file not found: {path}")
    df = pd.read_csv(path)
    df = _normalise_columns(df)
    if "DATE_TIME" not in df.columns:
        raise ValueError(f"'DATE_TIME' column missing from {path}")
    df["DATE_TIME"] = pd.to_datetime(df["DATE_TIME"])
    return df


def _aggregate_generation(df: pd.DataFrame) -> pd.DataFrame:
    value_cols = [
        col
        for col in df.columns
        if col
        not in {
            "DATE_TIME",
            "PLANT_ID",
            "SOURCE_KEY",
        }
        and pd.api.types.is_numeric_dtype(df[col])
    ]
    grouped = df.groupby("DATE_TIME")[value_cols].sum(min_count=1)
    if "PLANT_ID" in df.columns:
        grouped["PLANT_ID"] = df["PLANT_ID"].iloc[0]
    return grouped


def _aggregate_weather(df: pd.DataFrame) -> pd.DataFrame:
    value_cols = [
        col
        for col in df.columns
        if col
        not in {
            "DATE_TIME",
            "PLANT_ID",
            "SOURCE_KEY",
        }
        and pd.api.types.is_numeric_dtype(df[col])
    ]
    grouped = df.groupby("DATE_TIME")[value_cols].mean()
    if "PLANT_ID" in df.columns:
        grouped["PLANT_ID"] = df["PLANT_ID"].iloc[0]
    return grouped


def _convert_power_to_watts(series: pd.Series) -> pd.Series:
    """Return power series in watts regardless of input units."""
    if series.empty:
        return series.astype(float)
    max_val = series.max()
    if pd.isna(max_val):
        return series.astype(float)
    if max_val < 1000:
        return series.astype(float) * 1000.0
    return series.astype(float)


def load_training_frame(config: ForecastConfig) -> pd.DataFrame:
    """Load, merge and enrich plant data for modeling."""
    plant = config.plant
    data_dir = config.data_dir
    gen_file = data_dir / f"{plant.plant_id}_Generation_Data.csv"
    weather_file = data_dir / f"{plant.plant_id}_Weather_Sensor_Data.csv"

    generation_raw = _read_dataset(gen_file)
    weather_raw = _read_dataset(weather_file)

    generation = _aggregate_generation(generation_raw)
    weather = _aggregate_weather(weather_raw)

    merged = generation.join(weather, how="inner", lsuffix="_GEN", rsuffix="_WX")
    merged.index = pd.to_datetime(merged.index)
    merged = merged.sort_index()

    tz = plant.timezone
    if merged.index.tz is None:
        merged.index = merged.index.tz_localize(tz)
    else:
        merged.index = merged.index.tz_convert(tz)

    power_column = None
    for candidate in ("AC_POWER", "DC_POWER"):
        if candidate in merged.columns:
            power_column = candidate
            break
    if power_column is None:
        raise ValueError("Expected AC_POWER or DC_POWER column in generation dataset.")

    merged["power_w"] = _convert_power_to_watts(merged[power_column])
    merged["power_kw"] = merged["power_w"] / 1000.0

    if plant.capacity_kw is not None:
        capacity_kw = plant.capacity_kw
    else:
        capacity_kw = float(np.nanpercentile(merged["power_kw"], 99.5))
        LOGGER.info(
            "Inferred installed capacity %.2f kW from high percentile of power.",
            capacity_kw,
        )

    merged["capacity_kw"] = capacity_kw

    location = pvlib.location.Location(
        latitude=plant.latitude,
        longitude=plant.longitude,
        tz=plant.timezone,
        name=plant.name or plant.plant_id,
    )
    clearsky = location.get_clearsky(merged.index, model="ineichen")
    merged["ghi_clearsky"] = clearsky["ghi"]

    ghi_max = merged["ghi_clearsky"].max()
    if ghi_max and ghi_max > 0:
        merged["p_clear"] = (
            merged["ghi_clearsky"] / ghi_max * capacity_kw * 1000.0
        )
    else:
        merged["p_clear"] = capacity_kw * 1000.0
    merged["p_clear"] = merged["p_clear"].clip(lower=0.0)
    merged["residual"] = merged["power_w"] - merged["p_clear"]

    return merged.sort_index()
