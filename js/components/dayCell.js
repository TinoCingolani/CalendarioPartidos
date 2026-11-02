/**
 * dayCell.js - Renderizado de la celda individual de un día del calendario
 */

import { renderMatchCard } from './matchCard.js';

/**
 * Renderiza el HTML de una celda de día del calendario
 * @param {Object} cellData - { date, dateStr, dayNumber, isCurrentMonth, isToday }
 * @param {Array} dayMatches - Partidos correspondientes a esta fecha
 * @returns {string} HTML de la celda
 */
/**
 * Ventanas FIFA: rangos de fechas (mes/día) en los que el número del día
 * se muestra en rojo. Se aplica a cualquier año.
 */
const FIFA_WINDOWS = [
  { startMonth: 9,  startDay: 21, endMonth: 10, endDay: 6  }, // 21 sep – 6 oct
  { startMonth: 11, startDay: 9,  endMonth: 11, endDay: 17 }, // 9 nov – 17 nov
];

function isInFifaWindow(dateStr) {
  if (!dateStr) return false;
  const parts = dateStr.split('-').map(Number);
  if (parts.length < 3) return false;
  const [, month, day] = parts; // month is 1-indexed
  return FIFA_WINDOWS.some(({ startMonth, startDay, endMonth, endDay }) => {
    const startVal = startMonth * 100 + startDay;
    const endVal   = endMonth   * 100 + endDay;
    const dateVal  = month      * 100 + day;
    return dateVal >= startVal && dateVal <= endVal;
  });
}

export function renderDayCell(cellData, dayMatches = [], options = {}) {
  const { dateStr, dayNumber, isCurrentMonth, isToday, splitDay } = cellData;
  const { splitMatches = [] } = options;
  const hasMatches = dayMatches.length > 0;
  const hasSplitMatches = splitMatches.length > 0;
  
  // Condición del primer partido para acentuar el cuadro del día directamente
  let venueClass = '';
  if (hasMatches && dayMatches[0]) {
    const v = dayMatches[0].venue;
    if (v === 'Visitante') venueClass = 'venue-away';
    else if (v === 'Neutral') venueClass = 'venue-neutral';
    else venueClass = 'venue-local';
  } else if (hasSplitMatches && splitMatches[0]) {
    const v = splitMatches[0].venue;
    if (v === 'Visitante') venueClass = 'venue-away';
    else if (v === 'Neutral') venueClass = 'venue-neutral';
    else venueClass = 'venue-local';
  }

  const classes = [
    'calendar-day-cell',
    isCurrentMonth ? 'in-month' : 'other-month',
    isToday ? 'is-today' : '',
    hasMatches || hasSplitMatches ? 'has-matches' : '',
    venueClass,
    isInFifaWindow(dateStr) ? 'fifa-window' : '',
    splitDay ? 'has-split-day' : ''
  ].filter(Boolean).join(' ');

  const matchesHtml = dayMatches
    .map(match => renderMatchCard(match, options))
    .join('');

  let splitCornerHtml = '';
  if (splitDay) {
    const splitFifa = isInFifaWindow(splitDay.dateStr) ? 'fifa-window' : '';
    const splitToday = splitDay.isToday ? 'is-today' : '';
    const splitMatchesHtml = splitMatches
      .map(match => renderMatchCard(match, { ...options, isSplitMatch: true, splitDayNumber: splitDay.dayNumber }))
      .join('');

    splitCornerHtml = `
      <div 
        class="split-day-corner ${splitToday} ${splitFifa} ${hasSplitMatches ? 'has-matches' : ''}" 
        data-date="${splitDay.dateStr}"
        role="button"
        tabindex="0"
        title="Día ${splitDay.dayNumber}"
        aria-label="Día ${splitDay.dayNumber}"
      >
        <span class="split-day-number">${splitDay.dayNumber}</span>
        <button 
          type="button" 
          class="day-add-quick-btn split-add-btn" 
          data-action="add-on-date" 
          data-date="${splitDay.dateStr}" 
          title="Agregar partido el ${splitDay.dayNumber}"
          aria-label="Agregar partido el día ${splitDay.dayNumber}"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      ${splitMatchesHtml}
    `;
  }

  return `
    <div 
      class="${classes}" 
      data-date="${dateStr}"
      role="gridcell"
      aria-label="${dayNumber} ${splitDay ? `y ${splitDay.dayNumber}` : ''} ${isToday ? '(Hoy)' : ''} ${hasMatches ? `- ${dayMatches.length} partido(s)` : ''}"
    >
      <div class="day-cell-header">
        <span class="day-number">${dayNumber}</span>
        ${isToday ? '<span class="today-pill">HOY</span>' : ''}
        <button 
          type="button" 
          class="day-add-quick-btn" 
          data-action="add-on-date" 
          data-date="${dateStr}" 
          title="Agregar partido el ${dayNumber}"
          aria-label="Agregar partido el día ${dayNumber}"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      ${matchesHtml}
      ${splitCornerHtml}
    </div>
  `.trim();
}
