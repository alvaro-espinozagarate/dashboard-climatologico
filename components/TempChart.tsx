"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, ReferenceLine,
} from "recharts"
import { WeatherData } from "@/lib/types"

function getTempColor(temp: number): string {
  if (temp < 0)  return "#0C447C"
  if (temp < 5)  return "#185FA5"
  if (temp < 12) return "#378ADD"
  if (temp < 18) return "#85B7EB"
  if (temp < 24) return "#EF9F27"
  if (temp < 30) return "#D85A30"
  return "#E24B4A"
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
    <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm text-xs">
      <p className="font-medium text-gray-800 mb-1">{d.station}</p>
      <p className="text-gray-500">{d.dept} · {d.region}</p>
      <p className="mt-1">↪ {d.temp.toFixed(1)}°C <span className="text-gray-400">(sens. {d.feels_like.toFixed(1)}°C)</span></p>
      <p>↪ Humedad: {d.humidity}%</p>
      <p>↪ Viento: {d.wind_speed.toFixed(1)} m/s</p>
      {d.rain_1h > 0 && <p>↪ Lluvia: {d.rain_1h.toFixed(1)} mm/h</p>}
      <p className="mt-1 text-gray-400 capitalize">{d.description}</p>
    </div>
  )
}

export function TempChart({ data }: { data: WeatherData[] }) {
  const sorted = [...data].sort((a, b) => b.temp - a.temp)

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={sorted} margin={{ top: 8, right: 8, left: -20, bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis dataKey="station" tick={{ fontSize: 11, fill: "#94a3b8" }}
          angle={-35} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} unit="°" domain={["auto", "auto"]} />
        <ReferenceLine y={0} stroke="#E24B4A" strokeDasharray="4 4" strokeWidth={1} />
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
