/**
 * shieldGenerator.js - Generador visual de escudos estilizados para clubes rivales
 * Produce escudos vectoriales limpios y nítidos con los colores del rival o renderiza la imagen proporcionada.
 */

import { resolveRealShieldUrl } from '../utils/shieldResolver.js';

/**
 * Obtiene las iniciales representativas del club rival (máximo 2 letras)
 */
export function getOpponentInitials(name = '') {
  if (!name.trim()) return 'VS';
  const clean = name.trim().replace(/^(club|c\.a\.|a\.a\.|csd)\s+/i, '');
  const words = clean.split(/\s+/).filter(w => !['de', 'del', 'la', 'los', 'el', 'y', 'da', 'do', 'das', 'dos'].includes(w.toLowerCase()));
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

/**
 * Calcula un contraste de texto óptimo (blanco o negro) sobre un color HEX
 */
export function getContrastColor(hexColor) {
  if (!hexColor || !hexColor.startsWith('#')) return '#FFFFFF';
  let hex = hexColor.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16) || 0;
  const g = parseInt(hex.substring(2, 4), 16) || 0;
  const b = parseInt(hex.substring(4, 6), 16) || 0;
  // Luminosidad relativa según W3C
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#0B132B' : '#FFFFFF';
}

/**
 * Genera el código SVG de un escudo heráldico con dos colores y monograma
 * @param {string} name - Nombre del rival
 * @param {string} primary - Color primario HEX
 * @param {string} secondary - Color secundario HEX
 * @param {number} size - Tamaño en píxeles (ancho/alto aproximado)
 * @returns {string} SVG en string
 */
export function generateGenericShieldSvg(name, primary = '#002B66', secondary = '#FFC700', size = 68) {
  const initials = getOpponentInitials(name);
  const primaryHex = primary || '#002B66';
  const secondaryHex = secondary || '#FFC700';
  const textColor = getContrastColor(secondaryHex);

  // Escudo con forma deportiva clásica con partición diagonal o franja central
  // viewBox="0 0 100 120"
  // Path del escudo heráldico
  const shieldPath = "M 50,5 C 80,5 95,12 95,30 C 95,78 68,108 50,118 C 32,108 5,78 5,30 C 5,12 20,5 50,5 Z";
  const innerClipId = `shield-clip-${Math.random().toString(36).substring(2, 9)}`;

  return `
    <svg class="shield-svg" width="${size}" height="${Math.round(size * 1.2)}" viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Escudo de ${name}">
      <defs>
        <clipPath id="${innerClipId}">
          <path d="${shieldPath}" />
        </clipPath>
        <filter id="shield-shadow-${innerClipId}" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity="0.35" />
        </filter>
      </defs>
      
      <!-- Fondo exterior / Borde fino -->
      <path d="${shieldPath}" fill="#10192D" stroke="rgba(255,255,255,0.4)" stroke-width="2" filter="url(#shield-shadow-${innerClipId})" />

      <g clip-path="url(#${innerClipId})">
        <!-- Mitad izquierda color primario -->
        <rect x="0" y="0" width="50" height="120" fill="${primaryHex}" />
        <!-- Mitad derecha color secundario -->
        <rect x="50" y="0" width="50" height="120" fill="${secondaryHex}" />
        
        <!-- Franja vertical o diagonal divisoria -->
        <line x1="50" y1="0" x2="50" y2="120" stroke="rgba(255,255,255,0.5)" stroke-width="2" />
        
        <!-- Borde superior heráldico -->
        <rect x="0" y="0" width="100" height="24" fill="${secondaryHex}" opacity="0.9" />
        <line x1="0" y1="24" x2="100" y2="24" stroke="rgba(0,0,0,0.25)" stroke-width="2" />

        <!-- Monograma / Letras centrales con fondo circular -->
        <circle cx="50" cy="62" r="23" fill="${secondaryHex}" stroke="${primaryHex}" stroke-width="3" />
        <text x="50" y="68" font-family="'Outfit', 'Inter', -apple-system, sans-serif" font-size="22" font-weight="900" fill="${textColor}" text-anchor="middle" dominant-baseline="middle" letter-spacing="-0.5">
          ${initials}
        </text>
      </g>
      
      <!-- Contorno de realce metálico/brillante -->
      <path d="${shieldPath}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="3" />
    </svg>
  `.trim();
}

/**
 * Renderiza el elemento HTML del escudo (sea imagen real en img/escudos/ o SVG estilizado)
 */
export function renderOpponentBadge(opponentName, primaryColor, secondaryColor, badgeUrl = '', size = 68) {
  const effectiveUrl = resolveRealShieldUrl(opponentName, badgeUrl);
  const svgHtml = generateGenericShieldSvg(opponentName, primaryColor, secondaryColor, size);

  if (effectiveUrl && effectiveUrl.trim()) {
    const cleanUrl = effectiveUrl.trim();
    return `
      <div class="opponent-badge-container badge-img-wrapper" style="width: ${size}px; height: ${size}px;">
        <img 
          src="${cleanUrl}" 
          alt="${opponentName}" 
          class="opponent-badge-img" 
          loading="lazy"
          onerror="this.style.display='none'; if (this.nextElementSibling) this.nextElementSibling.style.display='flex';"
        />
        <div class="opponent-badge-fallback" style="display:none; width:100%; height:100%; align-items:center; justify-content:center;">
          ${svgHtml}
        </div>
      </div>
    `.trim();
  }

  return `
    <div class="opponent-badge-container" style="width: ${size}px; min-height: ${Math.round(size * 1.2)}px;">
      ${svgHtml}
    </div>
  `.trim();
}

