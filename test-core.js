import { getMonthCalendarDays, formatDateISO, parseISODate, formatTime } from './js/utils/dateUtils.js';
import { generateGenericShieldSvg, getOpponentInitials } from './js/components/shieldGenerator.js';
import { INITIAL_MATCHES } from './js/sampleData.js';

console.log('--- INICIANDO PRUEBAS UNITARIAS CON PARTIDOS REALES ---');

// 1. Validar iniciales
const testCasesInitials = [
  { name: 'San Lorenzo', expected: 'SL' },
  { name: 'Racing Club', expected: 'RC' },
  { name: 'Unión de Santa Fe', expected: 'US' },
  { name: 'Instituto de Córdoba', expected: 'IC' },
  { name: 'Vasco da Gama', expected: 'VG' },
  { name: 'Talleres de Córdoba', expected: 'TC' },
  { name: 'River Plate', expected: 'RP' }
];

testCasesInitials.forEach(tc => {
  const result = getOpponentInitials(tc.name);
  if (result !== tc.expected) {
    console.error(`FAIL: getOpponentInitials('${tc.name}') = '${result}', expected '${tc.expected}'`);
    process.exit(1);
  } else {
    console.log(`PASS: getOpponentInitials('${tc.name}') -> ${result}`);
  }
});

// 2. Verificar lista de 16 partidos reales solicitados
const expectedMatches = [
  { date: '2026-09-20', opponent: 'San Lorenzo', venue: 'Local' },
  { date: '2026-09-27', opponent: 'Racing Club', venue: 'Neutral' },
  { date: '2026-10-02', opponent: 'Unión de Santa Fe', venue: 'Local' },
  { date: '2026-10-09', opponent: 'Instituto de Córdoba', venue: 'Visitante' },
  { date: '2026-10-14', opponent: 'Vasco da Gama', venue: 'Local' },
  { date: '2026-10-18', opponent: 'Talleres de Córdoba', venue: 'Local' },
  { date: '2026-10-21', opponent: 'Vasco da Gama', venue: 'Visitante' },
  { date: '2026-10-25', opponent: 'Independiente', venue: 'Visitante' },
  { date: '2026-11-01', opponent: 'River Plate', venue: 'Local' },
  { date: '2026-11-04', opponent: 'Final Copa Argentina', venue: 'Neutral' },
  { date: '2026-11-08', opponent: 'Defensa y Justicia', venue: 'Local' },
  { date: '2026-11-21', opponent: 'Final Sudamericana', venue: 'Neutral' },
  { date: '2026-11-25', opponent: 'Octavos Clausura', venue: 'Local' },
  { date: '2026-11-28', opponent: 'Cuartos Clausura', venue: 'Neutral' },
  { date: '2026-12-05', opponent: 'Semifinal Clausura', venue: 'Neutral' },
  { date: '2026-12-12', opponent: 'Final Clausura', venue: 'Neutral' }
];

console.log(`Total de partidos reales cargados: ${INITIAL_MATCHES.length} (esperados: ${expectedMatches.length})`);

if (INITIAL_MATCHES.length !== expectedMatches.length) {
  console.error(`FAIL: Cantidad incorrecta de partidos (${INITIAL_MATCHES.length})`);
  process.exit(1);
}

expectedMatches.forEach(exp => {
  const match = INITIAL_MATCHES.find(m => m.date === exp.date);
  if (!match) {
    console.error(`FAIL: No se encontró partido en fecha ${exp.date}`);
    process.exit(1);
  }
  if (!match.opponent.toLowerCase().includes(exp.opponent.toLowerCase().slice(0, 5))) {
    console.error(`FAIL: Rival en ${exp.date} (${match.opponent}) no coincide con esperado (${exp.opponent})`);
    process.exit(1);
  }
  if (match.venue !== exp.venue) {
    console.error(`FAIL: Condición en ${exp.date} (${match.venue}) no coincide con esperada (${exp.venue})`);
    process.exit(1);
  }
  console.log(`PASS: ${exp.date} -> ${match.opponent} [${match.venue}]`);
});

console.log('--- TODOS LOS 16 PARTIDOS REALES VALIDADOS EXITOSAMENTE ---');
