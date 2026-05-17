import { WeatherData } from "@/lib/types"
import { Wind, Droplets, Thermometer, CloudRain } from "lucide-react"

export function StatsTable({ data }: { data: WeatherData[] }) {
  const sorted = [...data].sort((a, b) => b.temp - a.temp)

  const badgeStyle = (alert: WeatherData["alert"]) => {
    if (alert === "Normal") return {
      background: "var(--alert-normal-bg)",
      border: `1px solid var(--alert-normal-border)`,
      color: "var(--alert-normal-text)",
    }
    if (alert.includes("Helada")) return {
      background: alert === "Helada severa" ? "var(--alert-frost-severe-bg)" : "var(--alert-frost-moderate-bg)",
      border: `1px solid ${alert === "Helada severa" ? "var(--alert-frost-severe-border)" : "var(--alert-frost-moderate-border)"}`,
      color: alert === "Helada severa" ? "var(--alert-frost-severe-text)" : "var(--alert-frost-moderate-text)",
    }
    return {
      background: alert === "Lluvia intensa" ? "var(--alert-rain-heavy-bg)" : "var(--alert-rain-moderate-bg)",
      border: `1px solid ${alert === "Lluvia intensa" ? "var(--alert-rain-heavy-border)" : "var(--alert-rain-moderate-border)"}`,
      color: alert === "Lluvia intensa" ? "var(--alert-rain-heavy-text)" : "var(--alert-rain-moderate-text)",
    }
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: `1px solid var(--color-border)` }}>
            {[
              { label: "Estación", align: "left" },
              { label: "Región",   align: "left" },
              { label: <span style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3}}><Thermometer size={10}/>Temp</span>, align: "right" },
              { label: <span style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3}}><Droplets size={10}/>HR</span>, align: "right" },
              { label: <span style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3}}><Wind size={10}/>Viento</span>, align: "right" },
              { label: <span style={{display:"flex",alignItems:"center",justifyContent:"flex-end",gap:3}}><CloudRain size={10}/>PP</span>, align: "right" },
              { label: "Estado",   align: "left" },
            ].map((col, i) => (
              <th key={i} style={{
                textAlign: col.align as "left"|"right",
                padding: "8px 8px",
                color: "var(--color-text-muted)",
                fontWeight: 500,
              }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(w => (
            <tr key={w.station} style={{ borderBottom: `1px solid var(--color-border)` }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-bg-subtle)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ padding: "8px 8px", fontWeight: 500, color: "var(--color-text-primary)" }}>{w.station}</td>
              <td style={{ padding: "8px 8px", color: "var(--color-text-secondary)" }}>{w.region}</td>
              <td style={{ padding: "8px 8px", textAlign: "right", fontWeight: 500, color: "var(--color-text-primary)" }}>{w.temp.toFixed(1)}°</td>
              <td style={{ padding: "8px 8px", textAlign: "right", color: "var(--color-text-secondary)" }}>{w.humidity}%</td>
              <td style={{ padding: "8px 8px", textAlign: "right", color: "var(--color-text-secondary)" }}>{w.wind_speed.toFixed(1)} m/s</td>
              <td style={{ padding: "8px 8px", textAlign: "right", color: "var(--color-text-secondary)" }}>{w.rain_1h.toFixed(1)} mm</td>
              <td style={{ padding: "8px 8px" }}>
                <span style={{
                  ...badgeStyle(w.alert),
                  padding: "3px 8px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}>{w.alert}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
