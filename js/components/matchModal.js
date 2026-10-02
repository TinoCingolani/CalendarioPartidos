/**
 * matchModal.js - Modal interactivo para agregar y editar partidos con vista previa en vivo
 */

import { OPPONENT_PRESETS } from '../sampleData.js';
import { generateGenericShieldSvg, renderOpponentBadge } from './shieldGenerator.js';
import { getVenueDetails } from './matchCard.js';
import { formatDateISO } from '../utils/dateUtils.js';
import { KNOWN_REAL_SHIELDS, resolveRealShieldUrl, registerDynamicShields } from '../utils/shieldResolver.js';

export class MatchModal {
  constructor({ onSave, onDelete }) {
    this.onSave = onSave;
    this.onDelete = onDelete;
    this.currentMatchId = null;
    this.modalEl = document.getElementById('matchModal');
    this.confirmModalEl = document.getElementById('confirmDeleteModal');
    this.formEl = document.getElementById('matchForm');
    this.pendingDeleteId = null;
    this.availableShields = [...KNOWN_REAL_SHIELDS];

    this.bindElements();
    this.bindEvents();
    this.populateShields();
  }

  bindElements() {
    this.titleEl = document.getElementById('modalTitle');
    this.dateInput = document.getElementById('matchDate');
    this.timeInput = document.getElementById('matchTime');
    this.opponentInput = document.getElementById('matchOpponent');
    this.primaryColorInput = document.getElementById('matchPrimaryColor');
    this.secondaryColorInput = document.getElementById('matchSecondaryColor');
    this.primaryHexText = document.getElementById('primaryHexText');
    this.secondaryHexText = document.getElementById('secondaryHexText');
    this.venueSelect = document.getElementById('matchVenue');
    this.competitionInput = document.getElementById('matchCompetition');
    this.stageInput = document.getElementById('matchStage');
    this.badgeUrlInput = document.getElementById('matchBadgeUrl');
    this.localShieldSelect = document.getElementById('localShieldSelect');
    this.previewContainer = document.getElementById('modalPreviewContainer');
    this.presetSelect = document.getElementById('opponentPresets');
  }

  bindEvents() {
    // Cerrar modal al hacer click en backdrop o botón cerrar
    this.modalEl.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => this.close());
    });

    this.confirmModalEl.querySelectorAll('[data-close-confirm]').forEach(btn => {
      btn.addEventListener('click', () => this.closeConfirmModal());
    });

    document.getElementById('confirmDeleteBtn')?.addEventListener('click', () => {
      if (this.pendingDeleteId && this.onDelete) {
        this.onDelete(this.pendingDeleteId);
        this.closeConfirmModal();
      }
    });

    // Cerrar con Escape
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (!this.confirmModalEl.classList.contains('hidden')) {
          this.closeConfirmModal();
        } else if (!this.modalEl.classList.contains('hidden')) {
          this.close();
        }
      }
    });

    // Sincronizar selección de escudo de la carpeta img/escudos/
    this.localShieldSelect?.addEventListener('change', (e) => {
      this.badgeUrlInput.value = e.target.value;
      this.updateLivePreview();
    });

    // Input changes para vista previa en vivo
    const previewInputs = [
      this.opponentInput,
      this.primaryColorInput,
      this.secondaryColorInput,
      this.venueSelect,
      this.competitionInput,
      this.stageInput,
      this.timeInput,
      this.badgeUrlInput
    ];

    previewInputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          if (input === this.badgeUrlInput && this.localShieldSelect) {
            this.localShieldSelect.value = input.value;
          }
          this.updateLivePreview();
        });
        input.addEventListener('change', () => this.updateLivePreview());
      }
    });

    // Sincronizar inputs de color
    this.primaryColorInput?.addEventListener('input', (e) => {
      if (this.primaryHexText) this.primaryHexText.value = e.target.value.toUpperCase();
    });
    this.secondaryColorInput?.addEventListener('input', (e) => {
      if (this.secondaryHexText) this.secondaryHexText.value = e.target.value.toUpperCase();
    });

    // Manejar preset dropdown
    this.presetSelect?.addEventListener('change', (e) => {
      const selectedName = e.target.value;
      if (!selectedName) return;
      const preset = OPPONENT_PRESETS.find(p => p.name === selectedName);
      if (preset) {
        this.opponentInput.value = preset.name;
        this.primaryColorInput.value = preset.primary;
        this.secondaryColorInput.value = preset.secondary;
        if (this.primaryHexText) this.primaryHexText.value = preset.primary.toUpperCase();
        if (this.secondaryHexText) this.secondaryHexText.value = preset.secondary.toUpperCase();

        // Autoseleccionar el escudo correspondiente de la carpeta img/escudos/
        const resolvedShield = resolveRealShieldUrl(preset.name);
        if (resolvedShield) {
          this.badgeUrlInput.value = resolvedShield;
          if (this.localShieldSelect) {
            this.localShieldSelect.value = resolvedShield;
          }
        }

        this.updateLivePreview();
      }
    });

    // Envío del formulario
    this.formEl?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  async populateShields() {
    if (!this.localShieldSelect) return;

    // Intentar consultar escudos reales descubiertos por el servidor en img/escudos/
    try {
      const res = await fetch('/api/escudos');
      if (res.ok) {
        const data = await res.json();
        if (data.shields && Array.isArray(data.shields)) {
          registerDynamicShields(data.shields);
          this.availableShields = data.shields.map(filename => {
            const rawName = filename.replace(/\.[^/.]+$/, '').replace(/-/g, ' ');
            const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            return {
              name: displayName,
              file: filename,
              path: `img/escudos/${filename}`
            };
          });
        }
      }
    } catch (_) {
      // Si corre sin servidor HTTP (file://), mantenemos el catálogo base
      this.availableShields = KNOWN_REAL_SHIELDS.map(s => ({
        name: s.name,
        file: s.file,
        path: `img/escudos/${s.file}`
      }));
    }

    const currentVal = this.badgeUrlInput ? this.badgeUrlInput.value : '';
    this.localShieldSelect.innerHTML = '<option value="">-- Detección automática según rival --</option>';

    this.availableShields.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.path;
      opt.textContent = `${s.name} (${s.file})`;
      if (currentVal === s.path) {
        opt.selected = true;
      }
      this.localShieldSelect.appendChild(opt);
    });
  }

  populatePresets() {
    if (!this.presetSelect) return;
    this.presetSelect.innerHTML = '<option value="">-- Seleccionar club rival popular --</option>';
    OPPONENT_PRESETS.forEach(p => {
      const opt = document.createElement('option');
      opt.value = p.name;
      opt.textContent = p.name;
      this.presetSelect.appendChild(opt);
    });
  }

  openForCreate(defaultDate = null) {
    this.currentMatchId = null;
    this.titleEl.textContent = 'Agregar Nuevo Partido';
    this.formEl.reset();

    const todayIso = formatDateISO(new Date());
    this.dateInput.value = defaultDate || todayIso;
    this.timeInput.value = '20:00';
    this.opponentInput.value = '';
    this.primaryColorInput.value = '#FFFFFF';
    this.secondaryColorInput.value = '#002B66';
    if (this.primaryHexText) this.primaryHexText.value = '#FFFFFF';
    if (this.secondaryHexText) this.secondaryHexText.value = '#002B66';
    this.venueSelect.value = 'Local';
    this.competitionInput.value = 'Liga Profesional';
    this.stageInput.value = 'Fecha 1';
    this.badgeUrlInput.value = '';
    if (this.localShieldSelect) this.localShieldSelect.value = '';

    this.populatePresets();
    this.populateShields();
    this.updateLivePreview();

    this.modalEl.classList.remove('hidden');
    this.opponentInput.focus();
  }

  openForEdit(match) {
    this.currentMatchId = match.id;
    this.titleEl.textContent = 'Editar Partido';
    
    this.dateInput.value = match.date || '';
    this.timeInput.value = match.time || '20:00';
    this.opponentInput.value = match.opponent || '';
    this.primaryColorInput.value = match.opponentPrimaryColor || '#FFFFFF';
    this.secondaryColorInput.value = match.opponentSecondaryColor || '#002B66';
    if (this.primaryHexText) this.primaryHexText.value = (match.opponentPrimaryColor || '#FFFFFF').toUpperCase();
    if (this.secondaryHexText) this.secondaryHexText.value = (match.opponentSecondaryColor || '#002B66').toUpperCase();
    this.venueSelect.value = match.venue || 'Local';
    this.competitionInput.value = match.competition || 'Liga Profesional';
    this.stageInput.value = match.stage || '';
    this.badgeUrlInput.value = match.badgeUrl || '';

    this.populatePresets();
    this.populateShields().then(() => {
      if (this.localShieldSelect && match.badgeUrl) {
        this.localShieldSelect.value = match.badgeUrl;
      }
    });

    this.updateLivePreview();

    this.modalEl.classList.remove('hidden');
    this.opponentInput.focus();
  }

  close() {
    this.modalEl.classList.add('hidden');
    this.currentMatchId = null;
  }

  updateLivePreview() {
    if (!this.previewContainer) return;
    const opponent = this.opponentInput.value.trim() || 'Rival';
    const primary = this.primaryColorInput.value;
    const secondary = this.secondaryColorInput.value;
    const venueVal = this.venueSelect.value;
    const comp = this.competitionInput.value.trim() || 'Competición';
    const stage = this.stageInput.value.trim() || 'Instancia';
    const time = this.timeInput.value || '20:00';
    const badgeUrl = this.badgeUrlInput.value.trim();

    const venue = getVenueDetails(venueVal);
    const badgeHtml = renderOpponentBadge(opponent, primary, secondary, badgeUrl, 68);

    this.previewContainer.innerHTML = `
      <div class="preview-cell-styled ${venue.className}">
        <div class="day-cell-header">
          <span class="day-number">15</span>
        </div>
        <article class="match-card ${venue.className}">
          <div class="match-shield-hero" title="Escudo de ${opponent}">
            ${badgeHtml}
          </div>
          <span class="match-opponent-name" title="${opponent}">${opponent}</span>
          <div class="match-info-pill-row">
            <span class="match-venue-badge ${venue.className}" title="${venue.label}">
              ${venue.code}
            </span>
            <span class="match-time" title="Horario: ${time} hs">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              ${time}
            </span>
          </div>
          <div class="match-competition-row">
            <span class="match-competition">${comp} - ${stage}</span>
          </div>
        </article>
      </div>
    `;
  }

  handleSubmit() {
    const date = this.dateInput.value;
    const opponent = this.opponentInput.value.trim();

    if (!date) {
      alert('Por favor selecciona una fecha para el partido.');
      this.dateInput.focus();
      return;
    }

    if (!opponent) {
      alert('Por favor ingresa el nombre del equipo rival.');
      this.opponentInput.focus();
      return;
    }

    const matchData = {
      date: date,
      time: this.timeInput.value || '20:00',
      opponent: opponent,
      opponentPrimaryColor: this.primaryColorInput.value,
      opponentSecondaryColor: this.secondaryColorInput.value,
      venue: this.venueSelect.value,
      competition: this.competitionInput.value.trim() || 'Liga Profesional',
      stage: this.stageInput.value.trim() || 'Fase Regular',
      badgeUrl: this.badgeUrlInput.value.trim()
    };

    if (this.currentMatchId) {
      matchData.id = this.currentMatchId;
    }

    if (this.onSave) {
      this.onSave(matchData, !!this.currentMatchId);
    }

    this.close();
  }

  promptDelete(id, matchName = 'este partido') {
    this.pendingDeleteId = id;
    const msgEl = document.getElementById('confirmDeleteMessage');
    if (msgEl) {
      msgEl.textContent = `¿Estás seguro de que deseas eliminar el partido contra "${matchName}"? Esta acción no se puede deshacer.`;
    }
    this.confirmModalEl.classList.remove('hidden');
  }

  closeConfirmModal() {
    this.confirmModalEl.classList.add('hidden');
    this.pendingDeleteId = null;
  }
}
