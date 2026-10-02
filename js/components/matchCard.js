/**
 * matchCard.js - Componente para renderizar la tarjeta visual de un partido dentro de un día del calendario
 */

import { renderOpponentBadge } from './shieldGenerator.js';
import { formatTime } from '../utils/dateUtils.js';

/**
 * Retorna el ícono y clase CSS para la condición del partido
 */
export function getVenueDetails(venue) {
  switch (venue) {
    case 'Local':
      return { code: 'L', icon: '🏠', label: 'Local', className: 'venue-local' };
    case 'Visitante':
      return { code: 'V', icon: '✈️', label: 'Visitante', className: 'venue-away' };
    case 'Neutral':
      return { code: 'N', icon: '⚪', label: 'Neutral', className: 'venue-neutral' };
    default:
      return { code: (venue ? venue[0].toUpperCase() : 'L'), icon: '⚽', label: venue || 'Local', className: 'venue-local' };
  }
}

/**
 * Genera el elemento HTML del partido directamente dentro del cuadro del día
 * @param {Object} match - Objeto con datos del partido
 * @param {Object} options - Configuración opcional
 * @returns {string} HTML string del partido
 */
export function renderMatchCard(match, options = {}) {
  const venue = getVenueDetails(match.venue);
  const shieldSize = options.shieldSize || 68;
  const badgeHtml = renderOpponentBadge(
    match.opponent,
    match.opponentPrimaryColor,
    match.opponentSecondaryColor,
    match.badgeUrl,
    shieldSize
  );

  return `
    <article 
      class="match-card ${venue.className}" 
      data-id="${match.id}" 
      tabindex="0"
      aria-label="Partido Boca Juniors vs ${match.opponent}, ${match.time}hs, ${venue.label}"
    >
      <!-- Acciones de edición rápida en la esquina superior -->
      <div class="match-card-actions">
        <button 
          type="button" 
          class="match-action-btn edit-btn" 
          data-action="edit" 
          data-id="${match.id}" 
          title="Editar partido"
          aria-label="Editar partido contra ${match.opponent}"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button 
          type="button" 
          class="match-action-btn delete-btn" 
          data-action="delete" 
          data-id="${match.id}" 
          title="Eliminar partido"
          aria-label="Eliminar partido contra ${match.opponent}"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <!-- Escudo del rival: lo principal y más grande del cuadro del día -->
      <div class="match-shield-hero" title="Escudo de ${match.opponent}">
        ${badgeHtml}
      </div>

      <!-- Nombre del rival -->
      <span class="match-opponent-name" title="${match.opponent}">${match.opponent}</span>

      <!-- Fila con condición (L o V) y hora pequeña -->
      <div class="match-info-pill-row">
        <span class="match-venue-badge ${venue.className}" title="${venue.label}">
          ${venue.code}
        </span>
        <span class="match-time" title="Horario: ${formatTime(match.time)}">
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${formatTime(match.time)}
        </span>
      </div>

      <!-- Competición e Instancia sutil -->
      <div class="match-competition-row">
        <span class="match-competition" title="${match.competition}">${match.competition}</span>
      </div>
    </article>
  `.trim();
}
