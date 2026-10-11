"""
Genesis AI - Master Dataset Downloader
=======================================

Usage:
    python scripts/download_all_datasets.py --dataset climate
    python scripts/download_all_datasets.py --dataset population
    python scripts/download_all_datasets.py --all

This script orchestrates the dataset downloads as per datasets.yaml.
"""

import argparse
import sys
import yaml
from pathlib import Path
import subprocess

def load_config():
    config_path = Path("data_pipeline/config/datasets.yaml")
    if not config_path.exists():
        print("Error: Config file not found at", config_path)
        sys.exit(1)
    with open(config_path, "r") as f:
        return yaml.safe_load(f)

def run_downloader(dataset_name, dataset_info):
    print(f"\n{'='*50}")
    print(f"PROCESSING DATASET: {dataset_name.upper()}")
    print(f"Source: {dataset_info.get('source')}")
    print(f"Method: {dataset_info.get('download_method')}")
    print(f"Max Expected Size: {dataset_info.get('max_expected_size_mb')} MB")
    print(f"{'='*50}")

    script = dataset_info.get('preprocessing_script')
    
    # We map preprocessing scripts to the actual scripts we've created
    script_map = {
        "preprocess_climate.py": "data_pipeline/downloaders/download_noaa_gsom.py",
        "preprocess_population.py": "data_pipeline/downloaders/process_population.py",
        "preprocess_terrain.py": "data_pipeline/downloaders/download_terrain.py",
        "preprocess_economy.py": "data_pipeline/downloaders/download_economy.py",
        "preprocess_biodiversity.py": "data_pipeline/downloaders/download_biodiversity.py",
        "preprocess_health.py": "data_pipeline/downloaders/download_health.py",
        "preprocess_earth_observation.py": "data_pipeline/downloaders/download_earth_observation.py",
        "preprocess_geography.py": "data_pipeline/downloaders/download_geography_resources.py",
        "preprocess_resources.py": "data_pipeline/downloaders/download_geography_resources.py"
    }

    if script not in script_map:
        print(f"Warning: Downloader/Processor for {dataset_name} is not yet implemented.")
        print("Skipping...\n")
        return

    script_path = script_map[script]
    if not Path(script_path).exists():
        print(f"Error: Script {script_path} not found.")
        return
        
    print(f"Running {script_path}...")
    try:
        subprocess.run([sys.executable, script_path], check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error: Dataset {dataset_name} pipeline failed with exit code {e.returncode}")
    except Exception as e:
        print(f"Error running pipeline for {dataset_name}: {e}")

def main():
    parser = argparse.ArgumentParser(description="Genesis Master Dataset Downloader")
    parser.add_argument("--dataset", type=str, help="Name of the dataset to download/process")
    parser.add_argument("--all", action="store_true", help="Run all dataset pipelines")
    args = parser.parse_args()

    config = load_config()

    if args.all:
        print("Warning: Running all dataset pipelines.")
        for ds_name, ds_info in config.items():
            run_downloader(ds_name, ds_info)
    elif args.dataset:
        if args.dataset not in config:
            print(f"Error: Dataset '{args.dataset}' not found in datasets.yaml")
            sys.exit(1)
        run_downloader(args.dataset, config[args.dataset])
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
