import { WeatherData }                  from "@/lib/types"
import { AlertTriangle, CloudRain, Thermometer, CheckCircle } from "lucide-react"

type AlertType = WeatherData["alert"]

const ALERT_CONFIG: Record<AlertType, { bg: string; icon: any; label: string }> = {
  "Helada severa":   { bg: "bg-red-50 border-red-300 text-red-800",       icon: Thermometer, label: "Helada severa"   },
  "Helada moderada": { bg: "bg-orange-50 border-orange-300 text-orange-800", icon: Thermometer, label: "Helada moderada" },
  "Lluvia intensa":  { bg: "bg-blue-50 border-blue-300 text-blue-800",    icon: CloudRain,   label: "Lluvia intensa"  },
  "Lluvia moderada": { bg: "bg-sky-50 border-sky-300 text-sky-800",       icon: CloudRain,   label: "Lluvia moderada" },
  "Normal":          { bg: "",                                              icon: CheckCircle, label: "Normal"          },
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
      <div className="flex flex-col items-center justify-center h-36 text-gray-400 gap-2">
        <CheckCircle size={28} className="text-green-400" />
        <p className="text-sm">Sin alertas activas</p>
        <p className="text-xs text-gray-300">Todas las estaciones normales</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
      {alerts.map(w => {
        const cfg  = ALERT_CONFIG[w.alert]
        const Icon = cfg.icon
        return (
          <div key={w.station}
            className={`flex items-center justify-between p-3 rounded-lg border ${cfg.bg}`}>
            <div className="flex items-center gap-2">
              <Icon size={14} />
              <div>
                <p className="text-xs font-medium">{w.alert}</p>
                <p className="text-xs opacity-70">{w.station} · {w.dept}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium">{w.temp.toFixed(1)}°C</p>
              {w.rain_1h > 0 && (
                <p className="text-xs opacity-70">{w.rain_1h.toFixed(1)} mm/h</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
