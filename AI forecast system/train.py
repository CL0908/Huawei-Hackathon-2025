from __future__ import annotations

import argparse
import logging
import sys
from pathlib import Path
from typing import Sequence

from solar_forecast import (
    ForecastConfig,
    PlantConfig,
    SolarForecastPipeline,
    SyntheticCommunityConfig,
)

LOGGER = logging.getLogger("solar_forecast")


def configure_logging(verbose: bool) -> None:
    level = logging.DEBUG if verbose else logging.INFO
    logging.basicConfig(
        level=level,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )


def attempt_kaggle_download(target_dir: Path) -> None:
    try:
        import kagglehub  # type: ignore
    except ImportError:
        LOGGER.debug("kagglehub not installed; skipping automatic download.")
        return

    if target_dir.exists():
        LOGGER.info("Dataset directory already exists; skipping Kaggle download.")
        return

    try:
        LOGGER.info("Downloading Kaggle dataset anikannal/solar-power-generation-data.")
        download_path = Path(kagglehub.dataset_download("anikannal/solar-power-generation-data"))
        target_dir.parent.mkdir(parents=True, exist_ok=True)
        if download_path.resolve() != target_dir.resolve():
            LOGGER.info("Linking downloaded dataset from %s", download_path)
            try:
                target_dir.symlink_to(download_path)
            except FileExistsError:
                LOGGER.debug("Dataset link already exists at %s", target_dir)
        LOGGER.info("Dataset ready at %s", target_dir)
    except Exception as exc:  # pragma: no cover - network restrictions
        LOGGER.warning("Automatic dataset download failed (%s). Please download manually.", exc)


def parse_args(argv: Sequence[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Train quantile LightGBM models for solar power forecasting.",
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=Path("data/solar-power-generation-data"),
        help="Path containing Plant_* CSV files from the Kaggle dataset.",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=Path("artifacts"),
        help="Directory to store trained models and reports.",
    )
    parser.add_argument(
        "--plant-id",
        default="Plant_1",
        help="Plant identifier (Plant_1 or Plant_2).",
    )
    parser.add_argument("--latitude", type=float, default=13.0)
    parser.add_argument("--longitude", type=float, default=77.6)
    parser.add_argument("--timezone", default="Asia/Kolkata")
    parser.add_argument("--capacity-kw", type=float, default=None)
    parser.add_argument(
        "--synthetic-latitude",
        type=float,
        default=36.6512,
        help="Latitude for the synthetic community (default: Shandong, China).",
    )
    parser.add_argument(
        "--synthetic-longitude",
        type=float,
        default=117.1201,
        help="Longitude for the synthetic community.",
    )
    parser.add_argument(
        "--synthetic-timezone",
        default="Asia/Shanghai",
        help="Timezone for the synthetic community.",
    )
    parser.add_argument(
        "--synthetic-start",
        default=None,
        help="Optional start timestamp for synthetic simulations (ISO format).",
    )
    parser.add_argument(
        "--skip-download",
        action="store_true",
        help="Disable automatic Kaggle dataset download attempt.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable verbose logging.",
    )
    return parser.parse_args(argv)


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv or sys.argv[1:])
    configure_logging(args.verbose)

    data_dir = Path(args.data_dir).expanduser().resolve()
    output_dir = Path(args.output_dir).expanduser().resolve()

    if not args.skip_download:
        attempt_kaggle_download(data_dir)

    if not data_dir.exists():
        LOGGER.error("Data directory %s does not exist.", data_dir)
        return 1

    plant_config = PlantConfig(
        plant_id=args.plant_id,
        latitude=args.latitude,
        longitude=args.longitude,
        timezone=args.timezone,
        capacity_kw=args.capacity_kw,
    )
    synthetic_config = SyntheticCommunityConfig(
        latitude=args.synthetic_latitude,
        longitude=args.synthetic_longitude,
        timezone=args.synthetic_timezone,
        start=args.synthetic_start,
    )
    forecast_config = ForecastConfig(
        data_dir=data_dir,
        output_dir=output_dir,
        plant=plant_config,
        synthetic=synthetic_config,
    )

    pipeline = SolarForecastPipeline(forecast_config)
    results = pipeline.run()

    LOGGER.info("Pipeline complete. Models saved at: %s", results["model_paths"])
    LOGGER.info("Training metrics path: %s", results["training_metrics_path"])
    LOGGER.info(
        "Synthetic predictions: %s",
        results["synthetic_summary"]["predictions_path"],
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
