"""
Genesis AI - NOAA GSOM dataset downloader and preprocessor
===========================================================

What this script does:
1. Downloads NOAA's GHCN station metadata.
2. Reads the NOAA GSOM station-file index.
3. Selects a spatially diverse set of stations around the world.
4. Downloads the selected monthly GSOM CSV files.
5. Combines them into one ML-ready CSV.
6. Saves a station metadata CSV as well.

Run:
    python data_pipeline/downloaders/download_noaa_gsom.py

Optional:
    python data_pipeline/downloaders/download_noaa_gsom.py --stations 100 --start-year 1990 --end-year 2025

Requirements:
    pip install pandas requests
"""

import argparse
import io
import re
import time
from pathlib import Path

import pandas as pd
import requests


GSOM_INDEX = "https://www.ncei.noaa.gov/data/gsom/access/"
STATIONS_URL = (
    "https://www.ncei.noaa.gov/data/global-historical-climatology-network-daily/"
    "doc/ghcnd-stations.txt"
)

# Use the project datasets directory
BASE_DIR = Path("datasets") / "climate"
RAW_DIR = BASE_DIR / "raw"
PROCESSED_DIR = BASE_DIR / "processed"
META_DIR = BASE_DIR / "metadata"


def get(url, timeout=60):
    r = requests.get(url, timeout=timeout)
    r.raise_for_status()
    return r


def parse_station_metadata(text):
    rows = []

    for line in text.splitlines():
        if len(line) < 40:
            continue

        station_id = line[0:11].strip()

        try:
            lat = float(line[12:20].strip())
            lon = float(line[21:30].strip())
            elev = float(line[31:37].strip())
        except ValueError:
            continue

        name = line[41:71].strip()

        rows.append(
            {
                "station": station_id,
                "name": name,
                "latitude": lat,
                "longitude": lon,
                "elevation_m": elev,
            }
        )

    return pd.DataFrame(rows)


def parse_gsom_index(html):
    # Extract only direct .csv links from the NOAA GSOM access directory.
    names = sorted(set(re.findall(r'href="([^"]+\.csv)"', html, flags=re.I)))

    # Ignore parent/absolute links if any appear.
    names = [
        n for n in names
        if not n.startswith("http") and "/" not in n
    ]

    return names


def choose_spatially_diverse(stations, available_ids, wanted):
    """
    Select stations using a latitude/longitude grid.
    This is deliberately simple and reproducible enough for a student project.
    """
    df = stations[stations["station"].isin(available_ids)].copy()

    if df.empty:
        raise RuntimeError("No station IDs from the GSOM index matched station metadata.")

    # 10 latitude bands x 20 longitude bands.
    df["lat_bin"] = pd.cut(
        df["latitude"],
        bins=[-90, -72, -54, -36, -18, 0, 18, 36, 54, 72, 90],
        labels=False,
        include_lowest=True,
    )

    df["lon_bin"] = pd.cut(
        df["longitude"],
        bins=list(range(-180, 181, 18)),
        labels=False,
        include_lowest=True,
    )

    selected = (
        df.sort_values(["lat_bin", "lon_bin", "station"])
          .groupby(["lat_bin", "lon_bin"], dropna=True)
          .head(1)
    )

    if len(selected) < wanted:
        remaining = df[~df["station"].isin(selected["station"])]
        remaining = remaining.sample(
            n=min(wanted - len(selected), len(remaining)),
            random_state=42,
        )
        selected = pd.concat([selected, remaining], ignore_index=True)

    return selected.head(wanted).drop(columns=["lat_bin", "lon_bin"])


def clean_gsom(df, start_year, end_year):
    # GSOM records are monthly. DATE is YYYY-MM.
    df["DATE"] = pd.to_datetime(df["DATE"], errors="coerce")

    df = df[
        (df["DATE"].dt.year >= start_year)
        & (df["DATE"].dt.year <= end_year)
    ].copy()

    # Convert common GSOM numeric columns when present.
    numeric_candidates = [
        "LATITUDE", "LONGITUDE", "ELEVATION",
        "TAVG", "TMIN", "TMAX",
        "PRCP", "SNOW", "SNWD",
        "DEWP", "SLP", "STP",
        "AWND",
    ]

    for col in numeric_candidates:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    return df


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--stations", type=int, default=100)
    parser.add_argument("--start-year", type=int, default=1990)
    parser.add_argument("--end-year", type=int, default=2025)
    args = parser.parse_args()

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    META_DIR.mkdir(parents=True, exist_ok=True)

    print("1/5 Downloading NOAA station metadata...")
    stations = parse_station_metadata(get(STATIONS_URL).text)

    stations.to_csv(META_DIR / "ghcn_station_metadata.csv", index=False)
    print(f"   Parsed {len(stations):,} stations.")

    print("2/5 Reading NOAA GSOM station index...")
    index_html = get(GSOM_INDEX).text
    filenames = parse_gsom_index(index_html)

    available_ids = {Path(x).stem for x in filenames}
    print(f"   Found {len(available_ids):,} GSOM station files.")

    print(f"3/5 Selecting {args.stations} spatially diverse stations...")
    selected = choose_spatially_diverse(
        stations, available_ids, args.stations
    )

    selected.to_csv(META_DIR / "selected_stations.csv", index=False)
    print(f"   Selected {len(selected)} stations.")

    print("4/5 Downloading station CSVs...")
    frames = []

    for i, row in selected.iterrows():
        station = row["station"]
        url = f"{GSOM_INDEX}{station}.csv"
        out = RAW_DIR / f"{station}.csv"

        try:
            if out.exists():
                raw = pd.read_csv(out)
            else:
                raw_bytes = get(url).content
                out.write_bytes(raw_bytes)
                raw = pd.read_csv(io.BytesIO(raw_bytes))

            raw = clean_gsom(raw, args.start_year, args.end_year)

            if not raw.empty:
                # Keep metadata consistent with the selected station table.
                raw["STATION_LATITUDE"] = row["latitude"]
                raw["STATION_LONGITUDE"] = row["longitude"]
                raw["STATION_ELEVATION_M"] = row["elevation_m"]
                raw["STATION_NAME_META"] = row["name"]
                frames.append(raw)

            print(f"   [{len(frames):03d}/{len(selected):03d}] {station}")
            time.sleep(0.15)

        except Exception as exc:
            print(f"   WARNING: failed {station}: {exc}")

    if not frames:
        raise RuntimeError("No GSOM station data were downloaded successfully.")

    print("5/5 Combining and saving...")
    combined = pd.concat(frames, ignore_index=True)

    # Keep rows that have at least some useful climate observation.
    climate_cols = [
        c for c in ["TAVG", "TMIN", "TMAX", "PRCP", "DEWP", "SLP", "STP"]
        if c in combined.columns
    ]
    if climate_cols:
        combined = combined.dropna(subset=climate_cols, how="all")

    combined = combined.sort_values(["STATION", "DATE"])

    output = PROCESSED_DIR / "climate_training.csv"
    combined.to_csv(output, index=False)

    print("\nDONE")
    print(f"Raw files:       {RAW_DIR.resolve()}")
    print(f"Station metadata: {META_DIR.resolve()}")
    print(f"Training dataset: {output.resolve()}")
    print(f"Rows: {len(combined):,}")
    print(f"Columns: {len(combined.columns)}")
    print("\nImportant:")
    print("- NOAA GSOM is monthly climate/weather data.")
    print("- It does NOT contain population, oxygen %, technology level,")
    print("  disease resistance, or water coverage.")
    print("- Those Genesis variables require additional datasets or")
    print("  a separate simulation/feature-engineering layer.")


if __name__ == "__main__":
    main()
