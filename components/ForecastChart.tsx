"use client"
import { useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ForecastItem } from "@/lib/types"

// Paleta distinguible en fondo claro Y oscuro — evita saturaciones extremas
const PALETTE = [
  "#1A6FB5","#D94F3D","#2A9D6F","#E07B1A","#6952A8",
  "#0E91B0","#B03070","#4E8C2E","#C05A10","#3358A0",
  "#1BA0A0","#7A3090","#8AB030","#704030","#4A6580",
]

interface Props { data: ForecastItem[]; stations: string[] }

export function ForecastChart({ data, stations }: Props) {
  const [selected, setSelected] = useState<string[]>(stations.slice(0,5))

  const byDate = data.reduce((acc: Record<string, Record<string,string|number>>, item) => {
    const d   = new Date(item.datetime)
    const key = `${item.date} ${String(d.getUTCHours()).padStart(2,"0")}h`
    if (!acc[key]) acc[key] = { time: key }
    acc[key][item.station] = item.temp
    return acc
  }, {})
  const chartData = Object.values(byDate)

  const toggle = (st: string) =>
    setSelected(p => p.includes(st) ? p.filter(s=>s!==st) : [...p, st])

  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:16 }}>
        {stations.map(st => {
          const idx    = stations.indexOf(st)
          const color  = PALETTE[idx % PALETTE.length]
          const active = selected.includes(st)
          return (
            <button key={st} onClick={() => toggle(st)} style={{
              padding:"4px 10px", fontSize:11, borderRadius:20, cursor:"pointer",
              transition:"all 0.15s",
              border:      `1px solid ${active ? color : "var(--border)"}`,
              background:  active ? color : "var(--bg-surface)",
              color:       active ? "#fff" : "var(--text-2)",
              fontWeight:  active ? 500 : 400,
            }}>{st}</button>
          )
        })}
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData} margin={{ top:4, right:8, left:-20, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="time" tick={{ fontSize:10, fill:"var(--text-3)" }} interval={7} />
          <YAxis tick={{ fontSize:11, fill:"var(--text-3)" }} unit="°" domain={["auto","auto"]} />
          <Tooltip contentStyle={{
            fontSize:11, borderRadius:8,
            border:"1px solid var(--border)",
            background:"var(--bg-surface)",
            color:"var(--text-1)",
          }} formatter={(v: number, n: string) => [`${v?.toFixed(1)}°C`, n]} />
          {selected.map(st => (
            <Line key={st} type="monotone" dataKey={st}
              stroke={PALETTE[stations.indexOf(st) % PALETTE.length]}
              strokeWidth={1.5} dot={false} connectNulls />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
