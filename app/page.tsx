"use client"

import { useEffect, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import { WeatherData, ForecastItem }         from "@/lib/types"
import { KPICard }      from "@/components/KPICard"
import { AlertPanel }   from "@/components/AlertPanel"
import { TempChart }    from "@/components/TempChart"
import { ForecastChart} from "@/components/ForecastChart"
import { StatsTable }   from "@/components/StatsTable"
import { RefreshCw, Radio, Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/ThemeContext"

const WeatherMap = dynamic(
  () => import("@/components/WeatherMap").then(m => m.WeatherMap),
  { ssr: false, loading: () => (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      height: 384, background: "var(--bg-elevated)",
      borderRadius: 12, color: "var(--text-3)", fontSize: 13,
    }}>
      Cargando mapa...
    </div>
  )}
)

type Region = "Todas" | "Costa" | "Sierra" | "Selva"
type Tab    = "resumen" | "mapa" | "tabla" | "pronostico"

const accentLeft: Record<string, string> = {
  Costa:  "#0066CC",
  Sierra: "#5E35B1",
  Selva:  "#00897B",
}

export default function Dashboard() {
  const { theme, toggle } = useTheme()
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
  const TABS: { key: Tab; label: string }[] = [
    { key: "resumen",    label: "Resumen"    },
    { key: "mapa",       label: "Mapa"       },
    { key: "tabla",      label: "Tabla"      },
    { key: "pronostico", label: "Pronóstico" },
  ]

  const surface = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 16,
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "var(--bg-page)",
      padding: "24px",
      transition: "background 0.25s ease",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 20,
      }}>
        <div>
          <h1 style={{
            fontSize: 15,
            fontWeight: 500,
            color: "var(--text-1)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <Radio size={15} style={{ color: "var(--accent)" }} />
            Monitor Climático — Perú
          </h1>
          <p style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>
            {weather.length} estaciones · OpenWeatherMap · 25 departamentos
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
          {/* Filtro región */}
          <div style={{
            display: "flex", gap: 2,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            padding: "3px",
          }}>
            {REGIONS.map(r => (
              <button key={r} onClick={() => setRegion(r)} style={{
                padding: "4px 12px",
                fontSize: 11,
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                background: region === r ? "var(--accent)" : "transparent",
                color: region === r ? "#fff" : "var(--text-2)",
                fontWeight: region === r ? 500 : 400,
              }}>{r}</button>
            ))}
          </div>

          {/* Refresh */}
          <button onClick={fetchData} disabled={loading} style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px",
            fontSize: 11,
            border: "1px solid var(--border)",
            background: "var(--bg-surface)",
            color: "var(--text-2)",
            borderRadius: 999,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
            transition: "all 0.15s",
          }}>
            <RefreshCw size={11} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {loading ? "Actualizando..." : lastUpdate ? `Actualizado ${lastUpdate}` : "Cargar"}
          </button>

          {/* Dark toggle */}
          <button onClick={toggle}
            aria-label={theme === "dark" ? "Modo claro" : "Modo oscuro"}
            style={{
              width: 32, height: 32,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid var(--border)",
              background: "var(--bg-surface)",
              color: "var(--text-2)",
              borderRadius: "50%",
              cursor: "pointer",
              transition: "all 0.15s",
            }}>
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
        </div>
      </div>

      {/* ── Error ── */}
      {error && (
        <div style={{
          marginBottom: 16,
          padding: "10px 14px",
          background: "var(--alert-frost-severe-bg)",
          border: "1px solid var(--alert-frost-severe-border)",
          borderRadius: 8,
          fontSize: 12,
          color: "var(--alert-frost-severe-text)",
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 12, marginBottom: 16 }}>
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

      {/* ── Tabs ── */}
      <div style={{
        display: "flex", gap: 0,
        borderBottom: "1px solid var(--border)",
        marginBottom: 16,
      }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "9px 16px",
            fontSize: 12,
            fontWeight: tab === t.key ? 500 : 400,
            border: "none",
            borderBottom: tab === t.key ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -1,
            background: "transparent",
            color: tab === t.key ? "var(--accent)" : "var(--text-2)",
            cursor: "pointer",
            transition: "all 0.15s",
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── Resumen ── */}
      {tab === "resumen" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,2fr) minmax(0,1fr)", gap: 16 }}>
            <div style={surface}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginBottom: 12 }}>
                Temperatura actual por estación
              </p>
              {loading && !weather.length
                ? <div style={{ height: 192, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: 13 }}>Cargando...</div>
                : <TempChart data={filtered} />}
            </div>
            <div style={surface}>
              <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginBottom: 12 }}>
                Eventos extremos
              </p>
              <AlertPanel data={filtered} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12 }}>
            {(["Costa", "Sierra", "Selva"] as Region[]).map(reg => {
              const regData = weather.filter(w => w.region === reg)
              if (!regData.length) return null
              const avg = (regData.reduce((a, b) => a + b.temp, 0) / regData.length).toFixed(1)
              const max = Math.max(...regData.map(w => w.temp)).toFixed(1)
              const min = Math.min(...regData.map(w => w.temp)).toFixed(1)
              return (
                <div key={reg} style={{
                  ...surface,
                  borderLeft: `3px solid ${accentLeft[reg]}`,
                  borderRadius: "0 12px 12px 0",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginBottom: 6 }}>{reg}</p>
                  <p style={{ fontSize: 20, fontWeight: 500, color: "var(--text-1)", lineHeight: 1 }}>
                    {avg}°C <span style={{ fontSize: 11, color: "var(--text-3)", fontWeight: 400 }}>promedio</span>
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-2)", marginTop: 6 }}>
                    <span style={{ color: "#E53935" }}>↑ {max}°</span>
                    {" / "}
                    <span style={{ color: "#42A5F5" }}>↓ {min}°</span>
                    {" · "}{regData.length} estaciones
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Mapa ── */}
      {tab === "mapa" && (
        <div style={surface}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginBottom: 12 }}>
            Mapa geográfico de estaciones — {filtered.length} puntos
          </p>
          {loading && !weather.length
            ? <div style={{ height: 384, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: 13 }}>Cargando datos...</div>
            : <WeatherMap data={filtered} />}
        </div>
      )}

      {/* ── Tabla ── */}
      {tab === "tabla" && (
        <div style={surface}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginBottom: 16 }}>
            Detalle por estación — {filtered.length} registros
          </p>
          {loading && !weather.length
            ? <div style={{ height: 128, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: 13 }}>Cargando...</div>
            : <StatsTable data={filtered} />}
        </div>
      )}

      {/* ── Pronóstico ── */}
      {tab === "pronostico" && (
        <div style={surface}>
          <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-3)", marginBottom: 16 }}>
            Pronóstico 5 días — temperatura cada 3 horas
          </p>
          {loading && !forecast.length
            ? <div style={{ height: 192, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-3)", fontSize: 13 }}>Cargando pronóstico...</div>
            : <ForecastChart
                data={forecast.filter(f =>
                  region === "Todas" ? true : filtered.map(w => w.station).includes(f.station)
                )}
                stations={filtered.map(w => w.station)}
              />}
        </div>
      )}

      <p style={{
        textAlign: "center",
        fontSize: 11,
        color: "var(--text-3)",
        marginTop: 24,
        opacity: 0.6,
      }}>
        Datos: OpenWeatherMap API · Estaciones basadas en red SENAMHI Perú
      </p>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          main { padding: 16px !important; }
        }
      `}</style>
    </main>
  )
}
