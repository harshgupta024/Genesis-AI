"""
Genesis AI - Earth Observation Downloader (NASA Earthdata)
===========================================================

What this script does:
1. Reads NASA Earthdata credentials from the .env file.
2. If missing, exits gracefully with setup instructions.
3. If present, queries the NASA CMR API for a sample MODIS/VIIRS vegetation index (NDVI) tile.
4. Generates a training-ready environmental dataset.

Run:
    python data_pipeline/downloaders/download_earth_observation.py
"""

import os
import sys
from pathlib import Path

import pandas as pd
import requests
from dotenv import load_dotenv

# Use the project datasets directory
BASE_DIR = Path("datasets") / "earth_observation"
RAW_DIR = BASE_DIR / "raw"
PROCESSED_DIR = BASE_DIR / "processed"
META_DIR = BASE_DIR / "metadata"

def check_credentials():
    load_dotenv()
    user = os.environ.get("NASA_EARTHDATA_USERNAME")
    pw = os.environ.get("NASA_EARTHDATA_PASSWORD")
    
    if not user or not pw:
        print("\n[!] NASA Earthdata Credentials Missing")
        print("To download Earth Observation data, you need an Earthdata Login.")
        print("1. Sign up at https://urs.earthdata.nasa.gov/")
        print("2. Add your credentials to the .env file in the project root:")
        print("   NASA_EARTHDATA_USERNAME=your_username")
        print("   NASA_EARTHDATA_PASSWORD=your_password")
        print("Skipping Earth Observation download for now.")
        return False
    return True

def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("1/3 Checking NASA Earthdata Credentials...")
    if not check_credentials():
        sys.exit(0)
        
    print("2/3 Querying NASA CMR API for Vegetation Data (NDVI)...")
    
    # Example: MOD13A1 - MODIS/Terra Vegetation Indices 16-Day L3 Global 500m SIN Grid
    # In a full pipeline, we would authenticate with Earthdata Login and download the HDF/GeoTIFF file.
    # For this prototype, we'll hit the CMR API to find a relevant granule and extract its metadata.
    
    cmr_url = "https://cmr.earthdata.nasa.gov/search/granules.json"
    params = {
        "short_name": "MOD13A1",
        "page_size": 10,
        "bounding_box": "-120,35,-110,45" # Example bounding box
    }
    
    try:
        r = requests.get(cmr_url, params=params)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        print(f"Failed to fetch from CMR API: {e}")
        sys.exit(1)
        
    granules = data.get("feed", {}).get("entry", [])
    if not granules:
        print("No granules found.")
        sys.exit(0)
        
    # Save raw JSON metadata
    raw_df = pd.DataFrame(granules)
    raw_output = RAW_DIR / "nasa_cmr_sample.csv"
    raw_df.to_csv(raw_output, index=False)
    print(f"   Found {len(granules)} vegetation granules. Metadata saved to raw.")

    print("3/3 Processing and cleaning dataset...")
    # Extract useful features for Genesis ML from the granule metadata (placeholder for actual pixel extraction)
    processed_rows = []
    for g in granules:
        # Extract basic spatio-temporal info
        boxes = g.get('boxes', [''])[0].split() if g.get('boxes') else []
        processed_rows.append({
            'Granule_ID': g.get('title'),
            'Time_Start': g.get('time_start'),
            'Time_End': g.get('time_end'),
            'Dataset_ID': g.get('dataset_id'),
            'South_Lat': boxes[0] if len(boxes) == 4 else None,
            'West_Lon': boxes[1] if len(boxes) == 4 else None,
            'North_Lat': boxes[2] if len(boxes) == 4 else None,
            'East_Lon': boxes[3] if len(boxes) == 4 else None,
            'Estimated_Vegetation_Density': 0.65 # Placeholder until actual raster parsing is implemented
        })
        
    df = pd.DataFrame(processed_rows)
    
    output = PROCESSED_DIR / "environment_training.csv"
    df.to_csv(output, index=False)
    
    print("\nDONE")
    print(f"Raw file:        {raw_output.resolve()}")
    print(f"Training dataset: {output.resolve()}")
    print(f"Rows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")

if __name__ == "__main__":
    main()
