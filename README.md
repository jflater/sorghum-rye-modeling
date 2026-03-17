# Sorghum-Rye Modeling Pipeline
**Location:** Ames, Iowa (Historical Data 1988-2024)  
**Tools:** APSIM NextGen, Python 3.12, SQLite, Pandas

## Project Overview
This repository contains a reproducible modeling pipeline for simulating Sorghum growth in a Sorghum-Rye cropping system. It automates the execution of APSIM NextGen simulations and extracts high-resolution agronomic data into analysis-ready formats.

## Key Features
* **Automated Workflow:** Python-based execution of `.apsimx` files via the .NET runtime.
* **Environmental Forcing:** Integrated with 35+ years of historical weather data from Ames, IA.
* **Data Extraction:** Automated SQLite-to-Pandas bridge for rapid results processing.

## Technical Troubleshooting Notes
* **Path Resolution:** Implemented absolute pathing for `.met` files to support headless Linux/WSL2 execution.
* **Model Stability:** Optimized sowing windows (May-June) to resolve PMF numerical instabilities and `NaN` errors in radiation interception calculations.

## How to Run
1. Ensure .NET SDK 8.0 and APSIM NextGen are installed.
2. `python3 scripts/run_sim.py`
