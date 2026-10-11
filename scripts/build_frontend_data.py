"""
Genesis AI - CSV-to-JSON Aggregator for Frontend Integration
===========================================================

Reads the processed CSV datasets and produces compact, aggregated
JSON summaries that the Vite frontend can fetch at runtime.

Output: public/data/*.json

Run:
    python scripts/build_frontend_data.py
"""

import json
import math
from pathlib import Path
import pandas as pd
import numpy as np

OUTPUT_DIR = Path("public") / "data"

def safe_val(v):
    """Convert numpy/pandas types to JSON-safe Python types."""
    if isinstance(v, (np.integer,)):
        return int(v)
    if isinstance(v, (np.floating,)):
        if math.isnan(v) or math.isinf(v):
            return None
        return round(float(v), 2)
    if isinstance(v, (np.bool_,)):
        return bool(v)
    return v

def build_climate_summary():
    """Aggregate climate data into global averages by year."""
    df = pd.read_csv("datasets/climate/processed/climate_training.csv", low_memory=False)
    
    # Extract year from DATE (format: YYYY-MM or YYYY-MM-DD)
    df['Year'] = pd.to_datetime(df['DATE'], errors='coerce').dt.year
    df = df.dropna(subset=['Year'])
    df['Year'] = df['Year'].astype(int)
    
    # Key climate columns
    cols = ['TAVG', 'TMAX', 'TMIN', 'PRCP', 'SNOW']
    for c in cols:
        df[c] = pd.to_numeric(df[c], errors='coerce')
    
    # Yearly global averages
    yearly = df.groupby('Year')[cols].mean().reset_index()
    yearly = yearly[yearly['Year'] >= 1950].sort_values('Year')
    
    result = {
        "summary": {
            "total_records": int(len(df)),
            "stations": int(df['STATION'].nunique()),
            "year_range": [int(yearly['Year'].min()), int(yearly['Year'].max())],
            "avg_temp": safe_val(df['TAVG'].mean()),
            "avg_precip": safe_val(df['PRCP'].mean()),
        },
        "yearly_trends": {
            "years": yearly['Year'].tolist(),
            "avg_temp": [safe_val(v) for v in yearly['TAVG'].values],
            "max_temp": [safe_val(v) for v in yearly['TMAX'].values],
            "min_temp": [safe_val(v) for v in yearly['TMIN'].values],
            "precipitation": [safe_val(v) for v in yearly['PRCP'].values],
        }
    }
    return result

def build_population_summary():
    """Aggregate population data."""
    df = pd.read_csv("datasets/population/processed/population_training.csv")
    
    # Global totals by year
    yearly = df.groupby('Year').agg({
        'Population_Total': 'sum',
        'Population_Urban': 'sum',
        'Birth_Rate': 'mean',
        'Death_Rate': 'mean',
        'Life_Expectancy': 'mean',
    }).reset_index()
    yearly = yearly.sort_values('Year')
    
    # Top 10 countries by latest population
    latest_year = df['Year'].max()
    top = df[df['Year'] == latest_year].nlargest(10, 'Population_Total')
    
    result = {
        "summary": {
            "total_records": int(len(df)),
            "countries": int(df['Country Code'].nunique()),
            "year_range": [int(df['Year'].min()), int(df['Year'].max())],
            "latest_global_pop": safe_val(yearly.iloc[-1]['Population_Total']),
        },
        "yearly_trends": {
            "years": yearly['Year'].tolist(),
            "global_pop": [safe_val(v) for v in yearly['Population_Total'].values],
            "urban_pop": [safe_val(v) for v in yearly['Population_Urban'].values],
            "birth_rate": [safe_val(v) for v in yearly['Birth_Rate'].values],
            "death_rate": [safe_val(v) for v in yearly['Death_Rate'].values],
            "life_expectancy": [safe_val(v) for v in yearly['Life_Expectancy'].values],
        },
        "top_countries": [
            {"name": row['Country Name'], "code": row['Country Code'], "population": safe_val(row['Population_Total'])}
            for _, row in top.iterrows()
        ]
    }
    return result

def build_economy_summary():
    """Aggregate economic data."""
    df = pd.read_csv("datasets/economy/processed/economic_training.csv")
    
    yearly = df.groupby('Year').agg({
        'GDP_USD': 'sum',
        'GDP_Per_Capita_USD': 'mean',
        'GDP_Growth_Pct': 'mean',
        'Inflation_Pct': 'mean',
        'Electric_Consumption_kWh_Per_Capita': 'mean',
    }).reset_index()
    yearly = yearly.sort_values('Year')
    
    result = {
        "summary": {
            "total_records": int(len(df)),
            "countries": int(df['Country_Code'].nunique()),
            "year_range": [int(df['Year'].min()), int(df['Year'].max())],
            "avg_gdp_growth": safe_val(df['GDP_Growth_Pct'].mean()),
        },
        "yearly_trends": {
            "years": yearly['Year'].tolist(),
            "global_gdp": [safe_val(v) for v in yearly['GDP_USD'].values],
            "gdp_per_capita": [safe_val(v) for v in yearly['GDP_Per_Capita_USD'].values],
            "gdp_growth": [safe_val(v) for v in yearly['GDP_Growth_Pct'].values],
            "inflation": [safe_val(v) for v in yearly['Inflation_Pct'].values],
            "electric": [safe_val(v) for v in yearly['Electric_Consumption_kWh_Per_Capita'].values],
        }
    }
    return result

def build_health_summary():
    """Aggregate health data."""
    df = pd.read_csv("datasets/health/processed/health_training.csv")
    
    yearly = df.groupby('Year').agg({
        'Life_Expectancy_At_Birth': 'mean',
        'Infant_Mortality_Rate': 'mean',
        'Basic_Sanitation_Access_Pct': 'mean',
        'Basic_Drinking_Water_Access_Pct': 'mean',
    }).reset_index()
    yearly = yearly.sort_values('Year')
    
    result = {
        "summary": {
            "total_records": int(len(df)),
            "countries": int(df['Country'].nunique()),
            "year_range": [int(df['Year'].min()), int(df['Year'].max())],
            "avg_life_expectancy": safe_val(df['Life_Expectancy_At_Birth'].mean()),
        },
        "yearly_trends": {
            "years": yearly['Year'].tolist(),
            "life_expectancy": [safe_val(v) for v in yearly['Life_Expectancy_At_Birth'].values],
            "infant_mortality": [safe_val(v) for v in yearly['Infant_Mortality_Rate'].values],
            "sanitation": [safe_val(v) for v in yearly['Basic_Sanitation_Access_Pct'].values],
            "drinking_water": [safe_val(v) for v in yearly['Basic_Drinking_Water_Access_Pct'].values],
        }
    }
    return result

def build_terrain_summary():
    """Aggregate terrain data."""
    df = pd.read_csv("datasets/terrain/processed/terrain_features.csv")
    
    by_region = df.groupby('region').agg({
        'elevation_m': ['mean', 'min', 'max'],
        'slope_deg': 'mean',
    }).reset_index()
    
    regions = []
    for _, row in by_region.iterrows():
        regions.append({
            "name": row[('region', '')],
            "avg_elevation": safe_val(row[('elevation_m', 'mean')]),
            "min_elevation": safe_val(row[('elevation_m', 'min')]),
            "max_elevation": safe_val(row[('elevation_m', 'max')]),
            "avg_slope": safe_val(row[('slope_deg', 'mean')]),
        })
    
    result = {
        "summary": {
            "total_records": int(len(df)),
            "regions": int(df['region'].nunique()),
            "elevation_range": [safe_val(df['elevation_m'].min()), safe_val(df['elevation_m'].max())],
        },
        "regions": regions,
        "all_points": {
            "latitudes": [safe_val(v) for v in df['latitude'].values],
            "longitudes": [safe_val(v) for v in df['longitude'].values],
            "elevations": [safe_val(v) for v in df['elevation_m'].values],
        }
    }
    return result

def build_dataset_registry():
    """Build the master registry of all datasets for the Datasets page."""
    registry = []
    
    datasets_info = [
        {
            "name": "Climate (NOAA GSOM)",
            "file": "datasets/climate/processed/climate_training.csv",
            "type": "Time Series",
            "source": "NOAA",
            "category": "climate",
        },
        {
            "name": "Population (World Bank)",
            "file": "datasets/population/processed/population_training.csv",
            "type": "Tabular",
            "source": "World Bank",
            "category": "population",
        },
        {
            "name": "Economy (World Bank WDI)",
            "file": "datasets/economy/processed/economic_training.csv",
            "type": "Tabular",
            "source": "World Bank API",
            "category": "economy",
        },
        {
            "name": "Health (WHO GHO)",
            "file": "datasets/health/processed/health_training.csv",
            "type": "Tabular",
            "source": "WHO",
            "category": "health",
        },
        {
            "name": "Terrain (USGS EPQS)",
            "file": "datasets/terrain/processed/terrain_features.csv",
            "type": "Spatial",
            "source": "USGS",
            "category": "terrain",
        },
    ]
    
    for info in datasets_info:
        path = Path(info["file"])
        if path.exists():
            df = pd.read_csv(path, nrows=0)  # just read headers
            full_df = pd.read_csv(path)
            size_bytes = path.stat().st_size
            
            if size_bytes > 1_000_000:
                size_str = f"{size_bytes / 1_000_000:.1f} MB"
            else:
                size_str = f"{size_bytes / 1_000:.1f} KB"
            
            registry.append({
                "name": info["name"],
                "type": info["type"],
                "source": info["source"],
                "category": info["category"],
                "size": size_str,
                "records": f"{len(full_df):,}",
                "columns": len(df.columns),
                "column_names": list(df.columns),
                "status": "ready",
                "updated": path.stat().st_mtime,
            })
    
    return registry

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    builders = {
        "climate": build_climate_summary,
        "population": build_population_summary,
        "economy": build_economy_summary,
        "health": build_health_summary,
        "terrain": build_terrain_summary,
    }
    
    print("Building frontend JSON data files...")
    
    for name, builder in builders.items():
        path = Path(f"datasets/{name}/processed/")
        if not any(path.glob("*.csv")):
            print(f"   Skipping {name} (no processed CSV found)")
            continue
        print(f"   Building {name}.json...")
        data = builder()
        with open(OUTPUT_DIR / f"{name}.json", "w") as f:
            json.dump(data, f, indent=2)
    
    print("   Building dataset_registry.json...")
    registry = build_dataset_registry()
    with open(OUTPUT_DIR / "dataset_registry.json", "w") as f:
        json.dump(registry, f, indent=2)
    
    print(f"\nDONE — JSON files written to {OUTPUT_DIR.resolve()}")
    for p in OUTPUT_DIR.glob("*.json"):
        print(f"   {p.name} ({p.stat().st_size / 1024:.1f} KB)")

if __name__ == "__main__":
    main()
