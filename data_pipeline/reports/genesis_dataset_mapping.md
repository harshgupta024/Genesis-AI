# Genesis Dataset Mapping

This document explains how the real-world datasets acquired by the data pipeline map to the specific variables used in the Genesis AI world generation and predictive simulation engines.

## Overview of Mappings

| Dataset Source | Genesis Engine Component | Features Used |
| :--- | :--- | :--- |
| **NOAA GSOM (Climate)** | World Builder (Temperature/Atmosphere) | Average monthly temps, precipitation, extreme weather frequency |
| **USGS Terrain / Elevation** | Procedural Generation (Gravity/Terrain) | Elevation gradients, slope, aspect, terrain roughness |
| **World Bank Population** | Civilization Simulator (Demographics) | Total population size, historical growth rates, density |
| **World Bank Economy (WDI)** | Machine Learning Predictions (Tech/Economy) | GDP, GDP per capita, inflation, power consumption |
| **GBIF Biodiversity** | Simulation (Ecosystems / Biosphere) | Species occurrence, spatial distribution of biodiversity |
| **WHO GHO (Health)** | Civilization Simulator (Disease Resistance) | Life expectancy, infant mortality, sanitation access |
| **NASA Earthdata** | Procedural Generation (Water/Vegetation) | Vegetation indices (NDVI), surface cover, water boundaries |

## Engine Integration Details

### 1. World Builder Module
When a user defines initial parameters for a new synthetic planet (e.g., setting "Average Temperature"), the engine pulls from the **NOAA Climate** dataset to build a baseline distribution of expected seasonal variance and extreme anomalies that correlate with that temperature. 

### 2. Procedural Generation Engine
The 3D visualization relies on realistic landscapes. By learning from the **USGS Terrain** and **NASA Earthdata** datasets, the generator avoids creating impossible topography (like perfectly flat 10,000m plateaus) and correctly maps vegetation density onto appropriate slopes and water basins.

### 3. Predictive Civilization Simulation
This is the core ML component. The engine combines **World Bank Population**, **Economy**, and **WHO Health** datasets to form a multidimensional matrix of civilization progress. 
For example:
- High `Disease Resistance` in the simulation is calibrated against WHO sanitation and life expectancy data.
- High `Technology Level` correlates with the World Bank's power consumption and GDP data.

By utilizing these real-world statistical foundations, Genesis AI predictions remain grounded in physical and sociological reality, rather than purely arbitrary video-game logic.
