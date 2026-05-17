"use client"

import { useState } from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import { ForecastItem } from "@/lib/types"

/* Paleta de líneas distinguible y cohesiva — evita saturaciones random */
const COLORS = [
  "#0066CC", "#E53935", "#00897B", "#FB8C00", "#5E35B1",
  "#0288D1", "#D81B60", "#43A047", "#F4511E", "#3949AB",
  "#00ACC1", "#8E24AA", "#7CB342", "#6D4C41", "#546E7A",
]

interface Props {
  data:     ForecastItem[]
  stations: string[]
}

interface ChartRow {
  time: string
  [station: string]: string | number
}

export function ForecastChart({ data, stations }: Props) {
  const [selected, setSelected] = useState<string[]>(stations.slice(0, 5))

  const byDate = data.reduce((acc: Record<string, ChartRow>, item) => {
    const d   = new Date(item.datetime)
    const key = `${item.date} ${String(d.getUTCHours()).padStart(2, "0")}h`
    if (!acc[key]) acc[key] = { time: key }
    acc[key][item.station] = item.temp
    return acc
  }, {})

  const chartData = Object.values(byDate)

  const toggle = (st: string) =>
    setSelected(prev =>
      prev.includes(st) ? prev.filter(s => s !== st) : [...prev, st]
    )

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {stations.map((st) => {
          const idx    = stations.indexOf(st)
          const color  = COLORS[idx % COLORS.length]
          const active = selected.includes(st)
          return (
            <button key={st} onClick={() => toggle(st)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                borderRadius: 20,
                border: `1px solid ${active ? color : "var(--color-border)"}`,
                background: active ? color : "var(--color-bg-surface)",
                color: active ? "#fff" : "var(--color-text-secondary)",
                cursor: "pointer",
                transition: "all 0.15s ease",
                fontWeight: active ? 500 : 400,
              }}>
              {st}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "var(--color-text-muted)" }} interval={7} />
          <YAxis tick={{ fontSize: 11, fill: "var(--color-text-muted)" }} unit="°" domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              borderRadius: 8,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-surface)",
              color: "var(--color-text-primary)",
            }}
            formatter={(val: number, name: string) => [`${val?.toFixed(1)}°C`, name]}
          />
          {selected.map((st) => {
            const idx = stations.indexOf(st)
            return (
              <Line key={st} type="monotone" dataKey={st}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={1.5} dot={false} connectNulls
              />
            )
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
