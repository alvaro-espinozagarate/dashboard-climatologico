import { WeatherData }                  from "@/lib/types"
import { CloudRain, Thermometer, CheckCircle } from "lucide-react"
import { ComponentType } from "react"

type AlertType = WeatherData["alert"]

interface AlertCfg {
  bg:     string
  border: string
  text:   string
  icon:   ComponentType<{ size?: number }>
}

const ALERT_CONFIG: Record<AlertType, AlertCfg> = {
  "Helada severa":   {
    bg:     "var(--alert-frost-severe-bg)",
    border: "var(--alert-frost-severe-border)",
    text:   "var(--alert-frost-severe-text)",
    icon:   Thermometer,
  },
  "Helada moderada": {
    bg:     "var(--alert-frost-moderate-bg)",
    border: "var(--alert-frost-moderate-border)",
    text:   "var(--alert-frost-moderate-text)",
    icon:   Thermometer,
  },
  "Lluvia intensa":  {
    bg:     "var(--alert-rain-heavy-bg)",
    border: "var(--alert-rain-heavy-border)",
    text:   "var(--alert-rain-heavy-text)",
    icon:   CloudRain,
  },
  "Lluvia moderada": {
    bg:     "var(--alert-rain-moderate-bg)",
    border: "var(--alert-rain-moderate-border)",
    text:   "var(--alert-rain-moderate-text)",
    icon:   CloudRain,
  },
  "Normal": {
    bg:     "var(--alert-normal-bg)",
    border: "var(--alert-normal-border)",
    text:   "var(--alert-normal-text)",
    icon:   CheckCircle,
  },
}

export function AlertPanel({ data }: { data: WeatherData[] }) {
  const alerts = data
    .filter(w => w.alert !== "Normal")
    .sort((a, b) => {
      const order = ["Helada severa", "Helada moderada", "Lluvia intensa", "Lluvia moderada"]
      return order.indexOf(a.alert) - order.indexOf(b.alert)
    })

  if (alerts.length === 0) {
    return (
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: 144,
        gap: 8,
        color: "var(--color-text-muted)",
      }}>
        <CheckCircle size={28} style={{ color: "var(--alert-normal-text)" }} />
        <p style={{ fontSize: 13 }}>Sin alertas activas</p>
        <p style={{ fontSize: 11, color: "var(--color-text-muted)" }}>Todas las estaciones normales</p>
      </div>
    )
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 288, overflowY: "auto", paddingRight: 4 }}>
      {alerts.map(w => {
        const cfg  = ALERT_CONFIG[w.alert]
        const Icon = cfg.icon
        return (
          <div key={w.station} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 12px",
            borderRadius: 8,
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            color: cfg.text,
            transition: "background 0.25s ease",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Icon size={14} />
              <div>
                <p style={{ fontSize: 11, fontWeight: 500 }}>{w.alert}</p>
                <p style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>{w.station} · {w.dept}</p>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, fontWeight: 500 }}>{w.temp.toFixed(1)}°C</p>
              {w.rain_1h > 0 && (
                <p style={{ fontSize: 11, opacity: 0.7, marginTop: 1 }}>{w.rain_1h.toFixed(1)} mm/h</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
