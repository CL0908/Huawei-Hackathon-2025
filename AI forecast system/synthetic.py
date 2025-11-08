from __future__ import annotations

import numpy as np
import pandas as pd
import pvlib

from .config import SyntheticCommunityConfig


class SyntheticCommunityGenerator:
    """Creates synthetic household PV production for evaluation."""

    def __init__(
        self,
        config: SyntheticCommunityConfig,
        random_seed: int,
    ) -> None:
        self.config = config
        self.rng = np.random.default_rng(random_seed)

    def _build_time_index(self) -> pd.DatetimeIndex:
        cfg = self.config
        freq = f"{cfg.interval_minutes}min"
        periods = cfg.forecast_days * int((24 * 60) / cfg.interval_minutes)
        if cfg.start is None:
            start = pd.Timestamp.now(tz=cfg.timezone)
        else:
            start = pd.Timestamp(cfg.start)
            if start.tzinfo is None:
                start = start.tz_localize(cfg.timezone)
            else:
                start = start.tz_convert(cfg.timezone)
        start = start.floor(freq)
        return pd.date_range(start=start, periods=periods, freq=freq)

    def generate(self) -> pd.DataFrame:
        cfg = self.config
        times = self._build_time_index()
        location = pvlib.location.Location(
            latitude=cfg.latitude,
            longitude=cfg.longitude,
            tz=cfg.timezone,
            name="SyntheticCommunity_Shandong",
        )
        solar_pos = location.get_solarposition(times)
        clearsky = location.get_clearsky(times, model="ineichen")

        frames: list[pd.DataFrame] = []

        for idx in range(cfg.households):
            capacity_kw = self.rng.uniform(*cfg.capacity_kw_range)
            tilt = self.rng.uniform(*cfg.tilt_deg_range)
            az = self.rng.normal(cfg.azimuth_mean_deg, cfg.azimuth_std_deg)

            poa = pvlib.irradiance.get_total_irradiance(
                surface_tilt=tilt,
                surface_azimuth=az,
                dni=clearsky["dni"],
                ghi=clearsky["ghi"],
                dhi=clearsky["dhi"],
                solar_zenith=solar_pos["zenith"],
                solar_azimuth=solar_pos["azimuth"],
            )

            poa_global = np.clip(poa["poa_global"].to_numpy(), a_min=0.0, a_max=None)
            max_poa = np.nanmax(poa_global) or 1.0
            baseline_power = (poa_global / max_poa) * capacity_kw * 1000.0

            noise = self.rng.normal(loc=0.0, scale=cfg.noise_std, size=baseline_power.shape)
            power = baseline_power * (1.0 + noise)

            cloud_mask = poa_global < (cfg.cloud_threshold * max_poa)
            power[cloud_mask] *= 0.5
            clipping_level = capacity_kw * 1000.0 * cfg.clipping_ratio
            power = np.clip(power, a_min=0.0, a_max=clipping_level)

            hour_decimal = times.hour + times.minute / 60
            base_load_kw = capacity_kw * self.rng.uniform(0.08, 0.16)
            morning_peak_kw = capacity_kw * self.rng.uniform(0.25, 0.45) * np.exp(
                -0.5 * ((hour_decimal - 8.0) / 1.5) ** 2
            )
            evening_peak_kw = capacity_kw * self.rng.uniform(0.35, 0.6) * np.exp(
                -0.5 * ((hour_decimal - 19.5) / 2.0) ** 2
            )
            midday_dip = capacity_kw * self.rng.uniform(0.05, 0.1) * np.exp(
                -0.5 * ((hour_decimal - 13.0) / 1.8) ** 2
            )
            load_kw = base_load_kw + morning_peak_kw + evening_peak_kw - midday_dip
            load_kw = np.clip(load_kw, a_min=0.02 * capacity_kw, a_max=None)
            load_kw += self.rng.normal(scale=0.02 * capacity_kw, size=load_kw.shape)
            load_kw = np.clip(load_kw, a_min=0.01 * capacity_kw, a_max=None)
            load_w = load_kw * 1000.0

            ambient = 28 + 5 * np.sin(2 * np.pi * (times.hour + times.minute / 60) / 24)
            ambient = ambient + self.rng.normal(scale=1.5, size=ambient.shape)
            module_temp = ambient + 0.02 * poa_global + self.rng.normal(scale=1.0, size=ambient.shape)
            wind = np.clip(self.rng.normal(loc=2.5, scale=0.8, size=ambient.shape), a_min=0.0, a_max=None)

            df = pd.DataFrame(
                {
                    "timestamp": times,
                    "site_id": f"SD_{idx:03d}",
                    "capacity_kw": capacity_kw,
                    "tilt_deg": tilt,
                    "azimuth_deg": az,
                    "power_w": power,
                    "p_clear": baseline_power,
                    "IRRADIATION": poa_global,
                    "ghi_clearsky": clearsky["ghi"].to_numpy(),
                    "AMBIENT_TEMPERATURE": ambient,
                    "MODULE_TEMPERATURE": module_temp,
                    "WIND_SPEED": wind,
                    "load_w": load_w,
                }
            )
            df["residual"] = df["power_w"] - df["p_clear"]
            frames.append(df)

        community = (
            pd.concat(frames)
            .set_index(["timestamp", "site_id"])
            .sort_index()
        )
        return community
