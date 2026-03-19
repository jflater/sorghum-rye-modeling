import pandas as pd
import matplotlib.pyplot as plt

# Load the data
df = pd.read_csv('sorghum_rye_results.csv')
df['Clock.Today'] = pd.to_datetime(df['Clock.Today'])

fig, ax1 = plt.subplots(figsize=(12, 6))

# Plot Grain Weight
color = 'tab:green'
ax1.set_xlabel('')
ax1.set_ylabel('Grain Weight (kg/ha)', color=color)
ax1.plot(df['Clock.Today'], df['Sorghum.Grain.Wt'], color=color, marker='o', label='Grain Yield')
ax1.tick_params(axis='y', labelcolor=color)



plt.title('Simulated Sorghum Yield and Canopy Development (Ames, IA)')
fig.tight_layout()
plt.savefig('yield_trends.png')
print("📈 Visualization saved as yield_trends.png")
