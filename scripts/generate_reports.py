"""
Genesis AI - Data Quality and Provenance Reporter
===========================================================

What this script does:
1. Iterates over all processed datasets in datasets/*/processed/
2. Calculates row count, missing values, duplicates, and column stats.
3. Saves a data_quality_report.json and .md for each dataset in its metadata folder.

Run:
    python scripts/generate_reports.py
"""

import json
from pathlib import Path
import pandas as pd
import datetime

BASE_DIR = Path("datasets")

def generate_dataset_report(dataset_folder):
    processed_dir = dataset_folder / "processed"
    meta_dir = dataset_folder / "metadata"
    
    if not processed_dir.exists():
        return
        
    for csv_file in processed_dir.glob("*.csv"):
        print(f"Generating report for {csv_file.name}...")
        df = pd.read_csv(csv_file)
        
        report = {
            "dataset_name": dataset_folder.name,
            "filename": csv_file.name,
            "generated_at": datetime.datetime.now().isoformat(),
            "row_count": len(df),
            "column_count": len(df.columns),
            "duplicate_rows": int(df.duplicated().sum()),
            "columns": {}
        }
        
        for col in df.columns:
            missing = int(df[col].isna().sum())
            col_info = {
                "type": str(df[col].dtype),
                "missing_values": missing,
                "percentage_missing": round((missing / len(df)) * 100, 2) if len(df) > 0 else 0
            }
            
            if pd.api.types.is_numeric_dtype(df[col]):
                col_info["min"] = float(df[col].min()) if not pd.isna(df[col].min()) else None
                col_info["max"] = float(df[col].max()) if not pd.isna(df[col].max()) else None
                
            report["columns"][col] = col_info
            
        # Save JSON
        meta_dir.mkdir(parents=True, exist_ok=True)
        with open(meta_dir / "data_quality_report.json", "w") as f:
            json.dump(report, f, indent=4)
            
        # Save Markdown
        md_path = meta_dir / "data_quality_report.md"
        with open(md_path, "w") as f:
            f.write(f"# Data Quality Report: {report['dataset_name'].title()}\n\n")
            f.write(f"**Generated:** {report['generated_at']}\n")
            f.write(f"**Source File:** `{report['filename']}`\n\n")
            f.write("## Overview\n")
            f.write(f"- **Rows:** {report['row_count']:,}\n")
            f.write(f"- **Columns:** {report['column_count']:,}\n")
            f.write(f"- **Duplicate Rows:** {report['duplicate_rows']:,}\n\n")
            f.write("## Column Statistics\n")
            f.write("| Column | Type | Missing % | Min | Max |\n")
            f.write("|---|---|---|---|---|\n")
            for col, stats in report["columns"].items():
                min_val = round(stats.get("min", 0), 2) if stats.get("min") is not None else "N/A"
                max_val = round(stats.get("max", 0), 2) if stats.get("max") is not None else "N/A"
                f.write(f"| `{col}` | `{stats['type']}` | {stats['percentage_missing']}% | {min_val} | {max_val} |\n")

def main():
    print("Generating data quality reports for all processed datasets...")
    for item in BASE_DIR.iterdir():
        if item.is_dir():
            try:
                generate_dataset_report(item)
            except Exception as e:
                print(f"Error generating report for {item.name}: {e}")
                
    print("\nDONE - Reports saved to datasets/<dataset>/metadata/")

if __name__ == "__main__":
    main()
