"""
Genesis AI - Biodiversity Downloader (GBIF)
===========================================================

What this script does:
1. Reads GBIF credentials from the .env file.
2. If missing, exits gracefully with setup instructions.
3. If present, requests a small, filtered occurrence dataset for a specific taxon and country to keep the download size small.
4. Generates a training-ready CSV mapping species observations to locations.

Run:
    python data_pipeline/downloaders/download_biodiversity.py
"""

import os
import sys
from pathlib import Path

import pandas as pd
import requests
from dotenv import load_dotenv

# Use the project datasets directory
BASE_DIR = Path("datasets") / "biodiversity"
RAW_DIR = BASE_DIR / "raw"
PROCESSED_DIR = BASE_DIR / "processed"
META_DIR = BASE_DIR / "metadata"

def check_credentials():
    load_dotenv()
    user = os.environ.get("GBIF_USERNAME")
    pw = os.environ.get("GBIF_PASSWORD")
    email = os.environ.get("GBIF_EMAIL")
    
    if not user or not pw or not email:
        print("\n[!] GBIF Credentials Missing")
        print("To download GBIF occurrence data, you need a free GBIF account.")
        print("1. Sign up at https://www.gbif.org/")
        print("2. Add your credentials to the .env file in the project root:")
        print("   GBIF_USERNAME=your_username")
        print("   GBIF_PASSWORD=your_password")
        print("   GBIF_EMAIL=your_email")
        print("Skipping Biodiversity download for now.")
        return False
    return True

def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("1/3 Checking GBIF Credentials...")
    if not check_credentials():
        sys.exit(0)
        
    print("2/3 Requesting subset from GBIF Occurrence API...")
    # For this prototype, we'll use the search API directly rather than a bulk asynchronous download,
    # requesting only 500 records of a specific family (e.g., Felidae - Cats) to demonstrate the pipeline
    # without triggering massive async jobs.
    
    # Felidae familyKey = 766
    url = "https://api.gbif.org/v1/occurrence/search"
    params = {
        "familyKey": 766,
        "hasCoordinate": "true",
        "limit": 500
    }
    
    try:
        r = requests.get(url, params=params)
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        print(f"Failed to fetch data from GBIF: {e}")
        sys.exit(1)
        
    results = data.get('results', [])
    if not results:
        print("No results returned.")
        sys.exit(0)
        
    # Save raw JSON
    raw_df = pd.DataFrame(results)
    raw_output = RAW_DIR / "gbif_felidae_sample.csv"
    raw_df.to_csv(raw_output, index=False)
    print(f"   Saved {len(results)} raw occurrence records.")

    print("3/3 Processing and cleaning dataset...")
    # Extract useful features for Genesis ML
    processed_rows = []
    for row in results:
        processed_rows.append({
            'Species': row.get('species', 'Unknown'),
            'Genus': row.get('genus', 'Unknown'),
            'Latitude': row.get('decimalLatitude'),
            'Longitude': row.get('decimalLongitude'),
            'Year': row.get('year'),
            'Country': row.get('countryCode'),
            'Elevation': row.get('elevation')
        })
        
    df = pd.DataFrame(processed_rows)
    df = df.dropna(subset=['Latitude', 'Longitude']) # Ensure coordinates exist
    
    output = PROCESSED_DIR / "species_training.csv"
    df.to_csv(output, index=False)
    
    print("\nDONE")
    print(f"Raw file:        {raw_output.resolve()}")
    print(f"Training dataset: {output.resolve()}")
    print(f"Rows: {len(df):,}")
    print(f"Columns: {len(df.columns)}")

if __name__ == "__main__":
    main()
