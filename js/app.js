/**
 * app.js - Punto de entrada principal e inicialización de la webapp
 */

import { matchState } from './state.js';
import { Calendar } from './components/calendar.js';
import { MatchModal } from './components/matchModal.js';

import { registerDynamicShields } from './utils/shieldResolver.js';

// Función para mostrar notificaciones flotantes (Toasts)
export function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === 'success' ? '✓' : type === 'delete' ? '🗑️' : 'ℹ️'}</span>
    <span class="toast-text">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('visible'), 10);

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Modal de Creación / Edición / Eliminación
  const matchModal = new MatchModal({
    onSave: (matchData, isEdit) => {
      if (isEdit) {
        matchState.updateMatch(matchData.id, matchData);
        showToast(`Partido contra ${matchData.opponent} actualizado`, 'success');
      } else {
        matchState.addMatch(matchData);
        showToast(`Partido contra ${matchData.opponent} agregado al calendario`, 'success');
      }
    },
    onDelete: (id) => {
      const match = matchState.getMatchById(id);
      const name = match ? match.opponent : '';
      const ok = matchState.deleteMatch(id);
      if (ok) {
        showToast(`Partido contra ${name} eliminado`, 'delete');
      }
    }
  });

  // 2. Inicializar Calendario
  const calendar = new Calendar({
    state: matchState,
    onEditMatch: (match) => {
      matchModal.openForEdit(match);
    },
    onDeleteMatch: (match) => {
      matchModal.promptDelete(match.id, match.opponent);
    },
    onAddOnDate: (dateStr) => {
      matchModal.openForCreate(dateStr);
    }
  });

  // 3. Vincular botón principal "+ Agregar partido"
  const addMatchBtn = document.getElementById('addMatchBtn');
  addMatchBtn?.addEventListener('click', () => {
    matchModal.openForCreate();
  });

  // 4. Filtro por competición
  const compFilter = document.getElementById('competitionFilter');
  compFilter?.addEventListener('change', (e) => {
    calendar.setFilterCompetition(e.target.value);
  });

  // 5. Botón restablecer partidos de ejemplo
  const resetDataBtn = document.getElementById('resetDataBtn');
  resetDataBtn?.addEventListener('click', () => {
    if (confirm('¿Restablecer los partidos de ejemplo de Boca Juniors?')) {
      matchState.resetToDefault();
      showToast('Partidos de ejemplo restablecidos', 'info');
    }
  });

  // 6. Primer render
  calendar.render();

  // 7. Descubrimiento de escudos reales en carpeta img/escudos/
  fetch('/api/escudos')
    .then(res => (res.ok ? res.json() : null))
    .then(data => {
      if (data && data.shields && Array.isArray(data.shields)) {
        registerDynamicShields(data.shields);
        calendar.render();
      }
    })
    .catch(() => {});
});
