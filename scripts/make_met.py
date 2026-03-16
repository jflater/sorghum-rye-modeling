import pandas as pd
import numpy as np

# 1. Load your Mesonet CSV
# Update 'mesonet_data.csv' to your actual filename
df = pd.read_csv('../data/historical_rain.csv')

# 2. Convert date to Year and Day of Year (Julian Day)
df['day_dt'] = pd.to_datetime(df['day'])
df['year'] = df['day_dt'].dt.year
df['doy'] = df['day_dt'].dt.dayofyear

# 3. Calculate tav and amp (Required by APSIM)
# tav = average annual temperature
# amp = range of monthly average temperatures
tav = df[['highc', 'lowc']].mean(axis=1).mean()
monthly_means = df.groupby(df['day_dt'].dt.month)[['highc', 'lowc']].mean().mean(axis=1)
amp = monthly_means.max() - monthly_means.min()

# 4. Create the .met file
met_filename = "ames_historical.met"

with open(met_filename, 'w') as f:
    # Header Section
    f.write("[weather.met.check]\n")
    f.write(f"latitude = 42.02 (decimal degrees)\n")
    f.write(f"longitude = -93.62 (decimal degrees)\n")
    f.write(f"tav = {tav:.2f} (oC) ! annual average ambient temperature\n")
    f.write(f"amp = {amp:.2f} (oC) ! annual amplitude in mean monthly temperature\n\n")
    
    # Column Names & Units
    f.write("year  day  radn  maxt  mint  rain\n")
    f.write("()    ()   (MJ/m2) (oC)  (oC)  (mm)\n")
    
    # Daily Data
    # Mapping: highc -> maxt, lowc -> mint, precipmm -> rain, era5land_srad -> radn
    for _, row in df.iterrows():
        f.write(f"{int(row['year'])}  {int(row['doy'])}  {row['era5land_srad']:>5.2f}  "
                f"{row['highc']:>5.1f}  {row['lowc']:>5.1f}  {row['precipmm']:>5.1f}\n")

print(f"✅ Successfully created {met_filename} with {len(df)} days of weather data.")
