"use client"

import { useState } from "react"
import { Map, MapMarker, MarkerContent, MarkerLabel, MarkerPopup, MarkerTooltip, MapControls } from "@/components/ui/map"
import { WeatherData } from "@/lib/types"

type MapMode = "temperatura" | "alerta"

interface Props {
  data: WeatherData[]
}

function getTempColor(temp: number): string {
  if (temp < -5) return "#1a3a6e"
  if (temp < 0)  return "#1565C0"
  if (temp < 5)  return "#42A5F5"
  if (temp < 10) return "#4DD0E1"
  if (temp < 15) return "#80CBC4"
  if (temp < 20) return "#AED581"
  if (temp < 25) return "#FFF176"
  if (temp < 30) return "#FFA726"
  return "#E53935"
}

function getAlertColor(alert: WeatherData["alert"]): string {
  switch (alert) {
    case "Helada severa":   return "#1565C0"
    case "Helada moderada": return "#42A5F5"
    case "Lluvia intensa":  return "#3949AB"
    case "Lluvia moderada": return "#4DD0E1"
    default:                return "#43A047"
  }
}

const TEMP_LEGEND = [
  { color: "#1a3a6e", label: "< −5°C"  },
  { color: "#1565C0", label: "−5–0°C"  },
  { color: "#42A5F5", label: "0–5°C"   },
  { color: "#4DD0E1", label: "5–10°C"  },
  { color: "#80CBC4", label: "10–15°C" },
  { color: "#AED581", label: "15–20°C" },
  { color: "#FFF176", label: "20–25°C" },
  { color: "#FFA726", label: "25–30°C" },
  { color: "#E53935", label: "> 30°C"  },
]

const ALERT_LEGEND = [
  { color: "#43A047", label: "Normal"          },
  { color: "#4DD0E1", label: "Lluvia moderada" },
  { color: "#3949AB", label: "Lluvia intensa"  },
  { color: "#42A5F5", label: "Helada moderada" },
  { color: "#1565C0", label: "Helada severa"   },
]

const LIGHT_COLORS = new Set(["#4DD0E1", "#80CBC4", "#AED581", "#FFF176"])

export function WeatherMap({ data }: Props) {
  const [mode, setMode] = useState<MapMode>("temperatura")

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          display: "flex", gap: 2,
          background: "var(--bg-elevated)",
          border: "1px solid var(--border)",
          borderRadius: 999, padding: 3,
        }}>
          {(["temperatura", "alerta"] as MapMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "4px 12px", fontSize: 11, borderRadius: 999,
              border: "none", cursor: "pointer", transition: "all 0.15s",
              background: mode === m ? "var(--bg-surface)" : "transparent",
              color:      mode === m ? "var(--text-1)" : "var(--text-3)",
              fontWeight: mode === m ? 500 : 400,
              boxShadow:  mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}>
              {m === "temperatura" ? "Temperatura" : "Alertas"}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "var(--text-3)" }}>{data.length} estaciones</span>
      </div>

      {/* Map */}
      <div style={{ height: 420, borderRadius: 10, overflow: "hidden" }}>
        <Map center={[-75.0, -9.19]} zoom={5}>
          <MapControls showZoom position="bottom-right" />
          {data.map(station => {
            const color     = mode === "temperatura"
              ? getTempColor(station.temp)
              : getAlertColor(station.alert)
            const textColor = LIGHT_COLORS.has(color) ? "#0F1D2E" : "#ffffff"

            return (
              <MapMarker
                key={station.station}
                longitude={station.lon}
                latitude={station.lat}
              >
                <MarkerContent>
                  <div style={{
                    position: "relative",
                    width: 34, height: 34,
                    background: color,
                    border: "2.5px solid rgba(255,255,255,0.9)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 9, fontWeight: 700, color: textColor,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                  }}>
                    {station.temp.toFixed(0)}°
                    <MarkerLabel position="bottom">{station.station}</MarkerLabel>
                  </div>
                </MarkerContent>

                <MarkerTooltip>
                  <div style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 8, padding: "8px 10px",
                    fontSize: 11, lineHeight: 1.6,
                    color: "var(--text-1)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  }}>
                    <p style={{ fontWeight: 600, marginBottom: 2 }}>{station.station}</p>
                    <p style={{ color: "var(--text-3)", fontSize: 10 }}>{station.dept} · {station.region}</p>
                  </div>
                </MarkerTooltip>

                <MarkerPopup>
                  <div style={{
                    background: "var(--bg-surface)",
                    color: "var(--text-1)",
                    borderRadius: 10, padding: "12px 14px",
                    minWidth: 200, fontSize: 12, lineHeight: 1.7,
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{station.station}</p>
                    <p style={{ color: "var(--text-3)", fontSize: 11, marginBottom: 10 }}>
                      {station.dept} · {station.region}
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        {([
                          ["Temperatura",  `${station.temp.toFixed(1)}°C (sens. ${station.feels_like.toFixed(1)}°C)`],
                          ["Humedad",       `${station.humidity}%`],
                          ["Viento",        `${station.wind_speed.toFixed(1)} m/s`],
                          ["Nubosidad",     `${station.clouds}%`],
                          ...(station.rain_1h > 0
                            ? [["🌧 Lluvia", `${station.rain_1h.toFixed(1)} mm/h`] as [string,string]]
                            : []),
                        ] as [string,string][]).map(([label, value]) => (
                          <tr key={label}>
                            <td style={{ color: "var(--text-3)", paddingRight: 12, paddingBottom: 2 }}>{label}</td>
                            <td style={{ fontWeight: 500, textAlign: "right" }}>{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{
                      marginTop: 10, padding: "4px 10px",
                      background: `${getAlertColor(station.alert)}22`,
                      borderLeft: `3px solid ${getAlertColor(station.alert)}`,
                      borderRadius: "0 6px 6px 0",
                      fontSize: 11, fontWeight: 500,
                      color: getAlertColor(station.alert),
                    }}>
                      {station.alert}
                    </div>
                    <p style={{ marginTop: 8, fontSize: 10, color: "var(--text-3)", textTransform: "capitalize" }}>
                      {station.description}
                    </p>
                  </div>
                </MarkerPopup>
              </MapMarker>
            )
          })}
        </Map>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 12 }}>
        {(mode === "temperatura" ? TEMP_LEGEND : ALERT_LEGEND).map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-2)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
