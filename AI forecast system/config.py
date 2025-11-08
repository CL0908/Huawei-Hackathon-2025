# config.py
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional, Sequence


@dataclass
class PlantConfig:
    """Configuration for a specific solar plant."""
    plant_id: str
    latitude: float
    longitude: float
    timezone: str
    capacity_kw: Optional[float] = None
    name: Optional[str] = None


@dataclass
class SyntheticCommunityConfig:
    """Configuration for synthetic community generation."""
    latitude: float = 36.6512  # Shandong, China
    longitude: float = 117.1201
    timezone: str = "Asia/Shanghai"
    households: int = 50
    capacity_kw_range: tuple[float, float] = (3.0, 8.0)
    tilt_deg_range: tuple[float, float] = (20.0, 35.0)
    azimuth_mean_deg: float = 180.0
    azimuth_std_deg: float = 15.0
    noise_std: float = 0.08
    cloud_threshold: float = 0.3
    clipping_ratio: float = 0.95
    forecast_days: int = 7
    interval_minutes: int = 15
    start: Optional[str] = None


@dataclass
class ForecastConfig:
    """Main configuration for the forecast pipeline."""
    data_dir: Path
    output_dir: Path
    plant: PlantConfig
    synthetic: SyntheticCommunityConfig = field(default_factory=SyntheticCommunityConfig)
    
    # Model parameters
    quantiles: Sequence[float] = (0.1, 0.5, 0.9)
    cv_splits: int = 3
    random_seed: int = 42
    
    # Feature engineering
    lag_steps: Sequence[int] = (1, 2, 3, 4, 6, 12, 24)
    rolling_window: int = 4
    
    # Carbon emissions
    emission_factor_kg_per_kwh: float = 0.417  # kg CO2 per kWh
    
    def ensure_directories(self) -> None:
        """Create output directories if they don't exist."""
        self.output_dir.mkdir(parents=True, exist_ok=True)
        (self.output_dir / "models").mkdir(exist_ok=True)
