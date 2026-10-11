# Data Quality Report: Climate

**Generated:** 2026-08-14T15:04:40.605957
**Source File:** `climate_training.csv`

## Overview
- **Rows:** 17,478
- **Columns:** 96
- **Duplicate Rows:** 0

## Column Statistics
| Column | Type | Missing % | Min | Max |
|---|---|---|---|---|
| `STATION` | `object` | 0.0% | N/A | N/A |
| `DATE` | `object` | 0.0% | N/A | N/A |
| `LATITUDE` | `float64` | 0.0% | -85.2 | 35.1 |
| `LONGITUDE` | `float64` | 0.0% | -178.81 | 178.56 |
| `ELEVATION` | `float64` | 1.8% | 0.0 | 4084.0 |
| `NAME` | `object` | 0.0% | N/A | N/A |
| `AWND` | `float64` | 98.84% | 1.9 | 8.0 |
| `AWND_ATTRIBUTES` | `object` | 98.84% | N/A | N/A |
| `CDSD` | `float64` | 79.03% | 0.0 | 3714.3 |
| `CDSD_ATTRIBUTES` | `object` | 79.39% | N/A | N/A |
| `CLDD` | `float64` | 69.89% | 0.0 | 534.0 |
| `CLDD_ATTRIBUTES` | `object` | 69.89% | N/A | N/A |
| `DP01` | `float64` | 32.62% | 0.0 | 31.0 |
| `DP01_ATTRIBUTES` | `object` | 32.62% | N/A | N/A |
| `DP10` | `float64` | 32.62% | 0.0 | 31.0 |
| `DP10_ATTRIBUTES` | `object` | 32.62% | N/A | N/A |
| `DP1X` | `float64` | 32.62% | 0.0 | 19.0 |
| `DP1X_ATTRIBUTES` | `object` | 32.62% | N/A | N/A |
| `DSND` | `float64` | 93.83% | 0.0 | 31.0 |
| `DSND_ATTRIBUTES` | `object` | 93.83% | N/A | N/A |
| `DSNW` | `float64` | 94.39% | 0.0 | 0.0 |
| `DSNW_ATTRIBUTES` | `object` | 94.39% | N/A | N/A |
| `DT00` | `float64` | 55.48% | 0.0 | 31.0 |
| `DT00_ATTRIBUTES` | `object` | 55.48% | N/A | N/A |
| `DT32` | `float64` | 55.48% | 0.0 | 31.0 |
| `DT32_ATTRIBUTES` | `object` | 55.48% | N/A | N/A |
| `DX32` | `float64` | 46.12% | 0.0 | 31.0 |
| `DX32_ATTRIBUTES` | `object` | 46.12% | N/A | N/A |
| `DX70` | `float64` | 46.12% | 0.0 | 31.0 |
| `DX70_ATTRIBUTES` | `object` | 46.12% | N/A | N/A |
| `DX90` | `float64` | 46.12% | 0.0 | 31.0 |
| `DX90_ATTRIBUTES` | `object` | 46.12% | N/A | N/A |
| `DYFG` | `float64` | 99.89% | 1.0 | 13.0 |
| `DYFG_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `DYHF` | `float64` | 99.99% | 1.0 | 1.0 |
| `DYHF_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `DYNT` | `float64` | 55.48% | 19900101.0 | 20251231.0 |
| `DYNT_ATTRIBUTES` | `object` | 55.48% | N/A | N/A |
| `DYSD` | `float64` | 93.83% | 19900131.0 | 20251031.0 |
| `DYSD_ATTRIBUTES` | `object` | 93.83% | N/A | N/A |
| `DYSN` | `float64` | 94.39% | 19900131.0 | 20161130.0 |
| `DYSN_ATTRIBUTES` | `object` | 94.39% | N/A | N/A |
| `DYTS` | `float64` | 99.26% | 1.0 | 8.0 |
| `DYTS_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `DYXP` | `float64` | 32.62% | 19900101.0 | 20251231.0 |
| `DYXP_ATTRIBUTES` | `object` | 32.62% | N/A | N/A |
| `DYXT` | `float64` | 46.12% | 19900101.0 | 20251231.0 |
| `DYXT_ATTRIBUTES` | `object` | 46.12% | N/A | N/A |
| `EMNT` | `float64` | 55.48% | -79.2 | 30.5 |
| `EMNT_ATTRIBUTES` | `object` | 55.48% | N/A | N/A |
| `EMSD` | `float64` | 93.83% | 0.0 | 1509.0 |
| `EMSD_ATTRIBUTES` | `object` | 93.83% | N/A | N/A |
| `EMSN` | `float64` | 94.39% | 0.0 | 0.0 |
| `EMSN_ATTRIBUTES` | `object` | 94.39% | N/A | N/A |
| `EMXP` | `float64` | 32.62% | 0.0 | 395.5 |
| `EMXP_ATTRIBUTES` | `object` | 32.62% | N/A | N/A |
| `EMXT` | `float64` | 46.12% | -62.4 | 50.0 |
| `EMXT_ATTRIBUTES` | `object` | 46.12% | N/A | N/A |
| `HDSD` | `float64` | 78.42% | 0.0 | 24408.4 |
| `HDSD_ATTRIBUTES` | `object` | 78.72% | N/A | N/A |
| `HTDD` | `float64` | 69.89% | 0.0 | 2669.7 |
| `HTDD_ATTRIBUTES` | `object` | 69.89% | N/A | N/A |
| `PRCP` | `float64` | 32.46% | 0.0 | 1331.8 |
| `PRCP_ATTRIBUTES` | `object` | 32.46% | N/A | N/A |
| `PSUN` | `float64` | 100.0% | N/A | N/A |
| `PSUN_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `SNOW` | `float64` | 94.39% | 0.0 | 0.0 |
| `SNOW_ATTRIBUTES` | `object` | 94.39% | N/A | N/A |
| `TAVG` | `float64` | 66.82% | -67.98 | 36.62 |
| `TAVG_ATTRIBUTES` | `object` | 66.82% | N/A | N/A |
| `TMAX` | `float64` | 46.12% | -67.15 | 45.12 |
| `TMAX_ATTRIBUTES` | `object` | 46.12% | N/A | N/A |
| `TMIN` | `float64` | 55.48% | -70.82 | 32.09 |
| `TMIN_ATTRIBUTES` | `object` | 55.48% | N/A | N/A |
| `TSUN` | `float64` | 100.0% | N/A | N/A |
| `TSUN_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `WDF1` | `float64` | 100.0% | N/A | N/A |
| `WDF1_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `WDFG` | `float64` | 98.67% | 30.0 | 360.0 |
| `WDFG_ATTRIBUTES` | `object` | 98.67% | N/A | N/A |
| `WDFM` | `float64` | 100.0% | N/A | N/A |
| `WDFM_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `WSF1` | `float64` | 100.0% | N/A | N/A |
| `WSF1_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `WSFG` | `float64` | 98.67% | 7.2 | 56.8 |
| `WSFG_ATTRIBUTES` | `object` | 98.67% | N/A | N/A |
| `WSFM` | `float64` | 100.0% | N/A | N/A |
| `WSFM_ATTRIBUTES` | `float64` | 100.0% | N/A | N/A |
| `STATION_LATITUDE` | `float64` | 0.0% | -85.2 | 35.1 |
| `STATION_LONGITUDE` | `float64` | 0.0% | -178.81 | 178.56 |
| `STATION_ELEVATION_M` | `float64` | 0.0% | -999.9 | 4084.0 |
| `STATION_NAME_META` | `object` | 0.0% | N/A | N/A |
| `WDF2` | `float64` | 99.84% | 30.0 | 350.0 |
| `WDF2_ATTRIBUTES` | `object` | 99.84% | N/A | N/A |
| `WSF2` | `float64` | 99.84% | 7.6 | 92.5 |
| `WSF2_ATTRIBUTES` | `object` | 99.84% | N/A | N/A |
