# solar_service.py
"""
Solar Forecast Service - Uses YOUR trained models
Integrates with your QuantileRegressor and FeatureBuilder classes
"""

import logging
from pathlib import Path
from typing import Dict, Any, Optional
from datetime import datetime, timedelta
import pickle

import numpy as np
import pandas as pd
import pvlib
import joblib

# Import YOUR modules
from features import FeatureBuilder
from model import QuantileRegressor
from config import PlantConfig

LOGGER = logging.getLogger(__name__)


class SolarForecastService:
    """
    Production forecast service using your trained models.
    
    Your model predicts residuals: actual_power = p_clear + predicted_residual
    """
    
    def __init__(
        self, 
        model_dir: Path, 
        plant_config: PlantConfig,
        feature_builder: Optional[FeatureBuilder] = None
    ):
        """
        Initialize with your trained models.
        
        Args:
            model_dir: Directory containing your trained .pkl files
            plant_config: Plant configuration
            feature_builder: Your FeatureBuilder instance (or will create default)
        """
        self.model_dir = Path(model_dir)
        self.plant = plant_config
        self.emission_factor = 0.417  # kg CO2 per kWh
        
        # Initialize your FeatureBuilder
        if feature_builder is None:
            # Default configuration matching your training
            self.feature_builder = FeatureBuilder(
                lag_steps=[1, 2, 3, 4, 6, 12, 24],
                rolling_window=4
            )
            # Mark as fitted (for inference we don't fit)
            self.feature_builder.columns_ = None  # Will set when loading model metadata
        else:
            self.feature_builder = feature_builder
        
        # Load your trained models
        self.models = self._load_models()
        self.quantiles = sorted(self.models.keys()) if self.models else []
        
    def _load_models(self) -> Dict[float, Any]:
        """Load your quantile models from disk."""
        models = {}
        
        # Try to load models with your naming convention: 
        # {plant_id}_quantile_{quantile}.pkl
        for quantile in [0.1, 0.5, 0.9]:
            quantile_int = int(quantile * 100)
            model_path = self.model_dir / f"{self.plant.plant_id.lower()}_quantile_{quantile_int:02d}.pkl"
            
            if model_path.exists():
                try:
                    model = joblib.load(model_path)
                    models[quantile] = model
                    LOGGER.info(f"Loaded model for quantile {quantile}: {model_path}")
                except Exception as e:
                    LOGGER.error(f"Error loading model {model_path}: {e}")
            else:
                LOGGER.warning(f"Model not found: {model_path}")
        
        # Try to load feature columns if saved separately
        feature_cols_path = self.model_dir / f"{self.plant.plant_id.lower()}_feature_columns.pkl"
        if feature_cols_path.exists():
            try:
                self.feature_builder.columns_ = joblib.load(feature_cols_path)
                LOGGER.info(f"Loaded feature columns: {len(self.feature_builder.columns_)} features")
            except Exception as e:
                LOGGER.warning(f"Could not load feature columns: {e}")
        
        return models
    
    def generate_forecast(
        self,
        start_time: Optional[datetime] = None,
        hours: int = 24,
        interval_minutes: int = 15,
        historical_data: Optional[pd.DataFrame] = None
    ) -> Dict[str, Any]:
        """
        Generate power forecast using YOUR models.
        
        Args:
            start_time: Start time for forecast
            hours: Number of hours to forecast
            interval_minutes: Time interval
            historical_data: Recent historical data for lag features (optional)
            
        Returns:
            Dictionary with forecasts, statistics, and metadata
        """
        if not self.models:
            return {"error": "No models loaded"}
        
        # Create time index
        if start_time is None:
            start_time = datetime.now()
        
        start_time = pd.Timestamp(start_time)
        if start_time.tzinfo is None:
            start_time = start_time.tz_localize(self.plant.timezone)
        else:
            start_time = start_time.tz_convert(self.plant.timezone)
        
        freq = f"{interval_minutes}min"
        periods = hours * (60 // interval_minutes)
        time_index = pd.date_range(start=start_time, periods=periods, freq=freq)
        
        # Generate clear-sky baseline using PVLib (like your training)
        location = pvlib.location.Location(
            latitude=self.plant.latitude,
            longitude=self.plant.longitude,
            tz=self.plant.timezone,
            name=self.plant.name or self.plant.plant_id
        )
        
        clearsky = location.get_clearsky(time_index, model="ineichen")
        
        # Estimate capacity
        capacity_kw = self.plant.capacity_kw or 100.0
        
        # Calculate clear-sky power baseline (same as your training)
        ghi_max = clearsky["ghi"].max()
        if ghi_max > 0:
            p_clear = (clearsky["ghi"] / ghi_max * capacity_kw * 1000.0).clip(lower=0.0)
        else:
            p_clear = pd.Series(0.0, index=time_index)
        
        # Build dataframe in YOUR format
        forecast_df = pd.DataFrame({
            'power_w': p_clear.copy(),  # Initial estimate (will be replaced)
            'p_clear': p_clear,
            'residual': 0.0,  # Will be replaced with predictions
            'capacity_kw': capacity_kw,
            'ghi_clearsky': clearsky['ghi'],
            'IRRADIATION': clearsky['ghi'],  # Proxy for actual irradiation
            'AMBIENT_TEMPERATURE': 25.0,  # Default assumption
            'MODULE_TEMPERATURE': 25.0,
            'WIND_SPEED': 2.0,
        }, index=time_index)
        
        # Add historical data for lag features if available
        if historical_data is not None:
            # Prepend historical data
            forecast_df = pd.concat([historical_data, forecast_df])
        
        try:
            # Use YOUR FeatureBuilder to create features
            if self.feature_builder.columns_ is None:
                # First time: fit_transform
                X, y, metadata = self.feature_builder.fit_transform(forecast_df)
            else:
                # Use trained feature builder
                X, y, metadata = self.feature_builder.transform(forecast_df)
            
            # Get only the forecast period (not historical)
            X = X.loc[time_index[0]:time_index[-1]]
            metadata = metadata.loc[time_index[0]:time_index[-1]]
            
            # Predict residuals using YOUR models
            residual_predictions = {}
            power_predictions = {}
            
            for quantile, model in self.models.items():
                # Predict residual
                residual_pred = model.predict(X.to_numpy(dtype=np.float32))
                residual_predictions[quantile] = residual_pred
                
                # Calculate actual power: p_clear + residual
                power_pred = metadata['p_clear'].to_numpy() + residual_pred
                power_pred = np.clip(power_pred, 0, capacity_kw * 1000.0)
                power_predictions[quantile] = power_pred
            
            # Format output
            forecasts = {
                f"p{int(q*100)}": power_predictions[q].tolist()
                for q in self.quantiles
            }
            
            # Calculate statistics
            stats = self._calculate_statistics(
                power_predictions,
                metadata['p_clear'].to_numpy(),
                capacity_kw,
                interval_minutes
            )
            
            return {
                "plant_id": self.plant.plant_id,
                "capacity_kw": capacity_kw,
                "start_time": time_index[0].isoformat(),
                "end_time": time_index[-1].isoformat(),
                "interval_minutes": interval_minutes,
                "timestamps": [t.isoformat() for t in time_index],
                "forecasts": forecasts,
                "clearsky_baseline": metadata['p_clear'].tolist(),
                "statistics": stats,
                "model_type": "quantile_residual",
                "quantiles": self.quantiles
            }
            
        except Exception as e:
            LOGGER.error(f"Forecast generation error: {e}", exc_info=True)
            return {"error": str(e)}
    
    def _calculate_statistics(
        self,
        power_predictions: Dict[float, np.ndarray],
        p_clear: np.ndarray,
        capacity_kw: float,
        interval_minutes: int
    ) -> Dict[str, Any]:
        """Calculate forecast statistics."""
        interval_hours = interval_minutes / 60.0
        stats = {}
        
        # Median forecast (P50)
        if 0.5 in power_predictions:
            p50 = power_predictions[0.5]
            energy_kwh = (p50.sum() * interval_hours) / 1000.0
            
            stats["total_energy_kwh"] = float(energy_kwh)
            stats["co2_saved_kg"] = float(energy_kwh * self.emission_factor)
            stats["co2_saved_tons"] = float(energy_kwh * self.emission_factor / 1000.0)
            stats["peak_power_kw"] = float(p50.max() / 1000.0)
            stats["avg_power_kw"] = float(p50.mean() / 1000.0)
            
            if capacity_kw > 0:
                stats["capacity_factor_pct"] = float(
                    (p50.mean() / (capacity_kw * 1000.0)) * 100.0
                )
        
        # Uncertainty bounds
        if 0.1 in power_predictions and 0.9 in power_predictions:
            p10 = power_predictions[0.1]
            p90 = power_predictions[0.9]
            
            energy_p10 = (p10.sum() * interval_hours) / 1000.0
            energy_p90 = (p90.sum() * interval_hours) / 1000.0
            
            stats["energy_range_kwh"] = {
                "low": float(energy_p10),
                "high": float(energy_p90)
            }
            stats["co2_range_kg"] = {
                "low": float(energy_p10 * self.emission_factor),
                "high": float(energy_p90 * self.emission_factor)
            }
        
        return stats
    
    def calculate_building_potential(
        self,
        roof_area_m2: float,
        sunshine_hours_year: float,
        panel_capacity_w: float = 350,
        panel_area_m2: float = 1.7,
        system_efficiency: float = 0.8
    ) -> Dict[str, Any]:
        """Calculate solar potential for a building."""
        max_panels = int(roof_area_m2 / panel_area_m2 * 0.85)
        total_capacity_kw = (max_panels * panel_capacity_w) / 1000.0
        
        annual_energy_kwh = (
            total_capacity_kw * sunshine_hours_year * system_efficiency
        )
        
        annual_co2_kg = annual_energy_kwh * self.emission_factor
        annual_co2_tons = annual_co2_kg / 1000.0
        
        return {
            "roof_area_m2": roof_area_m2,
            "max_panels": max_panels,
            "total_capacity_kw": round(total_capacity_kw, 2),
            "annual_energy_kwh": round(annual_energy_kwh, 2),
            "daily_energy_kwh": round(annual_energy_kwh / 365, 2),
            "monthly_energy_kwh": round(annual_energy_kwh / 12, 2),
            "carbon_savings": {
                "annual_kg": round(annual_co2_kg, 2),
                "annual_tons": round(annual_co2_tons, 2),
                "daily_kg": round(annual_co2_kg / 365, 2),
                "monthly_kg": round(annual_co2_kg / 12, 2)
            },
            "system_efficiency": system_efficiency,
            "panel_specs": {
                "capacity_w": panel_capacity_w,
                "area_m2": panel_area_m2
            }
        }
