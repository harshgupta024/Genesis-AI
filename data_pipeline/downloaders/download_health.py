"""
Genesis AI - Health / Disease Downloader (WHO GHO)
===========================================================

What this script does:
1. Queries the official WHO Global Health Observatory (GHO) OData API.
2. Extracts key health indicators relevant to population survival and disease resistance.
3. Formats the data into a clean, ML-ready CSV.

Run:
    python data_pipeline/downloaders/download_health.py
"""

import time
from pathlib import Path
import pandas as pd
import requests

# Use the project datasets directory
BASE_DIR = Path("datasets") / "health"
RAW_DIR = BASE_DIR / "raw"
PROCESSED_DIR = BASE_DIR / "processed"
META_DIR = BASE_DIR / "metadata"

# WHO Athena OData API
WHO_GHO_API = "https://ghoapi.azureedge.net/api"

def get(url, timeout=60):
    r = requests.get(url, timeout=timeout)
    r.raise_for_status()
    return r

def fetch_indicator(indicator_code):
    """Fetch all country data for a specific WHO indicator."""
    url = f"{WHO_GHO_API}/{indicator_code}"
    # Filter for country data (SpatialDimType = 'COUNTRY') to keep dataset small and relevant
    url += "?$filter=SpatialDimType eq 'COUNTRY'"
    try:
        data = get(url).json()
        return data.get('value', [])
    except Exception as e:
        print(f"      [!] Failed to fetch {indicator_code}: {e}")
        return []

def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("1/3 Querying WHO GHO API for key health indicators...")
    
    # Key indicators for Genesis simulation
    indicators = {
        "WHOSIS_000001": "Life_Expectancy_At_Birth",
        "MDG_0000000007": "Infant_Mortality_Rate",
        "WHS4_100": "Basic_Sanitation_Access_Pct",
        "WHS4_117": "Basic_Drinking_Water_Access_Pct"
    }

    all_data = []
    
    for code, name in indicators.items():
        print(f"   Fetching {name} ({code})...")
        records = fetch_indicator(code)
        for r in records:
            # Clean and keep relevant fields
            all_data.append({
                "Indicator": name,
                "Country": r.get('SpatialDim'),
                "Year": r.get('TimeDim'),
                "Value": r.get('NumericValue')
            })
        time.sleep(1) # Be polite

    df = pd.DataFrame(all_data)
    
    if df.empty:
        print("Warning: No data fetched from WHO API.")
        return

    # Save raw queried data
    raw_output = RAW_DIR / "who_gho_samples.csv"
    df.to_csv(raw_output, index=False)
    print(f"   Saved {len(df)} raw records.")

    print("2/3 Processing and cleaning dataset...")
    # Drop NaNs
    df_clean = df.dropna(subset=['Value', 'Country', 'Year']).copy()
    
    # We want a wide format where each country/year has columns for the indicators
    pivoted = df_clean.pivot_table(
        index=['Country', 'Year'],
        columns='Indicator',
        values='Value'
    ).reset_index()

    print("3/3 Saving processed output...")
    output = PROCESSED_DIR / "health_training.csv"
    pivoted.to_csv(output, index=False)
    
    print("\nDONE")
    print(f"Raw file:        {raw_output.resolve()}")
    print(f"Training dataset: {output.resolve()}")
    print(f"Rows: {len(pivoted):,}")
    print(f"Columns: {len(pivoted.columns)}")

if __name__ == "__main__":
    main()
