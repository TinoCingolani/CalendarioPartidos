/**
 * calendar.js - Componente principal de la vista de calendario (1 mes o varios meses a la vez)
 */

import { MONTH_NAMES, FULL_DAY_NAMES, getMonthCalendarDays, formatDateISO } from '../utils/dateUtils.js';
import { renderDayCell } from './dayCell.js';

const STORAGE_VIEW_KEY = 'boca_calendar_view_months';

export class Calendar {
  constructor({ state, onEditMatch, onDeleteMatch, onAddOnDate }) {
    this.state = state;
    this.onEditMatch = onEditMatch;
    this.onDeleteMatch = onDeleteMatch;
    this.onAddOnDate = onAddOnDate;

    // Recuperar preferencia de visualización (1, 2, 3 o 6 meses)
    let savedView = 1;
    try {
      const stored = localStorage.getItem(STORAGE_VIEW_KEY);
      if (stored) {
        const val = parseInt(stored, 10);
        if ([1, 2, 3, 6].includes(val)) {
          savedView = val;
        }
      }
    } catch (e) {
      console.warn('No se pudo leer preferencia de vista:', e);
    }
    this.viewMonths = savedView;

    // Inicializar en el mes actual o en el mes donde comiencen los partidos cargados
    const now = new Date();
    this.currentYear = now.getFullYear();
    this.currentMonth = now.getMonth();

    const matchesInCurrent = this.state.getMatchesForMonth(this.currentYear, this.currentMonth);
    if (matchesInCurrent.length === 0) {
      const allMatches = this.state.getAllMatches();
      if (allMatches.length > 0) {
        const sorted = allMatches.filter(m => m && m.date).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
        if (sorted.length > 0 && sorted[0].date) {
          const parts = sorted[0].date.split('-').map(Number);
          if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            this.currentYear = parts[0];
            this.currentMonth = parts[1] - 1;
          }
        }
      }
    }

    this.selectedDateStr = formatDateISO(now);
    this.filterCompetition = 'all';

    this.bindDom();
    this.bindEvents();
  }

  bindDom() {
    this.monthYearTitleEl = document.getElementById('currentMonthYearTitle');
    this.prevMonthBtn = document.getElementById('prevMonthBtn');
    this.nextMonthBtn = document.getElementById('nextMonthBtn');
    this.todayBtn = document.getElementById('todayBtn');
    this.calendarContainerEl = document.getElementById('calendarContainer') || document.getElementById('calendarGrid');
    this.monthMatchCountEl = document.getElementById('monthMatchCount');
    this.mobileDaySummaryEl = document.getElementById('mobileDaySummary');
    this.viewModeBtns = document.querySelectorAll('.view-mode-btn');
  }

  bindEvents() {
    this.prevMonthBtn?.addEventListener('click', () => this.navigatePrev());
    this.nextMonthBtn?.addEventListener('click', () => this.navigateNext());
    this.todayBtn?.addEventListener('click', () => this.goToToday());

    // Botones selectores de modo de visualización de meses
    this.viewModeBtns?.forEach(btn => {
      btn.addEventListener('click', () => {
        const count = parseInt(btn.dataset.view, 10) || 1;
        this.setViewMonths(count);
      });
    });

    // Delegación de eventos dentro de la cuadrícula o contenedor del calendario
    this.calendarContainerEl?.addEventListener('click', (e) => {
      // 1. Botón eliminar
      const deleteBtn = e.target.closest('[data-action="delete"]');
      if (deleteBtn) {
        e.stopPropagation();
        const id = deleteBtn.dataset.id;
        const match = this.state.getMatchById(id);
        if (match && this.onDeleteMatch) {
          this.onDeleteMatch(match);
        }
        return;
      }

      // 2. Botón editar
      const editBtn = e.target.closest('[data-action="edit"]');
      if (editBtn) {
        e.stopPropagation();
        const id = editBtn.dataset.id;
        const match = this.state.getMatchById(id);
        if (match && this.onEditMatch) {
          this.onEditMatch(match);
        }
        return;
      }

      // 3. Click sobre la tarjeta misma (para abrir edición o detalle)
      const matchCard = e.target.closest('.match-card');
      if (matchCard && !e.target.closest('button')) {
        const id = matchCard.dataset.id;
        const match = this.state.getMatchById(id);
        if (match && this.onEditMatch) {
          this.onEditMatch(match);
        }
        return;
      }

      // 4. Botón rápido '+' en la cabecera del día
      const addQuickBtn = e.target.closest('[data-action="add-on-date"]');
      if (addQuickBtn) {
        e.stopPropagation();
        const dateStr = addQuickBtn.dataset.date;
        if (this.onAddOnDate) {
          this.onAddOnDate(dateStr);
        }
        return;
      }

      // 5. Clic en el recuadro del día compartido o en la celda del día (para móviles o selección rápida)
      const splitCorner = e.target.closest('.split-day-corner');
      if (splitCorner) {
        const dateStr = splitCorner.dataset.date;
        if (dateStr) {
          this.selectDate(dateStr);
          return;
        }
      }

      const dayCell = e.target.closest('.calendar-day-cell');
      if (dayCell) {
        const dateStr = dayCell.dataset.date;
        this.selectDate(dateStr);
      }
    });

    // Suscribirse a cambios del estado
    this.state.subscribe(() => {
      this.render();
    });
  }

  setViewMonths(count) {
    if (![1, 2, 3, 6].includes(count)) count = 1;
    this.viewMonths = count;
    try {
      localStorage.setItem(STORAGE_VIEW_KEY, String(count));
    } catch (e) {
      console.warn('No se pudo guardar preferencia:', e);
    }
    this.render();
  }

  getShieldSizeForView() {
    switch (this.viewMonths) {
      case 2:
        return 50;
      case 3:
        return 40;
      case 6:
        return 32;
      case 1:
      default:
        return 68;
    }
  }

  navigatePrev() {
    const step = this.viewMonths;
    let m = this.currentMonth - step;
    let y = this.currentYear;
    while (m < 0) {
      m += 12;
      y -= 1;
    }
    this.currentMonth = m;
    this.currentYear = y;
    this.render();
  }

  navigateNext() {
    const step = this.viewMonths;
    let m = this.currentMonth + step;
    let y = this.currentYear;
    while (m > 11) {
      m -= 12;
      y += 1;
    }
    this.currentMonth = m;
    this.currentYear = y;
    this.render();
  }

  goToToday() {
    const today = new Date();
    this.currentYear = today.getFullYear();
    this.currentMonth = today.getMonth();
    this.selectedDateStr = formatDateISO(today);
    this.render();
  }

  selectDate(dateStr) {
    this.selectedDateStr = dateStr;
    document.querySelectorAll('.calendar-day-cell, .split-day-corner').forEach(cell => {
      cell.classList.toggle('selected-day', cell.dataset.date === dateStr);
    });
    this.renderMobileDaySummary();
  }

  setFilterCompetition(comp) {
    this.filterCompetition = comp;
    this.render();
  }

  render() {
    // 1. Actualizar estado visual de los botones de modo de visualización
    this.viewModeBtns?.forEach(btn => {
      const v = parseInt(btn.dataset.view, 10);
      const isActive = v === this.viewMonths;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    // 2. Construir datos de todos los meses visibles
    const monthsData = [];
    let totalPeriodMatches = 0;

    for (let i = 0; i < this.viewMonths; i++) {
      const monthOffset = this.currentMonth + i;
      const y = this.currentYear + Math.floor(monthOffset / 12);
      const m = ((monthOffset % 12) + 12) % 12;

      let monthMatches = this.state.getMatchesForMonth(y, m);
      if (this.filterCompetition && this.filterCompetition !== 'all') {
        monthMatches = monthMatches.filter(match => match.competition === this.filterCompetition);
      }
      totalPeriodMatches += monthMatches.length;
      monthsData.push({ year: y, month: m, matches: monthMatches });
    }

    // 3. Título del período en la barra superior
    if (this.monthYearTitleEl) {
      if (this.viewMonths === 1) {
        this.monthYearTitleEl.textContent = `${MONTH_NAMES[this.currentMonth]} ${this.currentYear}`;
      } else {
        const first = monthsData[0];
        const last = monthsData[monthsData.length - 1];
        if (first.year === last.year) {
          this.monthYearTitleEl.textContent = `${MONTH_NAMES[first.month]} — ${MONTH_NAMES[last.month]} ${first.year}`;
        } else {
          this.monthYearTitleEl.textContent = `${MONTH_NAMES[first.month]} ${first.year} — ${MONTH_NAMES[last.month]} ${last.year}`;
        }
      }
    }

    // 4. Contador de partidos en el período
    if (this.monthMatchCountEl) {
      const label = totalPeriodMatches === 1 ? 'partido' : 'partidos';
      this.monthMatchCountEl.textContent = `${totalPeriodMatches} ${label}`;
      this.monthMatchCountEl.title = this.viewMonths > 1
        ? `${totalPeriodMatches} partidos en los ${this.viewMonths} meses visualizados`
        : `${totalPeriodMatches} partidos en el mes`;
    }

    // 5. Renderizar tarjetas de mes dentro del contenedor
    if (this.calendarContainerEl) {
      this.calendarContainerEl.className = `calendar-months-container view-months-${this.viewMonths}`;

      const shieldSize = this.getShieldSizeForView();
      let containerHtml = '';

      monthsData.forEach(({ year, month, matches }) => {
        const monthName = MONTH_NAMES[month];
        const days = getMonthCalendarDays(year, month);

        let gridHtml = '';
        days.forEach(cellData => {
          let dayMatches = this.state.getMatchesByDate(cellData.dateStr);
          if (this.filterCompetition && this.filterCompetition !== 'all') {
            dayMatches = dayMatches.filter(m => m.competition === this.filterCompetition);
          }
          let splitMatches = [];
          if (cellData.splitDay) {
            splitMatches = this.state.getMatchesByDate(cellData.splitDay.dateStr);
            if (this.filterCompetition && this.filterCompetition !== 'all') {
              splitMatches = splitMatches.filter(m => m.competition === this.filterCompetition);
            }
          }
          gridHtml += renderDayCell(cellData, dayMatches, {
            shieldSize,
            viewMonths: this.viewMonths,
            splitMatches
          });
        });

        const weekdayHeadersHtml = this.viewMonths === 1
          ? `
            <div class="calendar-weekday-title" role="columnheader">Lunes</div>
            <div class="calendar-weekday-title" role="columnheader">Martes</div>
            <div class="calendar-weekday-title" role="columnheader">Miércoles</div>
            <div class="calendar-weekday-title" role="columnheader">Jueves</div>
            <div class="calendar-weekday-title" role="columnheader">Viernes</div>
            <div class="calendar-weekday-title" role="columnheader">Sábado</div>
            <div class="calendar-weekday-title" role="columnheader">Domingo</div>
          `
          : `
            <div class="calendar-weekday-title" role="columnheader" title="Lunes">Lun</div>
            <div class="calendar-weekday-title" role="columnheader" title="Martes">Mar</div>
            <div class="calendar-weekday-title" role="columnheader" title="Miércoles">Mié</div>
            <div class="calendar-weekday-title" role="columnheader" title="Jueves">Jue</div>
            <div class="calendar-weekday-title" role="columnheader" title="Viernes">Vie</div>
            <div class="calendar-weekday-title" role="columnheader" title="Sábado">Sáb</div>
            <div class="calendar-weekday-title" role="columnheader" title="Domingo">Dom</div>
          `;

        const monthHeaderHtml = this.viewMonths > 1
          ? `
            <div class="calendar-month-header">
              <div class="month-header-title">
                <span class="month-name">${monthName}</span>
                <span class="month-year">${year}</span>
              </div>
              <span class="month-header-badge">${matches.length} ${matches.length === 1 ? 'partido' : 'partidos'}</span>
            </div>
          `
          : '';

        containerHtml += `
          <section class="calendar-month-card" data-year="${year}" data-month="${month}">
            ${monthHeaderHtml}
            <div class="calendar-weekdays-row" role="row">
              ${weekdayHeadersHtml}
            </div>
            <div class="calendar-grid" role="grid" aria-label="Cuadrícula de ${monthName} ${year}">
              ${gridHtml}
            </div>
          </section>
        `;
      });

      this.calendarContainerEl.innerHTML = containerHtml;

      // Resaltar fecha seleccionada si existe en alguno de los meses visibles
      if (this.selectedDateStr) {
        const selCells = this.calendarContainerEl.querySelectorAll(`[data-date="${this.selectedDateStr}"]`);
        selCells.forEach(cell => cell.classList.add('selected-day'));
      }
    }

    this.renderMobileDaySummary();
  }

  renderMobileDaySummary() {
    if (!this.mobileDaySummaryEl) return;
    if (!this.selectedDateStr) {
      this.mobileDaySummaryEl.innerHTML = '';
      return;
    }

    const matches = this.state.getMatchesByDate(this.selectedDateStr);
    const [year, month, day] = this.selectedDateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    const dayName = FULL_DAY_NAMES[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const monthName = MONTH_NAMES[month - 1];

    if (matches.length === 0) {
      this.mobileDaySummaryEl.innerHTML = `
        <div class="mobile-day-card empty">
          <div class="mobile-day-title">
            <span>📅 ${dayName} ${day} de ${monthName}</span>
            <button class="mobile-add-btn" data-action="add-on-date" data-date="${this.selectedDateStr}">
              + Agregar partido
            </button>
          </div>
          <p class="empty-note">Sin partidos programados para este día.</p>
        </div>
      `;
    } else {
      this.mobileDaySummaryEl.innerHTML = `
        <div class="mobile-day-card">
          <div class="mobile-day-title">
            <span>📅 ${dayName} ${day} de ${monthName} (${matches.length} ${matches.length === 1 ? 'partido' : 'partidos'})</span>
            <button class="mobile-add-btn" data-action="add-on-date" data-date="${this.selectedDateStr}">
              + Agregar otro
            </button>
          </div>
          <div class="mobile-matches-list">
            <!-- Partidos del día en móvil -->
          </div>
        </div>
      `;
    }

    // Asignar evento al botón dentro de la vista móvil
    this.mobileDaySummaryEl.querySelector('.mobile-add-btn')?.addEventListener('click', (e) => {
      const dateStr = e.currentTarget.dataset.date;
      if (this.onAddOnDate) {
        this.onAddOnDate(dateStr);
      }
    });
  }
}
