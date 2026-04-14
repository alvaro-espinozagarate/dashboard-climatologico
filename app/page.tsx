"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { WeatherData, ForecastItem }         from "@/lib/types"
import { KPICard }      from "@/components/KPICard"
import { AlertPanel }   from "@/components/AlertPanel"
import { TempChart }    from "@/components/TempChart"
import { ForecastChart} from "@/components/ForecastChart"
import { StatsTable }   from "@/components/StatsTable"
import { RefreshCw, Radio } from "lucide-react"

// Leaflet necesita window → cargar sin SSR
const WeatherMap = dynamic(
  () => import("@/components/WeatherMap").then(m => m.WeatherMap),
  { ssr: false, loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-50 rounded-xl text-gray-400 text-sm">
      Cargando mapa...
    </div>
  )}
)

type Region = "Todas" | "Costa" | "Sierra" | "Selva"
type Tab    = "resumen" | "mapa" | "tabla" | "pronostico"

export default function Dashboard() {
  const [weather,    setWeather]    = useState<WeatherData[]>([])
  const [forecast,   setForecast]   = useState<ForecastItem[]>([])
  const [region,     setRegion]     = useState<Region>("Todas")
  const [tab,        setTab]        = useState<Tab>("resumen")
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [wRes, fRes] = await Promise.all([
        fetch("/api/weather"),
        fetch("/api/forecast"),
      ])
      const wJson = await wRes.json()
      const fJson = await fRes.json()
      setWeather(wJson.data  ?? [])
      setForecast(fJson.data ?? [])
      setLastUpdate(new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }))
    } catch {
      setError("No se pudo conectar con la API. Verifica tu OWM_API_KEY.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  const filtered = region === "Todas"
    ? weather
    : weather.filter(w => w.region === region)

  const avgTemp     = filtered.length
    ? (filtered.reduce((a, b) => a + b.temp,     0) / filtered.length).toFixed(1) : "--"
  const avgHumidity = filtered.length
    ? (filtered.reduce((a, b) => a + b.humidity, 0) / filtered.length).toFixed(1) : "--"
  const totalRain   = filtered.reduce((a, b) => a + b.rain_1h, 0).toFixed(1)
  const alerts      = filtered.filter(w => w.alert !== "Normal")

  const REGIONS: Region[] = ["Todas", "Costa", "Sierra", "Selva"]
  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: "resumen",    label: "Resumen",    icon: "" },
    { key: "mapa",       label: "Mapa",       icon: "" },
    { key: "tabla",      label: "Tabla",      icon: "" },
    { key: "pronostico", label: "Pronóstico", icon: "" },
  ]

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <Radio size={16} className="text-blue-500" />
            Monitor Climático — Perú
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {weather.length} estaciones · OpenWeatherMap · 25 departamentos
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex gap-1 bg-white border border-gray-200 rounded-full p-1">
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegion(r)}
                className={`px-3 py-1 text-xs rounded-full transition-all
                  ${region === r ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-800"}`}>
                {r}
              </button>
            ))}
          </div>
          <button onClick={fetchData} disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-200 bg-white rounded-full hover:border-gray-400 transition-all disabled:opacity-50">
            <RefreshCw size={11} className={loading ? "animate-spin" : ""} />
            {loading ? "Actualizando..." : lastUpdate ? `Actualizado ${lastUpdate}` : "Cargar"}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
          ⚠️ {error}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <KPICard label="Temperatura promedio" value={`${avgTemp} °C`}
          sub={`${filtered.length} estaciones · ${region}`} />
        <KPICard label="Humedad relativa"     value={`${avgHumidity} %`}
          sub="Promedio regional" />
        <KPICard label="Precipitación"        value={`${totalRain} mm`}
          sub="Acumulado última hora"
          warn={parseFloat(totalRain) > 20} />
        <KPICard label="Alertas activas"      value={String(alerts.length)}
          sub={alerts.length > 0 ? alerts[0].alert : "Sin eventos extremos"}
          danger={alerts.length > 0} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b border-gray-200">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-xs font-medium transition-all border-b-2 -mb-px flex items-center gap-1.5
              ${tab === t.key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-800"}`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* Tab: Resumen */}
      {tab === "resumen" && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-3">Temperatura actual por estación</p>
              {loading && !weather.length
                ? <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Cargando...</div>
                : <TempChart data={filtered} />}
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-3">Eventos extremos</p>
              <AlertPanel data={filtered} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {(["Costa", "Sierra", "Selva"] as Region[]).map(reg => {
              const regData = weather.filter(w => w.region === reg)
              if (!regData.length) return null
              const avg = (regData.reduce((a, b) => a + b.temp, 0) / regData.length).toFixed(1)
              const max = Math.max(...regData.map(w => w.temp)).toFixed(1)
              const min = Math.min(...regData.map(w => w.temp)).toFixed(1)
              const border = reg === "Costa" ? "border-l-blue-400" : reg === "Sierra" ? "border-l-purple-400" : "border-l-green-400"
              return (
                <div key={reg} className={`bg-white border border-gray-200 border-l-4 ${border} rounded-xl p-4`}>
                  <p className="text-xs font-medium text-gray-500 mb-2">{reg}</p>
                  <p className="text-xl font-medium text-gray-900">{avg}°C <span className="text-xs text-gray-400">promedio</span></p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="text-red-500">↑ {max}°</span> / <span className="text-blue-500">↓ {min}°</span>
                    {" · "}{regData.length} estaciones
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Tab: Mapa */}
      {tab === "mapa" && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-3">
            Mapa geográfico de estaciones — {filtered.length} puntos
          </p>
          {loading && !weather.length
            ? <div className="h-96 flex items-center justify-center text-gray-400 text-sm">Cargando datos...</div>
            : <WeatherMap data={filtered} />
          }
        </div>
      )}

      {/* Tab: Tabla */}
      {tab === "tabla" && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-4">Detalle por estación — {filtered.length} registros</p>
          {loading && !weather.length
            ? <div className="h-32 flex items-center justify-center text-gray-400 text-sm">Cargando...</div>
            : <StatsTable data={filtered} />}
        </div>
      )}

      {/* Tab: Pronóstico */}
      {tab === "pronostico" && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs font-medium text-gray-500 mb-4">Pronóstico 5 días — temperatura cada 3 horas</p>
          {loading && !forecast.length
            ? <div className="h-48 flex items-center justify-center text-gray-400 text-sm">Cargando pronóstico...</div>
            : <ForecastChart
                data={forecast.filter(f =>
                  region === "Todas" ? true : filtered.map(w => w.station).includes(f.station)
                )}
                stations={filtered.map(w => w.station)}
              />}
        </div>
      )}

      <p className="text-center text-xs text-gray-300 mt-6">
        Datos: OpenWeatherMap API · Estaciones basadas en red SENAMHI Perú
      </p>
    </main>
  )
}
