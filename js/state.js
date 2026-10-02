/**
 * state.js - Gestión de estado y persistencia de partidos con LocalStorage
 * Diseñado con arquitectura desacoplada para fácil migración a API/Base de datos
 */

import { INITIAL_MATCHES } from './sampleData.js';

const STORAGE_KEY = 'boca_calendar_matches_v2';

class MatchState {
  constructor() {
    this.matches = [];
    this.listeners = [];
    this.init();
  }

  init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.matches = parsed.filter(m => m && typeof m === 'object' && m.id && m.date);
        } else {
          this.matches = [...INITIAL_MATCHES];
          this.saveToStorage();
        }
      } else {
        // Carga inicial con partidos de ejemplo
        this.matches = [...INITIAL_MATCHES];
        this.saveToStorage();
      }
    } catch (e) {
      console.error('Error al acceder a localStorage:', e);
      this.matches = [...INITIAL_MATCHES];
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.matches));
    } catch (e) {
      console.error('Error al guardar en localStorage:', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => {
      try {
        fn(this.matches);
      } catch (err) {
        console.error('Error en suscriptor de estado:', err);
      }
    });
  }

  getAllMatches() {
    return [...this.matches];
  }

  getMatchById(id) {
    return this.matches.find(m => m.id === id) || null;
  }

  getMatchesByDate(dateStr) {
    return this.matches
      .filter(m => m && m.date === dateStr)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));
  }

  getMatchesForMonth(year, month) {
    const monthStr = String(month + 1).padStart(2, '0');
    const prefix = `${year}-${monthStr}`;
    return this.matches
      .filter(m => m && m.date && m.date.startsWith(prefix))
      .sort((a, b) => ((a.date || '') + (a.time || '')).localeCompare((b.date || '') + (b.time || '')));
  }

  addMatch(matchData) {
    const id = matchData.id || `match-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const newMatch = {
      id,
      date: matchData.date,
      time: matchData.time || '20:00',
      opponent: (matchData.opponent || 'Rival a definir').trim(),
      opponentPrimaryColor: matchData.opponentPrimaryColor || '#002B66',
      opponentSecondaryColor: matchData.opponentSecondaryColor || '#FFC700',
      venue: matchData.venue || 'Local',
      competition: matchData.competition || 'Liga Profesional',
      stage: matchData.stage || 'Fase Regular',
      badgeUrl: (matchData.badgeUrl || '').trim()
    };

    this.matches.push(newMatch);
    this.saveToStorage();
    this.notify();
    return newMatch;
  }

  updateMatch(id, updatedData) {
    const index = this.matches.findIndex(m => m.id === id);
    if (index === -1) return null;

    this.matches[index] = {
      ...this.matches[index],
      ...updatedData,
      id // Mantiene ID original
    };

    this.saveToStorage();
    this.notify();
    return this.matches[index];
  }

  deleteMatch(id) {
    const index = this.matches.findIndex(m => m.id === id);
    if (index === -1) return false;

    this.matches.splice(index, 1);
    this.saveToStorage();
    this.notify();
    return true;
  }

  resetToDefault() {
    this.matches = [...INITIAL_MATCHES];
    this.saveToStorage();
    this.notify();
  }
}

export const matchState = new MatchState();
