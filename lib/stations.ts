import { Station } from "./types"

export const STATIONS: Station[] = [

  // ── AMAZONAS ──────────────────────────────────────────────
  { id: "chachapoyas",  nombre: "Chachapoyas",   lat:  -6.2318, lon: -77.8731, region: "Sierra", dept: "Amazonas"      },
  { id: "bagua_grande", nombre: "Bagua Grande",  lat:  -5.7500, lon: -78.4500, region: "Selva",  dept: "Amazonas"      },

  // ── ÁNCASH ────────────────────────────────────────────────
  { id: "huaraz",       nombre: "Huaraz",         lat:  -9.5300, lon: -77.5283, region: "Sierra", dept: "Áncash"        },
  { id: "chimbote",     nombre: "Chimbote",       lat:  -9.0853, lon: -78.5783, region: "Costa",  dept: "Áncash"        },

  // ── APURÍMAC ──────────────────────────────────────────────
  { id: "abancay",      nombre: "Abancay",        lat: -13.6394, lon: -72.8814, region: "Sierra", dept: "Apurímac"      },
  { id: "andahuaylas",  nombre: "Andahuaylas",    lat: -13.6562, lon: -73.3750, region: "Sierra", dept: "Apurímac"      },

  // ── AREQUIPA ──────────────────────────────────────────────
  { id: "arequipa",     nombre: "Arequipa",       lat: -16.4090, lon: -71.5375, region: "Sierra", dept: "Arequipa"      },
  { id: "camana",       nombre: "Camaná",         lat: -16.6228, lon: -72.7108, region: "Costa",  dept: "Arequipa"      },

  // ── AYACUCHO ──────────────────────────────────────────────
  { id: "ayacucho",     nombre: "Ayacucho",       lat: -13.1588, lon: -74.2236, region: "Sierra", dept: "Ayacucho"      },
  { id: "huanta",       nombre: "Huanta",         lat: -12.9333, lon: -74.2500, region: "Sierra", dept: "Ayacucho"      },

  // ── CAJAMARCA ─────────────────────────────────────────────
  { id: "cajamarca",    nombre: "Cajamarca",      lat:  -7.1617, lon: -78.5127, region: "Sierra", dept: "Cajamarca"     },
  { id: "jaen",         nombre: "Jaén",           lat:  -5.7069, lon: -78.8072, region: "Selva",  dept: "Cajamarca"     },

  // ── CALLAO ────────────────────────────────────────────────
  { id: "callao",       nombre: "Callao",         lat: -12.0565, lon: -77.1181, region: "Costa",  dept: "Callao"        },

  // ── CUSCO ─────────────────────────────────────────────────
  { id: "cusco",        nombre: "Cusco",          lat: -13.5319, lon: -71.9675, region: "Sierra", dept: "Cusco"         },
  { id: "quillabamba",  nombre: "Quillabamba",    lat: -12.8592, lon: -72.6936, region: "Selva",  dept: "Cusco"         },

  // ── HUANCAVELICA ──────────────────────────────────────────
  { id: "huancavelica", nombre: "Huancavelica",   lat: -12.7869, lon: -74.9758, region: "Sierra", dept: "Huancavelica"  },

  // ── HUÁNUCO ───────────────────────────────────────────────
  { id: "huanuco",      nombre: "Huánuco",        lat:  -9.9306, lon: -76.2422, region: "Sierra", dept: "Huánuco"       },
  { id: "tingo_maria",  nombre: "Tingo María",    lat:  -9.2942, lon: -75.9978, region: "Selva",  dept: "Huánuco"       },

  // ── ICA ───────────────────────────────────────────────────
  { id: "ica",          nombre: "Ica",            lat: -14.0755, lon: -75.7286, region: "Costa",  dept: "Ica"           },
  { id: "nazca",        nombre: "Nasca",          lat: -14.8294, lon: -74.9444, region: "Costa",  dept: "Ica"           },

  // ── JUNÍN ─────────────────────────────────────────────────
  { id: "huancayo",     nombre: "Huancayo",       lat: -12.0651, lon: -75.2049, region: "Sierra", dept: "Junín"         },
  { id: "la_merced",    nombre: "La Merced",      lat: -11.0547, lon: -75.3214, region: "Selva",  dept: "Junín"         },

  // ── LA LIBERTAD ───────────────────────────────────────────
  { id: "trujillo",     nombre: "Trujillo",       lat:  -8.1120, lon: -79.0288, region: "Costa",  dept: "La Libertad"   },
  { id: "otuzco",       nombre: "Otuzco",         lat:  -7.9017, lon: -78.5678, region: "Sierra", dept: "La Libertad"   },

  // ── LAMBAYEQUE ────────────────────────────────────────────
  { id: "chiclayo",     nombre: "Chiclayo",       lat:  -6.7714, lon: -79.8409, region: "Costa",  dept: "Lambayeque"    },
  { id: "ferrenafe",    nombre: "Ferreñafe",      lat:  -6.6372, lon: -79.7903, region: "Costa",  dept: "Lambayeque"    },

  // ── LIMA ──────────────────────────────────────────────────
  { id: "lima",         nombre: "Lima",           lat: -12.0464, lon: -77.0428, region: "Costa",  dept: "Lima"          },
  { id: "huacho",       nombre: "Huacho",         lat: -11.1069, lon: -77.6053, region: "Costa",  dept: "Lima"          },
  { id: "canete",       nombre: "Cañete",         lat: -13.0769, lon: -76.3656, region: "Costa",  dept: "Lima"          },
  { id: "matucana",     nombre: "Matucana",       lat: -11.8456, lon: -76.3939, region: "Sierra", dept: "Lima"          },

  // ── LORETO ────────────────────────────────────────────────
  { id: "iquitos",      nombre: "Iquitos",        lat:  -3.7491, lon: -73.2538, region: "Selva",  dept: "Loreto"        },
  { id: "yurimaguas",   nombre: "Yurimaguas",     lat:  -5.9000, lon: -76.1167, region: "Selva",  dept: "Loreto"        },

  // ── MADRE DE DIOS ─────────────────────────────────────────
  { id: "pmaldonado",   nombre: "Pto. Maldonado", lat: -12.5933, lon: -69.1891, region: "Selva",  dept: "Madre de Dios" },

  // ── MOQUEGUA ──────────────────────────────────────────────
  { id: "moquegua",     nombre: "Moquegua",       lat: -17.1939, lon: -70.9350, region: "Costa",  dept: "Moquegua"      },

  // ── PASCO ─────────────────────────────────────────────────
  { id: "cerro_pasco",  nombre: "Cerro de Pasco", lat: -10.6858, lon: -76.2637, region: "Sierra", dept: "Pasco"         },
  { id: "oxapampa",     nombre: "Oxapampa",       lat: -10.5781, lon: -75.3992, region: "Selva",  dept: "Pasco"         },

  // ── PIURA ─────────────────────────────────────────────────
  { id: "piura",        nombre: "Piura",          lat:  -5.1945, lon: -80.6328, region: "Costa",  dept: "Piura"         },
  { id: "sullana",      nombre: "Sullana",        lat:  -4.9041, lon: -80.6855, region: "Costa",  dept: "Piura"         },
  { id: "talara",       nombre: "Talara",         lat:  -4.5772, lon: -81.2719, region: "Costa",  dept: "Piura"         },

  // ── PUNO ──────────────────────────────────────────────────
  { id: "puno",         nombre: "Puno",           lat: -15.8402, lon: -70.0219, region: "Sierra", dept: "Puno"          },
  { id: "juliaca",      nombre: "Juliaca",        lat: -15.5000, lon: -70.1333, region: "Sierra", dept: "Puno"          },

  // ── SAN MARTÍN ────────────────────────────────────────────
  { id: "tarapoto",     nombre: "Tarapoto",       lat:  -6.4833, lon: -76.3667, region: "Selva",  dept: "San Martín"    },
  { id: "moyobamba",    nombre: "Moyobamba",      lat:  -6.0345, lon: -76.9725, region: "Selva",  dept: "San Martín"    },

  // ── TACNA ─────────────────────────────────────────────────
  { id: "tacna",        nombre: "Tacna",          lat: -18.0066, lon: -70.2462, region: "Costa",  dept: "Tacna"         },

  // ── TUMBES ────────────────────────────────────────────────
  { id: "tumbes",       nombre: "Tumbes",         lat:  -3.5669, lon: -80.4515, region: "Costa",  dept: "Tumbes"        },

  // ── UCAYALI ───────────────────────────────────────────────
  { id: "pucallpa",     nombre: "Pucallpa",       lat:  -8.3791, lon: -74.5539, region: "Selva",  dept: "Ucayali"       },
  { id: "atalaya",      nombre: "Atalaya",        lat: -10.7297, lon: -73.7600, region: "Selva",  dept: "Ucayali"       },

]

// ── Para agregar más ciudades ──────────────────────────────────
// { id: "id_unico", nombre: "Ciudad", lat: X.XXXX, lon: -XX.XXXX, region: "Costa"|"Sierra"|"Selva", dept: "Departamento" },
