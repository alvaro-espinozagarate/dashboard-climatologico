"use client"

import { useEffect, useRef, useState } from "react"
import type { Map, Marker, DivIcon } from "leaflet"
import { WeatherData } from "@/lib/types"

type MapMode = "temperatura" | "alerta"

interface Props {
  data: WeatherData[]
}

/** Escala meteorológica estándar — idéntica a TempChart */
function getTempColor(temp: number): string {
  if (temp < -5) return "#1a3a6e"
  if (temp < 0)  return "#1565C0"
  if (temp < 5)  return "#42A5F5"
  if (temp < 10) return "#4DD0E1"
  if (temp < 15) return "#80CBC4"
  if (temp < 20) return "#AED581"
  if (temp < 25) return "#f9e84d"
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

interface LeafletContainer extends HTMLDivElement {
  _leaflet_id?: number
}

export function WeatherMap({ data }: Props) {
  const mapRef      = useRef<LeafletContainer>(null)
  const mapInstance = useRef<Map | null>(null)
  const markersRef  = useRef<Marker[]>([])
  const [mode, setMode]         = useState<MapMode>("temperatura")
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!mapRef.current)               return
    if (mapInstance.current)           return

    if (mapRef.current._leaflet_id) {
      mapRef.current._leaflet_id = undefined
    }

    import("leaflet").then((L) => {
      if (!mapRef.current)     return
      if (mapInstance.current) return

      const IconDefault = L.Icon.Default as typeof L.Icon.Default & {
        prototype: { _getIconUrl?: () => string }
      }
      delete IconDefault.prototype._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current!, {
        center:          [-9.19, -75.0],
        zoom:            5,
        zoomControl:     true,
        scrollWheelZoom: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map)

      mapInstance.current = map
      map.whenReady(() => setMapReady(true))
    })

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove()
        mapInstance.current = null
        setMapReady(false)
      }
      markersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!mapReady)            return
    if (!mapInstance.current) return
    if (!data.length)         return

    import("leaflet").then((L) => {
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      data.forEach((d) => {
        const color = mode === "temperatura"
          ? getTempColor(d.temp)
          : getAlertColor(d.alert)

        /* texto del marcador en oscuro para colores claros (cian, verde, amarillo) */
        const lightColors = ["#4DD0E1", "#80CBC4", "#AED581", "#f9e84d"]
        const textColor = lightColors.includes(color) ? "#0F1D2E" : "#ffffff"

        const icon: DivIcon = L.divIcon({
          className: "",
          html: `<div style="
            width:32px;height:32px;
            background:${color};
            border:2px solid rgba(255,255,255,0.85);
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:9px;font-weight:700;color:${textColor};
            box-shadow:0 2px 8px rgba(0,0,0,0.35);
            cursor:pointer;
          ">${d.temp.toFixed(0)}°</div>`,
          iconSize:   [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.marker([d.lat, d.lon], { icon })

        marker.bindTooltip(`
          <div style="font-size:12px;line-height:1.5">
            <strong>${d.station}</strong><br/>
            ${d.dept} · ${d.region}
          </div>`, {
          direction: "top",
          offset:    [0, -16],
          opacity:   0.95,
        })

        marker.bindPopup(`
          <div style="font-size:12px;line-height:1.7;min-width:190px">
            <p style="font-size:14px;font-weight:600;margin:0 0 4px">${d.station}</p>
            <p style="color:#6b7280;font-size:11px;margin:0 0 8px">${d.dept} · ${d.region}</p>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="color:#6b7280;padding:2px 0">Temperatura</td>
                <td style="text-align:right;font-weight:500">${d.temp.toFixed(1)}°C</td>
              </tr>
              <tr>
                <td style="color:#6b7280;padding:2px 0">Humedad</td>
                <td style="text-align:right;font-weight:500">${d.humidity}%</td>
              </tr>
              <tr>
                <td style="color:#6b7280;padding:2px 0">Viento</td>
                <td style="text-align:right;font-weight:500">${d.wind_speed.toFixed(1)} m/s</td>
              </tr>
              ${d.rain_1h > 0 ? `
              <tr>
                <td style="color:#6b7280;padding:2px 0">Lluvia</td>
                <td style="text-align:right;font-weight:500">${d.rain_1h.toFixed(1)} mm/h</td>
              </tr>` : ""}
              <tr>
                <td style="color:#6b7280;padding:2px 0">Nubosidad</td>
                <td style="text-align:right;font-weight:500">${d.clouds}%</td>
              </tr>
            </table>
            <div style="
              margin-top:8px;padding:4px 8px;
              background:${getAlertColor(d.alert)}22;
              border-left:3px solid ${getAlertColor(d.alert)};
              border-radius:0 4px 4px 0;
              font-size:11px;font-weight:500;
              color:${getAlertColor(d.alert)}
            ">${d.alert}</div>
          </div>`, { maxWidth: 260 })

        if (mapInstance.current) {
          marker.addTo(mapInstance.current)
          markersRef.current.push(marker)
        }
      })
    })
  }, [mapReady, data, mode])

  const TEMP_LEGEND = [
    { color: "#1a3a6e", label: "< −5°C"   },
    { color: "#1565C0", label: "−5–0°C"   },
    { color: "#42A5F5", label: "0–5°C"    },
    { color: "#4DD0E1", label: "5–10°C"   },
    { color: "#80CBC4", label: "10–15°C"  },
    { color: "#AED581", label: "15–20°C"  },
    { color: "#f9e84d", label: "20–25°C"  },
    { color: "#FFA726", label: "25–30°C"  },
    { color: "#E53935", label: "> 30°C"   },
  ]

  const ALERT_LEGEND = [
    { color: "#43A047", label: "Normal"          },
    { color: "#4DD0E1", label: "Lluvia moderada" },
    { color: "#3949AB", label: "Lluvia intensa"  },
    { color: "#42A5F5", label: "Helada moderada" },
    { color: "#1565C0", label: "Helada severa"   },
  ]

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{
          display: "flex", gap: 2,
          background: "var(--color-bg-subtle)",
          border: "1px solid var(--color-border)",
          borderRadius: 999,
          padding: 3,
        }}>
          {(["temperatura", "alerta"] as MapMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)} style={{
              padding: "4px 12px",
              fontSize: 11,
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              background: mode === m ? "var(--color-bg-surface)" : "transparent",
              color: mode === m ? "var(--color-text-primary)" : "var(--color-text-muted)",
              fontWeight: mode === m ? 500 : 400,
              boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
            }}>
              {m === "temperatura" ? "Temperatura" : "Alertas"}
            </button>
          ))}
        </div>
        <span style={{ fontSize: 11, color: "var(--color-text-muted)" }}>{data.length} estaciones</span>
      </div>

      <div ref={mapRef} style={{ height: "420px", borderRadius: 10, overflow: "hidden", zIndex: 0 }} />

      {/* Leyenda */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px", marginTop: 12 }}>
        {(mode === "temperatura" ? TEMP_LEGEND : ALERT_LEGEND).map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--color-text-secondary)" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
