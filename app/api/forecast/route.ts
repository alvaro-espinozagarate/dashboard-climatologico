import { NextResponse }  from "next/server"
import { STATIONS }      from "@/lib/stations"
import { ForecastItem }  from "@/lib/types"

const API_KEY  = process.env.OWM_API_KEY
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast"

export async function GET(req: Request) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "OWM_API_KEY no configurada en variables de entorno" },
      { status: 500 }
    )
  }

  const { searchParams } = new URL(req.url)
  const stationId        = searchParams.get("station")
  const targets          = stationId
    ? STATIONS.filter(s => s.id === stationId)
    : STATIONS

  const results = await Promise.allSettled(
    targets.map(async (st) => {
      const res = await fetch(
        `${BASE_URL}?lat=${st.lat}&lon=${st.lon}&appid=${API_KEY}&units=metric&lang=es`,
        { next: { revalidate: 3600 } }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status} para ${st.nombre}`)
      const d = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return d.list.map((item: any): ForecastItem => ({
        station:     st.nombre,
        datetime:    new Date(item.dt * 1000).toISOString(),
        date:        new Date(item.dt * 1000).toISOString().split("T")[0],
        hour:        new Date(item.dt * 1000).getUTCHours(),
        temp:        Math.round(item.main.temp     * 10) / 10,
        temp_max:    Math.round(item.main.temp_max * 10) / 10,
        temp_min:    Math.round(item.main.temp_min * 10) / 10,
        humidity:    item.main.humidity,
        description: item.weather[0].description,
        rain_3h:     item.rain?.["3h"] ?? 0,
      }))
    })
  )

  const data = results
    .filter((r): r is PromiseFulfilledResult<ForecastItem[]> => r.status === "fulfilled")
    .flatMap(r => r.value)

  return NextResponse.json({ data, total: data.length })
}
