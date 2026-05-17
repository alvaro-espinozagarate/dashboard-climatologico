import { WeatherData } from "@/lib/types"
import { CloudRain, Thermometer, CheckCircle } from "lucide-react"
import { ComponentType } from "react"

type AlertType = WeatherData["alert"]

interface Cfg {
  bg: string; border: string; text: string
  icon: ComponentType<{ size?: number }>
}

const CFG: Record<AlertType, Cfg> = {
  "Helada severa":   { bg:"var(--alert-frost-severe-bg)", border:"var(--alert-frost-severe-border)", text:"var(--alert-frost-severe-text)", icon: Thermometer },
  "Helada moderada": { bg:"var(--alert-frost-mod-bg)",    border:"var(--alert-frost-mod-border)",    text:"var(--alert-frost-mod-text)",    icon: Thermometer },
  "Lluvia intensa":  { bg:"var(--alert-rain-heavy-bg)",   border:"var(--alert-rain-heavy-border)",   text:"var(--alert-rain-heavy-text)",   icon: CloudRain },
  "Lluvia moderada": { bg:"var(--alert-rain-mod-bg)",     border:"var(--alert-rain-mod-border)",     text:"var(--alert-rain-mod-text)",     icon: CloudRain },
  "Normal":          { bg:"var(--alert-ok-bg)",           border:"var(--alert-ok-border)",           text:"var(--alert-ok-text)",           icon: CheckCircle },
}

export function AlertPanel({ data }: { data: WeatherData[] }) {
  const alerts = data
    .filter(w => w.alert !== "Normal")
    .sort((a, b) =>
      ["Helada severa","Helada moderada","Lluvia intensa","Lluvia moderada"]
        .indexOf(a.alert) -
      ["Helada severa","Helada moderada","Lluvia intensa","Lluvia moderada"]
        .indexOf(b.alert)
    )

  if (!alerts.length) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", height:144, gap:8, color:"var(--text-3)" }}>
      <CheckCircle size={28} style={{ color:"var(--alert-ok-text)" }} />
      <p style={{ fontSize:13 }}>Sin alertas activas</p>
      <p style={{ fontSize:11, color:"var(--text-3)" }}>Todas las estaciones normales</p>
    </div>
  )

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8,
      maxHeight:288, overflowY:"auto", paddingRight:4 }}>
      {alerts.map(w => {
        const c = CFG[w.alert]; const Icon = c.icon
        return (
          <div key={w.station} style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"10px 12px", borderRadius:8,
            background:c.bg, border:`1px solid ${c.border}`, color:c.text,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <Icon size={14} />
              <div>
                <p style={{ fontSize:11, fontWeight:500 }}>{w.alert}</p>
                <p style={{ fontSize:11, opacity:0.7, marginTop:1 }}>{w.station} · {w.dept}</p>
              </div>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ fontSize:11, fontWeight:500 }}>{w.temp.toFixed(1)}°C</p>
              {w.rain_1h > 0 && <p style={{ fontSize:11, opacity:0.7 }}>{w.rain_1h.toFixed(1)} mm/h</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
