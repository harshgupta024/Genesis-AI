"""
Genesis AI - World Bank Economic Downloader (WDI API)
===========================================================

What this script does:
1. Queries the World Bank v2 API for specific key economic indicators.
2. Formats and cleans the data into a training-ready tabular format.
3. Saves the ML-ready economic features CSV.

Run:
    python data_pipeline/downloaders/download_economy.py
"""

import time
from pathlib import Path

import pandas as pd
import requests

# Use the project datasets directory
BASE_DIR = Path("datasets") / "economy"
RAW_DIR = BASE_DIR / "raw"
PROCESSED_DIR = BASE_DIR / "processed"
META_DIR = BASE_DIR / "metadata"

def fetch_indicator(indicator_code, name):
    url = f"http://api.worldbank.org/v2/country/all/indicator/{indicator_code}?format=json&per_page=10000&source=2"
    try:
        r = requests.get(url, timeout=60)
        r.raise_for_status()
        data = r.json()
        if len(data) == 2 and isinstance(data[1], list):
            records = []
            for item in data[1]:
                if item['value'] is not None:
                    records.append({
                        "Country_Code": item['countryiso3code'],
                        "Country_Name": item['country']['value'],
                        "Year": int(item['date']),
                        "Indicator": name,
                        "Value": item['value']
                    })
            return records
    except Exception as e:
        print(f"      [!] Failed to fetch {indicator_code}: {e}")
    return []

def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("1/3 Querying World Bank API for key indicators...")
    # Filter for a subset of key indicators to keep the dataset manageable
    indicators = {
        'NY.GDP.MKTP.CD': 'GDP_USD',
        'NY.GDP.PCAP.CD': 'GDP_Per_Capita_USD',
        'NY.GDP.MKTP.KD.ZG': 'GDP_Growth_Pct',
        'FP.CPI.TOTL.ZG': 'Inflation_Pct',
        'EG.USE.ELEC.KH.PC': 'Electric_Consumption_kWh_Per_Capita',
    }
    
    all_records = []
    for code, name in indicators.items():
        print(f"   Fetching {name} ({code})...")
        records = fetch_indicator(code, name)
        all_records.extend(records)
        time.sleep(1) # Be polite

    if not all_records:
        print("Warning: No data fetched from World Bank API.")
        return

    df = pd.DataFrame(all_records)
    # Filter for countries only (ignore regional aggregates which usually don't have iso3 codes in API)
    df = df[df['Country_Code'] != '']
    df = df[df['Year'] >= 2004] # Last 20 years

    raw_output = RAW_DIR / "wb_api_samples.csv"
    df.to_csv(raw_output, index=False)
    print(f"   Saved {len(df)} raw records to {raw_output}")

    print("2/3 Processing and pivoting dataset...")
    
    pivoted = df.pivot_table(
        index=['Country_Code', 'Country_Name', 'Year'],
        columns='Indicator',
        values='Value'
    ).reset_index()
    
    print("3/3 Saving processed output...")
    output = PROCESSED_DIR / "economic_training.csv"
    pivoted.to_csv(output, index=False)

    print("\nDONE")
    print(f"Training dataset: {output.resolve()}")
    print(f"Rows: {len(pivoted):,}")
    print(f"Columns: {len(pivoted.columns)}")

if __name__ == "__main__":
    main()

