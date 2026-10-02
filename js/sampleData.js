/**
 * sampleData.js - Partidos reales de Boca Juniors
 * Calendario oficial Septiembre - Diciembre 2026
 */

export const INITIAL_MATCHES = [
  // --- SEPTIEMBRE 2026 ---
  {
    id: "boca-sanlorenzo-2009",
    date: "2026-09-20",
    time: "19:00",
    opponent: "San Lorenzo",
    opponentPrimaryColor: "#0A1F44",
    opponentSecondaryColor: "#C01424",
    venue: "Local",
    competition: "Torneo Clausura",
    stage: "Fecha Regular",
    badgeUrl: ""
  },
  {
    id: "boca-racing-2709",
    date: "2026-09-27",
    time: "17:00",
    opponent: "Racing Club",
    opponentPrimaryColor: "#75AADB",
    opponentSecondaryColor: "#FFFFFF",
    venue: "Neutral",
    competition: "Torneo Clausura",
    stage: "Fecha Interzonal",
    badgeUrl: ""
  },

  // --- OCTUBRE 2026 ---
  {
    id: "boca-union-0210",
    date: "2026-10-02",
    time: "21:30",
    opponent: "Unión de Santa Fe",
    opponentPrimaryColor: "#FFFFFF",
    opponentSecondaryColor: "#E02020",
    venue: "Local",
    competition: "Torneo Clausura",
    stage: "Fecha Regular",
    badgeUrl: ""
  },
  {
    id: "boca-instituto-0910",
    date: "2026-10-09",
    time: "20:00",
    opponent: "Instituto de Córdoba",
    opponentPrimaryColor: "#E02020",
    opponentSecondaryColor: "#FFFFFF",
    venue: "Visitante",
    competition: "Torneo Clausura",
    stage: "Fecha Regular",
    badgeUrl: ""
  },
  {
    id: "boca-vasco-1410",
    date: "2026-10-14",
    time: "21:30",
    opponent: "Vasco da Gama",
    opponentPrimaryColor: "#000000",
    opponentSecondaryColor: "#FFFFFF",
    venue: "Local",
    competition: "Copa Sudamericana",
    stage: "Semifinal - Ida",
    badgeUrl: ""
  },
  {
    id: "boca-talleres-1810",
    date: "2026-10-18",
    time: "19:15",
    opponent: "Talleres de Córdoba",
    opponentPrimaryColor: "#001E50",
    opponentSecondaryColor: "#FFFFFF",
    venue: "Local",
    competition: "Torneo Clausura",
    stage: "Fecha Regular",
    badgeUrl: ""
  },
  {
    id: "boca-vasco-2110",
    date: "2026-10-21",
    time: "21:30",
    opponent: "Vasco da Gama",
    opponentPrimaryColor: "#000000",
    opponentSecondaryColor: "#FFFFFF",
    venue: "Visitante",
    competition: "Copa Sudamericana",
    stage: "Semifinal - Vuelta",
    badgeUrl: ""
  },
  {
    id: "boca-independiente-2510",
    date: "2026-10-25",
    time: "18:00",
    opponent: "Independiente",
    opponentPrimaryColor: "#E21818",
    opponentSecondaryColor: "#FFFFFF",
    venue: "Visitante",
    competition: "Torneo Clausura",
    stage: "Clásico",
    badgeUrl: ""
  },

  // --- NOVIEMBRE 2026 ---
  {
    id: "boca-river-0111",
    date: "2026-11-01",
    time: "16:30",
    opponent: "River Plate",
    opponentPrimaryColor: "#FFFFFF",
    opponentSecondaryColor: "#E02020",
    venue: "Local",
    competition: "Torneo Clausura",
    stage: "Superclásico",
    badgeUrl: ""
  },
  {
    id: "boca-copaarg-0411",
    date: "2026-11-04",
    time: "21:10",
    opponent: "Final Copa Argentina",
    opponentPrimaryColor: "#FFC700",
    opponentSecondaryColor: "#002B66",
    venue: "Neutral",
    competition: "Copa Argentina",
    stage: "Gran Final",
    badgeUrl: ""
  },
  {
    id: "boca-defensa-0811",
    date: "2026-11-08",
    time: "20:00",
    opponent: "Defensa y Justicia",
    opponentPrimaryColor: "#006633",
    opponentSecondaryColor: "#FFD700",
    venue: "Local",
    competition: "Torneo Clausura",
    stage: "Fecha Regular",
    badgeUrl: ""
  },
  {
    id: "boca-sudamericana-2111",
    date: "2026-11-21",
    time: "17:00",
    opponent: "Final Sudamericana",
    opponentPrimaryColor: "#D4AF37",
    opponentSecondaryColor: "#051937",
    venue: "Neutral",
    competition: "Copa Sudamericana",
    stage: "Gran Final",
    badgeUrl: ""
  },
  {
    id: "boca-octavos-2511",
    date: "2026-11-25",
    time: "20:30",
    opponent: "Octavos Clausura",
    opponentPrimaryColor: "#002B66",
    opponentSecondaryColor: "#FFC700",
    venue: "Local",
    competition: "Torneo Clausura",
    stage: "Octavos de final",
    badgeUrl: ""
  },
  {
    id: "boca-cuartos-2811",
    date: "2026-11-28",
    time: "20:30",
    opponent: "Cuartos Clausura",
    opponentPrimaryColor: "#002B66",
    opponentSecondaryColor: "#FFC700",
    venue: "Neutral",
    competition: "Torneo Clausura",
    stage: "Cuartos de final",
    badgeUrl: ""
  },

  // --- DICIEMBRE 2026 ---
  {
    id: "boca-semifinal-0512",
    date: "2026-12-05",
    time: "20:30",
    opponent: "Semifinal Clausura",
    opponentPrimaryColor: "#002B66",
    opponentSecondaryColor: "#FFC700",
    venue: "Neutral",
    competition: "Torneo Clausura",
    stage: "Semifinal",
    badgeUrl: ""
  },
  {
    id: "boca-final-1212",
    date: "2026-12-12",
    time: "21:00",
    opponent: "Final Clausura",
    opponentPrimaryColor: "#FFC700",
    opponentSecondaryColor: "#002B66",
    venue: "Neutral",
    competition: "Torneo Clausura",
    stage: "Gran Final",
    badgeUrl: ""
  }
];

// Presets de clubes conocidos para autocompletar colores en el modal
export const OPPONENT_PRESETS = [
  { name: "San Lorenzo", primary: "#0A1F44", secondary: "#C01424" },
  { name: "Racing Club", primary: "#75AADB", secondary: "#FFFFFF" },
  { name: "Unión de Santa Fe", primary: "#FFFFFF", secondary: "#E02020" },
  { name: "Instituto de Córdoba", primary: "#E02020", secondary: "#FFFFFF" },
  { name: "Vasco da Gama", primary: "#000000", secondary: "#FFFFFF" },
  { name: "Talleres de Córdoba", primary: "#001E50", secondary: "#FFFFFF" },
  { name: "Independiente", primary: "#E21818", secondary: "#FFFFFF" },
  { name: "River Plate", primary: "#FFFFFF", secondary: "#E02020" },
  { name: "Defensa y Justicia", primary: "#006633", secondary: "#FFD700" },
  { name: "Vélez Sarsfield", primary: "#003399", secondary: "#FFFFFF" },
  { name: "Rosario Central", primary: "#0D2C6C", secondary: "#FFD000" },
  { name: "Newell's Old Boys", primary: "#000000", secondary: "#DC143C" },
  { name: "Estudiantes LP", primary: "#C4161C", secondary: "#FFFFFF" },
  { name: "Gimnasia LP", primary: "#002B66", secondary: "#FFFFFF" },
  { name: "Belgrano", primary: "#67A5D6", secondary: "#000000" },
  { name: "Lanús", primary: "#6F1D2F", secondary: "#FFFFFF" },
  { name: "Banfield", primary: "#006437", secondary: "#FFFFFF" },
  { name: "Huracán", primary: "#FFFFFF", secondary: "#E02020" },
  { name: "Argentinos Juniors", primary: "#C4161C", secondary: "#FFFFFF" },
  { name: "Palmeiras", primary: "#006437", secondary: "#FFFFFF" },
  { name: "Flamengo", primary: "#C4161C", secondary: "#000000" },
  { name: "Fluminense", primary: "#781827", secondary: "#006437" },
  { name: "Nacional (Uru)", primary: "#002B66", secondary: "#C4161C" },
  { name: "Peñarol", primary: "#000000", secondary: "#FFC700" },
  { name: "Platense", primary: "#5C2E14", secondary: "#FFFFFF" },
  { name: "Tigre", primary: "#002B66", secondary: "#C01424" },
  { name: "Sarmiento", primary: "#006437", secondary: "#FFFFFF" },
  { name: "Barracas Central", primary: "#E02020", secondary: "#FFFFFF" },
  { name: "Deportivo Riestra", primary: "#000000", secondary: "#FFFFFF" },
  { name: "Atlético Tucumán", primary: "#75AADB", secondary: "#FFFFFF" },
  { name: "Central Córdoba", primary: "#000000", secondary: "#FFFFFF" },
  { name: "Aldosivi", primary: "#006437", secondary: "#FFD700" },
  { name: "Independiente Rivadavia", primary: "#002B66", secondary: "#FFFFFF" },
  { name: "Gimnasia de Mendoza", primary: "#000000", secondary: "#FFFFFF" },
  { name: "Estudiantes de Río Cuarto", primary: "#75AADB", secondary: "#FFFFFF" }
];
