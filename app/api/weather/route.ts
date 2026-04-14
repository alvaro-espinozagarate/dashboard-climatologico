import { NextResponse } from "next/server"
import { STATIONS }     from "@/lib/stations"
import { WeatherData }  from "@/lib/types"

const API_KEY  = process.env.OWM_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

function getAlert(temp: number, rain: number): WeatherData["alert"] {
  if (temp < 0)  return "Helada severa"
  if (temp < 4)  return "Helada moderada"
  if (rain > 30) return "Lluvia intensa"
  if (rain > 10) return "Lluvia moderada"
  return "Normal"
}

export async function GET() {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "OWM_API_KEY no configurada en variables de entorno" },
      { status: 500 }
    )
  }

  const results = await Promise.allSettled(
    STATIONS.map(async (st) => {
      const res = await fetch(
        `${BASE_URL}?lat=${st.lat}&lon=${st.lon}&appid=${API_KEY}&units=metric&lang=es`,
        { next: { revalidate: 600 } }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status} para ${st.nombre}`)
      const d    = await res.json()
      const rain = d.rain?.["1h"] ?? 0
      return {
        station:     st.nombre,
        lat:         st.lat,
        lon:         st.lon,
        region:      st.region,
        dept:        st.dept,
        temp:        Math.round(d.main.temp     * 10) / 10,
        temp_max:    Math.round(d.main.temp_max * 10) / 10,
        temp_min:    Math.round(d.main.temp_min * 10) / 10,
        feels_like:  Math.round(d.main.feels_like * 10) / 10,
        humidity:    d.main.humidity,
        pressure:    d.main.pressure,
        description: d.weather[0].description,
        clouds:      d.clouds.all,
        wind_speed:  d.wind.speed,
        wind_deg:    d.wind.deg ?? 0,
        rain_1h:     rain,
        alert:       getAlert(d.main.temp, rain),
        updated_at:  new Date().toISOString(),
      } as WeatherData
    })
  )

  const data = results
    .filter((r): r is PromiseFulfilledResult<WeatherData> => r.status === "fulfilled")
    .map(r => r.value)

  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map(r => r.reason?.message)

  return NextResponse.json({ data, errors, total: data.length })
}
