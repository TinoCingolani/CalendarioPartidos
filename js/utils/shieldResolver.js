/**
 * shieldResolver.js - Normalización y resolución de escudos reales para clubes
 * Conecta los rivales y clubes con las imágenes reales almacenadas en img/escudos/
 */

// Catálogo de escudos oficiales disponibles en la carpeta img/escudos/
export const KNOWN_REAL_SHIELDS = [
  { slug: 'boca', name: 'Boca Juniors', file: 'boca.png' },
  { slug: 'sanlorenzo', name: 'San Lorenzo', file: 'sanlorenzo.png' },
  { slug: 'racing', name: 'Racing Club', file: 'racing.png' },
  { slug: 'river', name: 'River Plate', file: 'river.png' },
  { slug: 'independiente', name: 'Independiente', file: 'independiente.png' },
  { slug: 'union', name: 'Unión de Santa Fe', file: 'union.png' },
  { slug: 'instituto', name: 'Instituto de Córdoba', file: 'instituto.png' },
  { slug: 'talleres', name: 'Talleres de Córdoba', file: 'talleres.png' },
  { slug: 'vasco-da-gama', name: 'Vasco da Gama', file: 'vasco-da-gama.png' },
  { slug: 'velez', name: 'Vélez Sarsfield', file: 'velez.png' },
  { slug: 'defensa-y-justicia', name: 'Defensa y Justicia', file: 'defensa-y-justicia.png' },
  { slug: 'rosariocentral', name: 'Rosario Central', file: 'rosariocentral.png' },
  { slug: 'newells', name: "Newell's Old Boys", file: 'newells.png' },
  { slug: 'estudiantes', name: 'Estudiantes LP', file: 'estudiantes.png' },
  { slug: 'lanus', name: 'Lanús', file: 'lanus.png' },
  { slug: 'argentinos-juniors', name: 'Argentinos Juniors', file: 'argentinos-juniors.png' },
  { slug: 'belgrano', name: 'Belgrano', file: 'belgrano.png' },
  { slug: 'huracan', name: 'Huracán', file: 'huracan.png' },
  { slug: 'banfield', name: 'Banfield', file: 'banfield.png' },
  { slug: 'platense', name: 'Platense', file: 'platense.png' },
  { slug: 'tigre', name: 'Tigre', file: 'tigre.png' },
  { slug: 'sarmiento', name: 'Sarmiento de Junín', file: 'sarmiento.png' },
  { slug: 'barracas', name: 'Barracas Central', file: 'barracas.png' },
  { slug: 'riestra', name: 'Deportivo Riestra', file: 'riestra.png' },
  { slug: 'gimnasia', name: 'Gimnasia y Esgrima La Plata', file: 'gimnasia.png' },
  { slug: 'gimnasia-mendoza', name: 'Gimnasia de Mendoza', file: 'gimnasia-mendoza.png' },
  { slug: 'atletico-tucuman', name: 'Atlético Tucumán', file: 'atletico-tucuman.png' },
  { slug: 'central-cordoba', name: 'Central Córdoba', file: 'central-cordoba.png' },
  { slug: 'aldosivi', name: 'Aldosivi', file: 'aldosivi.png' },
  { slug: 'independiente-rivadavia', name: 'Independiente Rivadavia', file: 'independiente-rivadavia.png' },
  { slug: 'estudiantes-rio-cuarto', name: 'Estudiantes de Río Cuarto', file: 'estudiantes-rio-cuarto.png' }
];

// Mapa exhaustivo de alias y variantes comunes
const ALIAS_MAP = {
  // Boca
  'boca': 'boca',
  'boca juniors': 'boca',
  'cabj': 'boca',

  // San Lorenzo
  'sanlorenzo': 'sanlorenzo',
  'san lorenzo': 'sanlorenzo',
  'san lorenzo de almagro': 'sanlorenzo',
  'casla': 'sanlorenzo',

  // Racing
  'racing': 'racing',
  'racing club': 'racing',

  // River
  'river': 'river',
  'river plate': 'river',
  'carp': 'river',

  // Independiente
  'independiente': 'independiente',
  'cai': 'independiente',

  // Unión
  'union': 'union',
  'union de santa fe': 'union',
  'cau': 'union',

  // Instituto
  'instituto': 'instituto',
  'instituto de cordoba': 'instituto',
  'instituto acc': 'instituto',
  'iacc': 'instituto',

  // Talleres
  'talleres': 'talleres',
  'talleres de cordoba': 'talleres',
  'cat': 'talleres',

  // Vasco
  'vasco': 'vasco-da-gama',
  'vasco da gama': 'vasco-da-gama',
  'crvg': 'vasco-da-gama',

  // Vélez
  'velez': 'velez',
  'velez sarsfield': 'velez',
  'cavs': 'velez',

  // Defensa y Justicia
  'defensa': 'defensa-y-justicia',
  'defensa y justicia': 'defensa-y-justicia',
  'dyj': 'defensa-y-justicia',

  // Rosario Central
  'central': 'rosariocentral',
  'rosario central': 'rosariocentral',
  'rosariocentral': 'rosariocentral',
  'carc': 'rosariocentral',

  // Newell's
  'newells': 'newells',
  "newell's": 'newells',
  'newells old boys': 'newells',
  "newell's old boys": 'newells',
  'nob': 'newells',

  // Estudiantes
  'estudiantes': 'estudiantes',
  'estudiantes lp': 'estudiantes',
  'estudiantes de la plata': 'estudiantes',

  // Lanús
  'lanus': 'lanus',
  'cal': 'lanus',

  // Argentinos
  'argentinos': 'argentinos-juniors',
  'argentinos juniors': 'argentinos-juniors',
  'aaaj': 'argentinos-juniors',

  // Belgrano
  'belgrano': 'belgrano',
  'cab': 'belgrano',

  // Huracán
  'huracan': 'huracan',
  'cah': 'huracan',

  // Banfield
  'banfield': 'banfield',

  // Platense
  'platense': 'platense',

  // Tigre
  'tigre': 'tigre',

  // Sarmiento
  'sarmiento': 'sarmiento',
  'sarmiento de junin': 'sarmiento',

  // Barracas
  'barracas': 'barracas',
  'barracas central': 'barracas',

  // Riestra
  'riestra': 'riestra',
  'deportivo riestra': 'riestra',

  // Gimnasia LP
  'gimnasia': 'gimnasia',
  'gimnasia lp': 'gimnasia',
  'gimnasia y esgrima la plata': 'gimnasia',
  'gelp': 'gimnasia',

  // Gimnasia Mza
  'gimnasia mendoza': 'gimnasia-mendoza',
  'gimnasia de mendoza': 'gimnasia-mendoza',

  // Atlético Tucumán
  'atletico tucuman': 'atletico-tucuman',
  'tucuman': 'atletico-tucuman',

  // Central Córdoba
  'central cordoba': 'central-cordoba',
  'central cordoba sde': 'central-cordoba',

  // Aldosivi
  'aldosivi': 'aldosivi',

  // Independiente Rivadavia
  'independiente rivadavia': 'independiente-rivadavia',
  'rivadavia': 'independiente-rivadavia',

  // Estudiantes Río Cuarto
  'estudiantes rio cuarto': 'estudiantes-rio-cuarto',
  'estudiantes de rio cuarto': 'estudiantes-rio-cuarto'
};

/**
 * Convierte el nombre de un club a su identificador canónico
 */
export function slugifyClub(name = '') {
  if (!name) return '';
  const clean = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(club|c\.a\.|a\.a\.|csd|c\.s\.d\.)\s+/i, '')
    .trim();

  if (ALIAS_MAP[clean]) {
    return ALIAS_MAP[clean];
  }

  const directClean = clean.replace(/[^a-z0-9]+/g, '');
  if (ALIAS_MAP[directClean]) {
    return ALIAS_MAP[directClean];
  }

  return clean
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Registro dinámico de archivos detectados en img/escudos/ por el servidor
export const dynamicShields = new Set();

/**
 * Registra nombres de archivo de escudos descubiertos dinámicamente en img/escudos/
 * @param {string[]} filenames - Lista de archivos (ej. ['sanlorenzo.png', 'racing.png'])
 */
export function registerDynamicShields(filenames = []) {
  filenames.forEach(f => {
    if (typeof f === 'string' && f.trim()) {
      dynamicShields.add(f.trim().toLowerCase());
    }
  });
}

/**
 * Resuelve la ruta a la imagen del escudo real en img/escudos/
 * @param {string} opponentName - Nombre del rival
 * @param {string} customBadgeUrl - URL o ruta personalizada proporcionada en el partido
 * @returns {string} Ruta al archivo de imagen o string vacío si debe usarse SVG generado
 */
export function resolveRealShieldUrl(opponentName = '', customBadgeUrl = '') {
  if (customBadgeUrl && customBadgeUrl.trim()) {
    return customBadgeUrl.trim();
  }

  const slug = slugifyClub(opponentName);
  if (!slug) return '';

  // 1. Buscar en catálogo estático de escudos conocidos
  const matched = KNOWN_REAL_SHIELDS.find(s => s.slug === slug);
  if (matched) {
    return `img/escudos/${matched.file}`;
  }

  // 2. Buscar en escudos descubiertos dinámicamente en img/escudos/
  const candidateExtensions = ['.png', '.svg', '.webp', '.jpg', '.jpeg'];
  for (const ext of candidateExtensions) {
    const candidateFile = `${slug}${ext}`;
    if (dynamicShields.has(candidateFile)) {
      return `img/escudos/${candidateFile}`;
    }
    const candidateNoHyphen = `${slug.replace(/-/g, '')}${ext}`;
    if (dynamicShields.has(candidateNoHyphen)) {
      return `img/escudos/${candidateNoHyphen}`;
    }
  }

  return '';
}
