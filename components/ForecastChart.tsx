"use client"

import { useState }      from "react"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import { ForecastItem } from "@/lib/types"

const COLORS = [
  "#378ADD","#E24B4A","#1D9E75","#EF9F27","#9333ea",
  "#0C447C","#D85A30","#0F6E56","#BA7517","#7C3AED",
  "#185FA5","#A32D2D","#085041","#633806","#3C3489",
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
      <div className="flex flex-wrap gap-2 mb-4">
        {stations.map((st) => {
          const idx    = stations.indexOf(st)
          const color  = COLORS[idx % COLORS.length]
          const active = selected.includes(st)
          return (
            <button key={st} onClick={() => toggle(st)}
              className="px-3 py-1 text-xs rounded-full border transition-all"
              style={active
                ? { background: color, color: "#fff", borderColor: color }
                : { background: "#fff", color: "#6b7280", borderColor: "#e5e7eb" }
              }>
              {st}
            </button>
          )
        })}
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#94a3b8" }} interval={7} />
          <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} unit="°" domain={["auto", "auto"]} />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }}
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
