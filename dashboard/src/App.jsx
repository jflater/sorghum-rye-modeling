import { useState, useEffect } from 'react'
import Papa from 'papaparse'

import {
  ResponsiveContainer,
  LineChart, Line,
  BarChart, Bar, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ReferenceLine,
} from 'recharts'

function YieldChart({ data, mean }) {
  return (
    <div style={{ background: '#f5f5f4', borderRadius: '8px', padding: '1rem 1rem .5rem' }}>
      <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 500, color: '#6b7280' }}>
        Grain yield over time (g m⁻²)
      </p>

      {/* ResponsiveContainer makes the chart fill its parent width */}
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 40, bottom: 8, left: 0 }}>
          
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
          
          <XAxis
            dataKey="year"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={v => v.toFixed(0)}
            label={{ value: 'g m⁻²', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: 11 } }}
          />

          {/* ReferenceLine draws the mean as a horizontal dashed line */}
          <ReferenceLine
            y={mean}
            stroke="#BA7517"
            strokeDasharray="6 4"
            strokeOpacity={0.5}
            label={{ value: `Mean ${mean.toFixed(0)}`, position: 'insideTopLeft', fontSize: 11, fill: '#BA7517' }}
          />

          <Tooltip
            formatter={(value) => [`${value.toFixed(1)} g m⁻²`, 'Grain yield']}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{ fontSize: 12, borderRadius: '6px', border: '0.5px solid #e5e7eb' }}
          />

          <Line
            type="monotone"
            dataKey="grain"
            stroke="#BA7517"
            strokeWidth={2}
            dot={{ r: 3, fill: '#BA7517', strokeWidth: 0 }}
            activeDot={{ r: 6 }}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function BiomassChart({ data, mean }) {
  const meanBio = data.map(d => d.biomass).reduce((a, b) => a + b, 0) / data.length

  return (
    <div style={{ background: 'var(--color-background-secondary, #f5f5f4)', borderRadius: '8px', padding: '1rem 1rem .5rem' }}>
      <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary, #6b7280)' }}>
        Above-ground biomass (g m⁻²) — amber = above mean
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 16, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />
          <XAxis dataKey="year" tick={{ fontSize: 10 }} tickLine={false} />
          <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
          <Tooltip
            formatter={(value) => [`${value.toFixed(1)} g m⁻²`, 'Biomass']}
            labelFormatter={(label) => `Year: ${label}`}
            contentStyle={{ fontSize: 12, borderRadius: '6px', border: '0.5px solid #e5e7eb' }}
          />
          <Bar dataKey="biomass" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.biomass >= meanBio ? '#BA7517' : 'rgba(99,153,34,0.45)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

function LAIChart({ data }) {
  return (
    <div style={{ background: 'var(--color-background-secondary, #f5f5f4)', borderRadius: '8px', padding: '1rem 1rem .5rem' }}>
      <p style={{ margin: '0 0 12px', fontSize: '12px', fontWeight: 500, color: 'var(--color-text-secondary, #6b7280)' }}>
        Leaf area index vs. grain yield
      </p>
      <ResponsiveContainer width="100%" height={200}>
        <ScatterChart margin={{ top: 4, right: 16, bottom: 16, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" />
          <XAxis
            dataKey="lai"
            type="number"
            name="LAI"
            tick={{ fontSize: 10 }}
            tickLine={false}
            label={{ value: 'Leaf area index', position: 'insideBottom', offset: -10, fontSize: 11 }}
          />
          <YAxis
            dataKey="grain"
            type="number"
            name="Grain yield"
            tick={{ fontSize: 10 }}
            tickLine={false}
            axisLine={false}
            label={{ value: 'g m⁻²', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }}
          />
          <Tooltip
            formatter={(value, name) => [
              name === 'LAI' ? value.toFixed(2) : `${value.toFixed(1)} g m⁻²`,
              name === 'LAI' ? 'Leaf area index' : 'Grain yield'
            ]}
            contentStyle={{ fontSize: 12, borderRadius: '6px', border: '0.5px solid #e5e7eb' }}
          />
          <Scatter data={data} fill="#1D9E75" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}

// This component accepts "props" — data passed in like HTML attributes
// We destructure them directly: { label, value, sub }
function StatCard({ label, value, sub }) {
  return (
    <div style={{
      background: 'var(--color-background-secondary, #f5f5f4)',
      borderRadius: '8px',
      padding: '1rem',
      minWidth: '140px',
      flex: 1,
    }}>
      <p style={{ margin: '0 0 4px', fontSize: '11px', color: 'var(--color-text-secondary, #6b7280)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <p style={{ margin: '0', fontSize: '22px', fontWeight: 500, fontFamily: 'monospace', color: 'var(--color-text-primary, #111)' }}>
        {value}
      </p>
      <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--color-text-tertiary, #9ca3af)' }}>
        {sub}
      </p>
    </div>
  )
}

export default function App() {
  // useState gives a component memory.
  // data is the current value. setData is how you update it.
  // [] means "start as an empty array"
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  // useEffect runs code AFTER the component renders.
  // The [] at the end means "only run this once, on first load"
  useEffect(() => {
    Papa.parse(`${import.meta.env.BASE_URL}data/sorghum_rye_results.csv`, {
      download: true,
      header: true,        // uses first row as keys
      dynamicTyping: true, // converts numbers automatically
      complete: (results) => {
        // results.data is an array of objects like:
        // { CheckpointID: 1, SimulationID: 1, Zone: "Paddock",
        //   "Clock.Today": "1989-10-02 00:00:00",
        //   "Sorghum.Grain.Wt": 876.19, ... }
        
        // Clean it up: extract year and rename columns
        const cleaned = results.data
          .filter(row => row['Sorghum.Grain.Wt'])  // remove empty rows
          .map(row => ({
            year: new Date(row['Clock.Today']).getFullYear(),
            grain:  Math.round(row['Sorghum.Grain.Wt'] * 10) / 10,
            biomass: Math.round(row['Sorghum.AboveGround.Wt'] * 10) / 10,
            lai:    Math.round(row['Sorghum.Leaf.LAI'] * 100) / 100,
          }))
        
        setData(cleaned)   // this triggers a re-render with the new data
        setLoading(false)
      }
    })
  }, [])  // ← the empty array means "run once on mount"

  if (loading) return <p>Loading...</p>

  // Just prove it worked — log to console and show raw count
  // console.log('First row:', data[0])
  
 // Compute summary stats from the data array
 const grainValues = data.map(d => d.grain)
 const mean = grainValues.reduce((sum, v) => sum + v, 0) / grainValues.length
 const std = Math.sqrt(
   grainValues.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / grainValues.length  
 )
 const cv = ((std / mean) * 100).toFixed(1)
 const peak = data.reduce((best, v) => v.grain > best.grain ? v : best, data[0])

 return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontWeight: 500, marginBottom: '4px' }}>
        Sorghum Yield Dashboard
      </h1>
      <p style={{ color: '#6b7280', marginTop: 0 }}>
        Ames, Iowa · APSIM NextGen simulation · 1989–2024
      </p>

      {/* The stat cards row — notice how we pass data in like HTML attributes */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', margin: '1.5rem 0' }}>
        <StatCard
          label="Harvests simulated"
          value={data.length}
          sub="1989 – 2024"
        />
        <StatCard
          label="Mean grain yield"
          value={mean.toFixed(1)}
          sub="g m⁻²"
        />
        <StatCard
          label="Peak yield"
          value={peak.grain.toFixed(1)}
          sub={`${peak.year}`}
        />
        <StatCard
          label="Yield CV"
          value={`${cv}%`}
          sub="interannual stability"
        />
      </div>
      <YieldChart data={data} mean={mean} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
        <BiomassChart data={data} />
        <LAIChart data={data} />
      </div>
    </div>
  ) 
}
