import os
import subprocess
import shutil
import pandas as pd
import sqlite3

# --- 1. SETTINGS & PATHS ---
APSIM_BINARY = shutil.which("dotnet") or "/usr/local/bin/dotnet"
APSIM_DLL = "/usr/local/lib/apsim/2026.3.8005.0/bin/Models.dll"

# --- 2. THE TOOLS (Functions) ---

def run_apsim(simulation_file):
    print(f"🚀 Starting APSIM simulation: {simulation_file}")
    
    # Use the absolute path to the DLL we found in the wrapper earlier
    APSIM_DLL = "/usr/local/lib/apsim/2026.3.8005.0/bin/Models.dll"
    
    # The command MUST be a list: ['dotnet', 'path/to/Models.dll', 'path/to/sim.apsimx']
    command = ["dotnet", APSIM_DLL, simulation_file]
    
    result = subprocess.run(command, capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ Simulation completed successfully!")
    else:
        # Check if the error is "File Not Found" for the .apsimx
        print(f"❌ APSIM Error:\n{result.stderr}")

def extract_results(db_path):
    """Extracts data from the SQLite DB into a Dataframe."""
    if not os.path.exists(db_path):
        return None
    conn = sqlite3.connect(db_path)
    # Note: 'Report' is the default table name in APSIM. 
    # If you renamed your Report node in the GUI, change this string.
    df = pd.read_sql_query("SELECT * FROM HarvestReport", conn)
    conn.close()
    return df

# --- 3. THE EXECUTION BLOCK ---

if __name__ == "__main__":
    # Define your files
    sim_file = "SorghumRye.apsimx"
    db_file = "SorghumRye.db"

    # Step A: Run the model
    run_apsim(sim_file)

    # Step B: Pull the data
    results_df = extract_results(db_file)

    # Step C: Show a preview (This proves it worked in your GitHub logs)
    if results_df is not None:
        print("\n--- Data Preview (First 5 Rows) ---")
        print(results_df.head())
        
        # Save a CSV so you can use it in R for pretty plotting
        results_df.to_csv("sorghum_rye_results.csv", index=False)
        print("\n📂 Results saved to sorghum_rye_results.csv")
