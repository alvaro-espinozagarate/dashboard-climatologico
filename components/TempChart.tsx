"use client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine } from "recharts"
import { WeatherData } from "@/lib/types"

function tempColor(t: number): string {
  if (t < -5) return "#1a3a6e"
  if (t <  0) return "#1565C0"
  if (t <  5) return "#42A5F5"
  if (t < 10) return "#4DD0E1"
  if (t < 15) return "#80CBC4"
  if (t < 20) return "#AED581"
  if (t < 25) return "#FFF176"
  if (t < 30) return "#FFA726"
  return "#E53935"
}

interface TipItem { payload: WeatherData }
function Tip({ active, payload }: { active?: boolean; payload?: TipItem[] }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{ background:"var(--bg-surface)", border:"1px solid var(--border)",
      borderRadius:8, padding:"10px 12px", fontSize:11,
      boxShadow:"0 4px 16px rgba(0,0,0,0.14)", color:"var(--text-1)" }}>
      <p style={{ fontWeight:500, marginBottom:3 }}>{d.station}</p>
      <p style={{ color:"var(--text-2)", marginBottom:6 }}>{d.dept} · {d.region}</p>
      <p>Temperatura: {d.temp.toFixed(1)}°C <span style={{ color:"var(--text-3)" }}>/ sens. {d.feels_like.toFixed(1)}°C</span></p>
      <p>Humedad: {d.humidity}% HR&nbsp;&nbsp; Viento: {d.wind_speed.toFixed(1)} m/s</p>
      {d.rain_1h > 0 && <p>Lluvia: {d.rain_1h.toFixed(1)} mm/h</p>}
    </div>
  )
}

export function TempChart({ data }: { data: WeatherData[] }) {
  const sorted = [...data].sort((a,b) => b.temp - a.temp)
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={sorted} margin={{ top:8, right:8, left:-20, bottom:50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="station" tick={{ fontSize:11, fill:"var(--text-3)" }}
          angle={-35} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize:11, fill:"var(--text-3)" }} unit="°" domain={["auto","auto"]} />
        <ReferenceLine y={0} stroke="#42A5F5" strokeDasharray="4 4" strokeWidth={1.5} />
        <Tooltip content={<Tip />} />
        <Bar dataKey="temp" radius={[4,4,0,0]} maxBarSize={40}>
          {sorted.map((e,i) => <Cell key={i} fill={tempColor(e.temp)} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
