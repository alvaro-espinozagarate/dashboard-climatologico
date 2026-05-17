import { WeatherData } from "@/lib/types"
import { Wind, Droplets, Thermometer, CloudRain } from "lucide-react"

type Alert = WeatherData["alert"]

function badgeStyle(alert: Alert) {
  if (alert === "Normal")          return { bg:"var(--alert-ok-bg)",            border:"var(--alert-ok-border)",           color:"var(--alert-ok-text)" }
  if (alert === "Helada severa")   return { bg:"var(--alert-frost-severe-bg)",  border:"var(--alert-frost-severe-border)", color:"var(--alert-frost-severe-text)" }
  if (alert === "Helada moderada") return { bg:"var(--alert-frost-mod-bg)",     border:"var(--alert-frost-mod-border)",    color:"var(--alert-frost-mod-text)" }
  if (alert === "Lluvia intensa")  return { bg:"var(--alert-rain-heavy-bg)",    border:"var(--alert-rain-heavy-border)",   color:"var(--alert-rain-heavy-text)" }
  return                                   { bg:"var(--alert-rain-mod-bg)",     border:"var(--alert-rain-mod-border)",     color:"var(--alert-rain-mod-text)" }
}

export function StatsTable({ data }: { data: WeatherData[] }) {
  const sorted = [...data].sort((a,b) => b.temp - a.temp)

  const th = (label: React.ReactNode, align: "left" | "right" = "left") => (
    <th style={{ textAlign: align, padding:"7px 8px", color:"var(--text-3)",
      fontWeight:500, fontSize:11, whiteSpace:"nowrap" }}>
      {align === "right"
        ? <span style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:3 }}>{label}</span>
        : label}
    </th>
  )

  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", fontSize:12, borderCollapse:"collapse" }}>
        <thead>
          <tr style={{ borderBottom:`1px solid var(--border)` }}>
            {th("Estación")}
            {th("Región")}
            {th(<><Thermometer size={10}/>Temp</>, "right")}
            {th(<><Droplets size={10}/>HR</>, "right")}
            {th(<><Wind size={10}/>Viento</>, "right")}
            {th(<><CloudRain size={10}/>PP</>, "right")}
            {th("Estado")}
          </tr>
        </thead>
        <tbody>
          {sorted.map(w => {
            const b = badgeStyle(w.alert)
            return (
              <tr key={w.station}
                style={{ borderBottom:`1px solid var(--border)`, transition:"background 0.12s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--bg-elevated)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding:"8px 8px", fontWeight:500, color:"var(--text-1)" }}>{w.station}</td>
                <td style={{ padding:"8px 8px", color:"var(--text-2)" }}>{w.region}</td>
                <td style={{ padding:"8px 8px", fontWeight:500, color:"var(--text-1)", textAlign:"right" }}>{w.temp.toFixed(1)}°</td>
                <td style={{ padding:"8px 8px", color:"var(--text-2)", textAlign:"right" }}>{w.humidity}%</td>
                <td style={{ padding:"8px 8px", color:"var(--text-2)", textAlign:"right" }}>{w.wind_speed.toFixed(1)} m/s</td>
                <td style={{ padding:"8px 8px", color:"var(--text-2)", textAlign:"right" }}>{w.rain_1h.toFixed(1)} mm</td>
                <td style={{ padding:"8px 8px" }}>
                  <span style={{ padding:"3px 8px", borderRadius:20, fontSize:11, fontWeight:500,
                    background:b.bg, border:`1px solid ${b.border}`, color:b.color, whiteSpace:"nowrap" }}>
                    {w.alert}
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
