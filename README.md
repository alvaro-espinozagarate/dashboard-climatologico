# 🌦️ Monitor Climático Perú — Dashboard

Dashboard de estaciones meteorológicas automáticas basado en OpenWeatherMap, construido con Next.js 14 y desplegable.

## ✅ Requisitos previos

- Node.js 18+
- API Key de [OpenWeatherMap](https://openweathermap.org/api) (plan gratuito)

---

## 🚀 Instalación local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de variables de entorno
cp .env.local.example .env.local

# 3. Editar .env.local y poner tu API key real
# OWM_API_KEY=tu_api_key_aqui

# 4. Correr en desarrollo
npm run dev
```

Abre http://localhost:3000

---

## ➕ Agregar más estaciones

Edita el archivo `lib/stations.ts` y agrega un objeto al array `STATIONS`:

```typescript
{ 
  id:     "id_unico",        // identificador único sin espacios
  nombre: "Nombre Ciudad",   // nombre visible en el dashboard
  lat:    -X.XXXX,           // latitud (negativo para sur)
  lon:    -XX.XXXX,          // longitud (negativo para oeste)
  region: "Costa",           // "Costa" | "Sierra" | "Selva"
  dept:   "Departamento",    // nombre del departamento
},
```

### Estaciones disponibles para agregar (Perú)

| Ciudad        | Lat       | Lon       | Región  | Dept         |
|---------------|-----------|-----------|---------|--------------|
| Moquegua      | -17.1939  | -70.9350  | Costa   | Moquegua     |
| Sullana       | -4.9041   | -80.6855  | Costa   | Piura        |
| Huánuco       | -9.9306   | -76.2422  | Sierra  | Huánuco      |
| Abancay       | -13.6394  | -72.8814  | Sierra  | Apurímac     |
| Cerro de Pasco| -10.6858  | -76.2637  | Sierra  | Pasco        |
| Atalaya       | -10.7297  | -73.7600  | Selva   | Ucayali      |
| Yurimaguas    | -5.9000   | -76.1167  | Selva   | Loreto       |
| Bagua Grande  | -5.7667   | -78.4500  | Selva   | Amazonas     |

---

## 📁 Estructura del proyecto

```
senamhi-dashboard/
├── app/
│   ├── api/
│   │   ├── weather/route.ts    ← proxy clima actual (cache 10 min)
│   │   └── forecast/route.ts   ← proxy pronóstico 5 días (cache 1h)
│   ├── page.tsx                ← dashboard principal
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── KPICard.tsx             ← tarjetas de métricas
│   ├── AlertPanel.tsx          ← panel de eventos extremos
│   ├── TempChart.tsx           ← gráfico de barras temperatura
│   ├── ForecastChart.tsx       ← gráfico de líneas pronóstico
│   └── StatsTable.tsx          ← tabla detalle por estación
├── lib/
│   ├── stations.ts             ← configuración de estaciones ← EDITAR AQUÍ
│   └── types.ts                ← tipos TypeScript
├── .env.local.example          ← plantilla de variables de entorno
├── .gitignore
└── README.md
```

---

## ⚠️ Seguridad

- **Nunca subas `.env.local` a GitHub** — está en `.gitignore`
- La API key vive solo en Vercel (servidor) y en tu `.env.local` local
- Las rutas `/api/weather` y `/api/forecast` actúan como proxy seguro
- El navegador del usuario nunca ve la API key

---

## 📊 Límites del plan gratuito OpenWeatherMap

| Endpoint        | Límite       |
|-----------------|--------------|
| Current Weather | 1,000,000/mes |
| Forecast 5 días | 1,000,000/mes |

Con 21 estaciones y cache de 10 min → ~90,000 llamadas/mes. Bien dentro del límite gratuito.
