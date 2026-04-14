"use client"

import { useEffect, useRef, useState } from "react"
import { WeatherData } from "@/lib/types"

type MapMode = "temperatura" | "alerta"

interface Props {
  data: WeatherData[]
}

function getTempColor(temp: number): string {
  if (temp < 0)  return "#0C447C"
  if (temp < 5)  return "#185FA5"
  if (temp < 12) return "#378ADD"
  if (temp < 18) return "#85B7EB"
  if (temp < 24) return "#EF9F27"
  if (temp < 30) return "#D85A30"
  return "#E24B4A"
}

function getAlertColor(alert: WeatherData["alert"]): string {
  switch (alert) {
    case "Helada severa":   return "#0C447C"
    case "Helada moderada": return "#378ADD"
    case "Lluvia intensa":  return "#E24B4A"
    case "Lluvia moderada": return "#EF9F27"
    default:                return "#1D9E75"
  }
}

export function WeatherMap({ data }: Props) {
  const mapRef      = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markersRef  = useRef<any[]>([])
  const [mode, setMode]       = useState<MapMode>("temperatura")
  const [mapReady, setMapReady] = useState(false) // ← nuevo flag

  // Inicializar mapa una sola vez
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!mapRef.current)               return
    if (mapInstance.current)           return

    // Limpiar _leaflet_id si quedó de un montaje anterior
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((mapRef.current as any)._leaflet_id) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(mapRef.current as any)._leaflet_id = undefined
    }

    import("leaflet").then((L) => {
      if (!mapRef.current)     return
      if (mapInstance.current) return

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl
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

      // ← Avisar que el mapa está listo DESPUÉS de que Leaflet termina
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

  // Pintar marcadores solo cuando el mapa está listo Y hay datos
  useEffect(() => {
    if (!mapReady)             return
    if (!mapInstance.current)  return
    if (!data.length)          return

    import("leaflet").then((L) => {
      // Limpiar marcadores anteriores
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []

      data.forEach((d) => {
        const color = mode === "temperatura"
          ? getTempColor(d.temp)
          : getAlertColor(d.alert)

        const icon = L.divIcon({
          className: "",
          html: `<div style="
            width:32px;height:32px;
            background:${color};
            border:2px solid white;
            border-radius:50%;
            display:flex;align-items:center;justify-content:center;
            font-size:9px;font-weight:600;color:white;
            box-shadow:0 2px 6px rgba(0,0,0,0.3);
            cursor:pointer;
          ">${d.temp.toFixed(0)}°</div>`,
          iconSize:   [32, 32],
          iconAnchor: [16, 16],
        })

        const marker = L.marker([d.lat, d.lon], { icon })

        // Tooltip rápido (hover)
        marker.bindTooltip(`
          <div style="font-size:12px;line-height:1.5">
            <strong>${d.station}</strong><br/>
            ${d.dept} · ${d.region}
          </div>`, {
          direction: "top",
          offset:    [0, -16],
          opacity:   0.95,
        })

        // Popup completo (click)
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

        marker.addTo(mapInstance.current)
        markersRef.current.push(marker)
      })
    })
  }, [mapReady, data, mode]) // ← mapReady como dependencia

  return (
    <div>
      {/* Toggle modo */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1 bg-gray-100 rounded-full p-1">
          {(["temperatura", "alerta"] as MapMode[]).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-3 py-1 text-xs rounded-full transition-all
                ${mode === m
                  ? "bg-white text-gray-800 shadow-sm font-medium"
                  : "text-gray-500 hover:text-gray-700"}`}>
              {m === "temperatura" ? "Temperatura" : "Alertas"}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400">{data.length} estaciones</span>
      </div>

      {/* Contenedor del mapa */}
      <div
        ref={mapRef}
        style={{ height: "420px", borderRadius: "10px", overflow: "hidden", zIndex: 0 }}
      />

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mt-3">
        {mode === "temperatura" ? (
          <>
            <LegendItem color="#0C447C" label="< 0°C"   />
            <LegendItem color="#185FA5" label="0–5°C"   />
            <LegendItem color="#378ADD" label="5–12°C"  />
            <LegendItem color="#85B7EB" label="12–18°C" />
            <LegendItem color="#EF9F27" label="18–24°C" />
            <LegendItem color="#D85A30" label="24–30°C" />
            <LegendItem color="#E24B4A" label="> 30°C"  />
          </>
        ) : (
          <>
            <LegendItem color="#1D9E75" label="Normal"          />
            <LegendItem color="#EF9F27" label="Lluvia moderada" />
            <LegendItem color="#E24B4A" label="Lluvia intensa"  />
            <LegendItem color="#378ADD" label="Helada moderada" />
            <LegendItem color="#0C447C" label="Helada severa"   />
          </>
        )}
      </div>
    </div>
  )
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-gray-600">
      <div style={{ width: 12, height: 12, borderRadius: "50%", background: color, flexShrink: 0 }} />
      {label}
    </div>
  )
}
