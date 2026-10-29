# Genesis — Synthetic World Generation & Predictive Civilization Simulation

> **Create a world. Explore its possible futures.**
>
> Genesis is an interactive platform for defining fictional planetary conditions, exploring data-informed environmental and civilization scenarios, and visualizing changes through a 3D globe.

---

## Overview

Genesis brings together **synthetic-world configuration, real-world reference data, predictive modelling, scenario simulation, and interactive 3D visualization**.

Users can define a fictional world using parameters such as temperature, water coverage, atmospheric composition, population, technology level, and natural resources. The platform is designed to transform those inputs into a structured world state, run selected predictions and simulation rules, and present scenario changes through dashboards, timelines, and a 3D globe.

Real-world datasets provide reference patterns and support model development; they are not exact representations of fictional planets.

> **Project status:** Genesis is under active development. Features, data pipelines, and models should be considered implemented only when they are available in the current codebase. Scenario outputs are not verified forecasts for real exoplanets.

## Core Objectives

- Define and customize fictional planetary environments.
- Organize environmental, demographic, economic, and ecological indicators.
- Prepare and integrate relevant real-world reference datasets.
- Explore possible future states using suitable statistical, machine-learning, and rule-based approaches.
- Simulate interactions between world conditions, resources, and populations.
- Visualize world states through an interactive 3D globe and analytical views.
- Document assumptions, data sources, and limitations.

## Planned Capabilities

### 1. World Builder

Configure a world with parameters such as:

- World name and description
- Gravity and average temperature
- Atmospheric composition and oxygen level
- Water coverage
- Initial population
- Technology level
- Natural-resource availability
- Environmental or biological constraints

The available parameters depend on the current implementation.

### 2. Data Preprocessing

A reproducible pipeline can:

1. Inspect source files, formats, units, and metadata.
2. Check missing values, duplicates, invalid records, and outliers.
3. Standardize units and compatible feature definitions.
4. Align observations across appropriate time periods and spatial scales.
5. Create features for individual modelling tasks.
6. Keep raw data separate from processed datasets.
7. Record source, licence, retrieval date, and preprocessing decisions.

### 3. Predictive Modelling

Genesis is designed to support task-specific models rather than relying on one model for every domain.

| Domain | Candidate approach | Example purpose |
|---|---|---|
| Climate and environment | Regression, Random Forest, gradient boosting, or time-series models | Estimate selected environmental indicators |
| Population | Regression or time-series forecasting | Explore possible population trajectories |
| Economy and resources | Regression and scenario-based models | Explore changes in economic or resource indicators |
| Ecology | Ecological models or suitable statistical/ML methods | Explore environmental and biodiversity-related indicators |
| Interacting populations and institutions | Agent-based modelling | Simulate interactions among agents and shared resources |

These are candidate methods, not a claim that every model has been trained or validated. Final choices should be based on data suitability, baseline comparisons, and evaluation results.

### 4. Scenario Simulation

The simulation layer can combine model outputs with explicit rules and assumptions. Users can compare scenarios by changing initial conditions, running multiple time steps, and inspecting how indicators evolve.

Results depend on data quality, model assumptions, and simulation limits. Fictional conditions may fall outside the range supported by Earth-based training data.

### 5. Interactive 3D Globe

The visualization layer is intended to communicate the configured world state and simulated changes. Depending on the implementation, it may display environmental attributes, surface or water coverage, timelines, and scenario comparisons.

Three.js or React Three Fiber may be used for 3D rendering; these are visualization technologies, not prediction models.

## High-Level Workflow

```text
User-defined world parameters
             |
             v
Input validation and feature transformation
             |
             v
Prepared reference datasets
             |
             v
Domain-specific prediction models
             |
             v
Simulation rules and scenario engine
             |
             v
Updated world state and time-series outputs
             |
             v
3D globe + charts + scenario comparison
```

## Potential Data Sources

Use only datasets that have actually been acquired and documented in the project. Check each dataset's terms and licence before redistribution.

| Source | Potential use | Website |
|---|---|---|
| NOAA | Climate observations and reference patterns | https://www.noaa.gov/ |
| World Bank Data | Population and development indicators | https://data.worldbank.org/ |
| NASA Earthdata | Earth observation and environmental data | https://www.earthdata.nasa.gov/ |
| USGS | Terrain and geospatial reference data | https://www.usgs.gov/ |
| GBIF | Biodiversity occurrence data | https://www.gbif.org/ |
| WHO Global Health Observatory | Selected health indicators | https://www.who.int/data/gho |
| Natural Earth | Geographic reference layers | https://www.naturalearthdata.com/ |

These are potential sources, not a claim that every dataset is currently integrated. Record dataset provenance, licence, preprocessing, and limitations.

## Technology Stack

The following are suitable options; update this section to match the actual repository.

| Layer | Candidate technologies |
|---|---|
| Frontend | React, JavaScript or TypeScript, Vite |
| Styling | Tailwind CSS |
| 3D visualization | Three.js, React Three Fiber |
| Charts and analytics | Recharts or another charting library |
| Data processing | Python, pandas, NumPy |
| Machine learning | scikit-learn; XGBoost where appropriate |
| Simulation | Python or JavaScript modules with explicit rules |
| Backend/API | FastAPI or Node.js/Express, depending on the architecture |
| Data storage | Select according to actual persistence requirements |

Remove technologies that are not used by the current implementation.

## Getting Started

Genesis uses a Vite-based frontend. Verify the repository's `package.json` and required environment variables before running it.

### Prerequisites

- Node.js
- npm
- Git

### Installation

```bash
git clone https://github.com/harshgupta024/Genesis-AI.git
cd Genesis-AI
npm install
npm run dev
```

Open the local URL printed by Vite.

### Production Build

```bash
npm run build
npm run preview
```

If the repository includes a backend, model files, or external services, follow their setup instructions. Never commit API keys, credentials, or private data.

## Evaluation and Validation

Predictive components should be evaluated separately using task-appropriate methods. A responsible process may include:

- A simple baseline for comparison
- Train/validation/test separation, respecting time order for forecasting
- Appropriate metrics for each prediction task
- Checks for data leakage and distribution mismatch
- Documentation of assumptions, uncertainty, and known limitations
- Reproducible experiments and versioned data/model configurations

Do not report accuracy or model performance until supported by actual experiments.

## Current Limitations

- Earth-based datasets cannot automatically validate outcomes for fictional planetary conditions.
- Simulation domains may use different spatial and temporal scales.
- Coupling predictions requires explicit rules and careful validation.
- Gravity and atmospheric settings may fall outside the training-data distribution.
- Feature completeness and reliability depend on what has been implemented and evaluated.

## Roadmap

- [ ] Document the current application architecture
- [ ] Finalize world parameters and validation rules
- [ ] Catalogue datasets, licences, units, and provenance
- [ ] Build reproducible preprocessing pipelines
- [ ] Establish baseline models for selected prediction tasks
- [ ] Evaluate models and document limitations
- [ ] Implement and test the scenario simulation engine
- [ ] Connect simulation outputs to the 3D globe
- [ ] Add scenario comparison, timelines, and reports
- [ ] Document installation and reproducible experiments

Update the checklist as work is completed; do not mark planned work as complete prematurely.

## Contributing

Suggestions, bug reports, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes and test them.
4. Submit a pull request describing the change.

## Responsible Use

Genesis is intended for experimentation, learning, and scenario exploration. Simulated worlds are not validated predictions of real planets or civilizations. Interpret results in the context of documented assumptions, data limitations, and model evaluations.

## License

Add the repository's actual licence here before distributing the project. Do not claim an open-source licence unless a corresponding licence file is present.

---

<p align="center">
  <strong>Genesis</strong><br>
  Synthetic worlds. Alternative futures. Interactive exploration.
</p>
