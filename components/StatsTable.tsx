import { WeatherData } from "@/lib/types"
import { Wind, Droplets, Thermometer, CloudRain } from "lucide-react"

export function StatsTable({ data }: { data: WeatherData[] }) {
  const sorted = [...data].sort((a, b) => b.temp - a.temp)

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Estación</th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Región</th>
            <th className="text-right py-2 px-2 text-gray-400 font-medium">
              <span className="flex items-center justify-end gap-1"><Thermometer size={10}/>Temp</span>
            </th>
            <th className="text-right py-2 px-2 text-gray-400 font-medium">
              <span className="flex items-center justify-end gap-1"><Droplets size={10}/>HR</span>
            </th>
            <th className="text-right py-2 px-2 text-gray-400 font-medium">
              <span className="flex items-center justify-end gap-1"><Wind size={10}/>Viento</span>
            </th>
            <th className="text-right py-2 px-2 text-gray-400 font-medium">
              <span className="flex items-center justify-end gap-1"><CloudRain size={10}/>PP</span>
            </th>
            <th className="text-left py-2 px-2 text-gray-400 font-medium">Estado</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(w => (
            <tr key={w.station} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="py-2 px-2 font-medium text-gray-800">{w.station}</td>
              <td className="py-2 px-2 text-gray-500">{w.region}</td>
              <td className="py-2 px-2 text-right font-medium text-gray-800">{w.temp.toFixed(1)}°</td>
              <td className="py-2 px-2 text-right text-gray-600">{w.humidity}%</td>
              <td className="py-2 px-2 text-right text-gray-600">{w.wind_speed.toFixed(1)} m/s</td>
              <td className="py-2 px-2 text-right text-gray-600">{w.rain_1h.toFixed(1)} mm</td>
              <td className="py-2 px-2">
                {w.alert !== "Normal" ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                    ${w.alert.includes("Helada") ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                    {w.alert}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-50 text-green-600">Normal</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
