"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts"
import { WeatherData } from "@/lib/types"

/**
 * Escala meteorológica estándar:
 * helada severa → helada → frío → fresco → templado → cálido → caluroso → muy caluroso
 */
function getTempColor(temp: number): string {
  if (temp < -5) return "#1a3a6e"  // helada severa — azul marino profundo
  if (temp < 0)  return "#1565C0"  // helada — azul
  if (temp < 5)  return "#42A5F5"  // muy frío — azul claro
  if (temp < 10) return "#4DD0E1"  // frío — cian
  if (temp < 15) return "#80CBC4"  // fresco — teal
  if (temp < 20) return "#AED581"  // templado — verde claro
  if (temp < 25) return "#f9e84d"  // cálido — amarillo
  if (temp < 30) return "#FFA726"  // caluroso — ámbar
  return "#E53935"                  // muy caluroso — rojo
}

interface TooltipPayloadItem {
  payload: WeatherData
}

interface CustomTooltipProps {
  active?:  boolean
  payload?: TooltipPayloadItem[]
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div style={{
      background: "var(--color-bg-surface)",
      border: "1px solid var(--color-border)",
      borderRadius: 8,
      padding: "10px 12px",
      fontSize: 11,
      boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
      color: "var(--color-text-primary)",
    }}>
      <p style={{ fontWeight: 500, marginBottom: 4 }}>{d.station}</p>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 6 }}>{d.dept} · {d.region}</p>
      <p>{d.temp.toFixed(1)}°C <span style={{ color: "var(--color-text-muted)" }}>sens. {d.feels_like.toFixed(1)}°C</span></p>
      <p>↪Humedad: {d.humidity}%</p>
      <p>↪Viento: {d.wind_speed.toFixed(1)} m/s</p>
      {d.rain_1h > 0 && <p>🌧 Lluvia: {d.rain_1h.toFixed(1)} mm/h</p>}
      <p style={{ marginTop: 6, color: "var(--color-text-muted)", textTransform: "capitalize" }}>{d.description}</p>
    </div>
  )
}

export function TempChart({ data }: { data: WeatherData[] }) {
  const sorted = [...data].sort((a, b) => b.temp - a.temp)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={sorted} margin={{ top: 8, right: 8, left: -20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="station" tick={{ fontSize: 11, fill: "var(--color-text-muted)" }}
          angle={-35} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} unit="°" domain={["auto", "auto"]} />
        <ReferenceLine y={0} stroke="#42A5F5" strokeDasharray="4 4" strokeWidth={1.5} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="temp" radius={[4, 4, 0, 0]} maxBarSize={40}>
          {sorted.map((entry, i) => (
            <Cell key={i} fill={getTempColor(entry.temp)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
