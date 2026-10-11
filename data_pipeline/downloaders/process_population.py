"""
Genesis AI - World Bank Population dataset preprocessor
===========================================================

What this script does:
1. Locates the pre-downloaded World Bank Population ZIP file.
2. Extracts the primary CSV.
3. Cleans and transforms the data (melting years, standardizing names).
4. Saves the raw CSV and the processed ML-ready CSV.

Run:
    python data_pipeline/downloaders/process_population.py
"""

import argparse
import zipfile
from pathlib import Path
import os
import shutil
import pandas as pd

# Use the project datasets directory
BASE_DIR = Path("datasets") / "population"
RAW_DIR = BASE_DIR / "raw"
PROCESSED_DIR = BASE_DIR / "processed"
META_DIR = BASE_DIR / "metadata"

def find_population_zip():
    # Look in the user's Downloads folder
    downloads = Path(os.environ.get("USERPROFILE", "")) / "Downloads"
    zip_path = downloads / "Population-Estimates_CSV.zip"
    if zip_path.exists():
        return zip_path
    
    # Try searching the current directory
    for p in Path('.').rglob('Population-Estimates_CSV.zip'):
        return p
        
    return None

def main():
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("1/4 Locating World Bank Population ZIP...")
    zip_path = find_population_zip()
    
    if not zip_path:
        raise RuntimeError("Could not find Population-Estimates_CSV.zip in Downloads or current project.")
        
    print(f"   Found: {zip_path}")

    print("2/4 Extracting Population CSV...")
    # We expect 'Population-EstimatesData.csv' or similar in the ZIP
    extracted_csv_path = None
    with zipfile.ZipFile(zip_path, 'r') as z:
        for filename in z.namelist():
            if 'Data' in filename and filename.endswith('.csv'):
                # Extract this file to raw directory
                z.extract(filename, RAW_DIR)
                extracted_csv_path = RAW_DIR / filename
                break
            # Fallback if the naming changed
            elif filename.startswith('Population') and filename.endswith('.csv'):
                z.extract(filename, RAW_DIR)
                extracted_csv_path = RAW_DIR / filename
                break
                
    if not extracted_csv_path:
        raise RuntimeError("Could not find a valid Data CSV inside the ZIP archive.")
        
    print(f"   Extracted to: {extracted_csv_path}")

    print("3/4 Processing and cleaning dataset...")
    
    # World bank CSVs often have a few lines of metadata at top, but usually the 'Data' file is clean.
    try:
        df = pd.read_csv(extracted_csv_path)
    except Exception as e:
        print(f"   Warning: standard read failed ({e}), trying to skip metadata rows...")
        df = pd.read_csv(extracted_csv_path, skiprows=4)
        
    # The expected columns are: Country Name, Country Code, Indicator Name, Indicator Code, 1960, 1961...
    # We want to keep indicators like:
    # SP.POP.TOTL (Total Population)
    # SP.URB.TOTL (Urban population)
    # SP.RUR.TOTL (Rural population)
    # SP.DYN.LE00.IN (Life expectancy)
    
    # First, let's melt the years
    id_vars = [col for col in df.columns if not col.isdigit()]
    year_cols = [col for col in df.columns if col.isdigit()]
    
    melted = df.melt(id_vars=id_vars, value_vars=year_cols, var_name='Year', value_name='Value')
    melted['Year'] = pd.to_numeric(melted['Year'], errors='coerce')
    melted['Value'] = pd.to_numeric(melted['Value'], errors='coerce')
    
    # Drop rows with NaN values
    melted = melted.dropna(subset=['Value'])
    
    # Pivot so indicators become columns
    # Find the correct column names for Country Code and Indicator Code
    country_col = next((c for c in id_vars if 'Country Code' in c), id_vars[1])
    country_name_col = next((c for c in id_vars if 'Country Name' in c), id_vars[0])
    indicator_code_col = next((c for c in id_vars if 'Indicator Code' in c), id_vars[3])
    
    # Filter for some key indicators to keep it manageable
    key_indicators = [
        'SP.POP.TOTL',  # Population, total
        'SP.URB.TOTL',  # Urban population
        'SP.DYN.LE00.IN', # Life expectancy at birth, total (years)
        'SP.DYN.CBRT.IN', # Birth rate, crude (per 1,000 people)
        'SP.DYN.CDRT.IN', # Death rate, crude (per 1,000 people)
    ]
    
    melted_filtered = melted[melted[indicator_code_col].isin(key_indicators)].copy()
    
    # Pivot
    pivoted = melted_filtered.pivot_table(
        index=[country_col, country_name_col, 'Year'],
        columns=indicator_code_col,
        values='Value'
    ).reset_index()
    
    # Rename columns to be friendly
    rename_map = {
        'SP.POP.TOTL': 'Population_Total',
        'SP.URB.TOTL': 'Population_Urban',
        'SP.DYN.LE00.IN': 'Life_Expectancy',
        'SP.DYN.CBRT.IN': 'Birth_Rate',
        'SP.DYN.CDRT.IN': 'Death_Rate'
    }
    pivoted = pivoted.rename(columns=rename_map)
    
    print("4/4 Saving processed output...")
    output = PROCESSED_DIR / "population_training.csv"
    pivoted.to_csv(output, index=False)
    
    print("\nDONE")
    print(f"Raw file:        {extracted_csv_path.resolve()}")
    print(f"Training dataset: {output.resolve()}")
    print(f"Rows: {len(pivoted):,}")
    print(f"Columns: {len(pivoted.columns)}")

if __name__ == "__main__":
    main()
