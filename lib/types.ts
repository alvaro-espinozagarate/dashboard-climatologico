export interface Station {
  id:     string
  nombre: string
  lat:    number
  lon:    number
  region: "Costa" | "Sierra" | "Selva"
  dept:   string
}

export interface WeatherData {
  station:     string
  lat:         number
  lon:         number
  region:      string
  dept:        string
  temp:        number
  temp_max:    number
  temp_min:    number
  feels_like:  number
  humidity:    number
  pressure:    number
  description: string
  clouds:      number
  wind_speed:  number
  wind_deg:    number
  rain_1h:     number
  alert:       "Normal" | "Lluvia moderada" | "Lluvia intensa" | "Helada moderada" | "Helada severa"
  updated_at:  string
}

export interface ForecastItem {
  station:     string
  datetime:    string
  date:        string
  hour:        number
  temp:        number
  temp_max:    number
  temp_min:    number
  humidity:    number
  description: string
  rain_3h:     number
}
