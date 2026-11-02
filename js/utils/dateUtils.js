/**
 * dateUtils.js - Utilidades para manejo de fechas en formato ISO y calendario
 */

// Nombres de meses en español
export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

// Nombres cortos de los días comenzando en Lunes
export const DAY_NAMES = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
export const FULL_DAY_NAMES = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

/**
 * Obtiene el formato YYYY-MM-DD local a partir de una fecha
 */
export function formatDateISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Convierte un string YYYY-MM-DD a objeto Date (a medianoche local)
 */
export function parseISODate(dateStr) {
  if (!dateStr) return new Date();
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formatea la hora HH:mm a formato amigable con "hs"
 * ej: "21:30" -> "21:30 hs"
 */
export function formatTime(timeStr) {
  if (!timeStr) return '';
  return `${timeStr} hs`;
}

/**
 * Genera la grilla de días para un mes dado, comenzando en Lunes
 * Retorna array de objetos con info de cada celda:
 * { date: Date, dateStr: 'YYYY-MM-DD', dayNumber: number, isCurrentMonth: boolean, isToday: boolean }
 */
export function getMonthCalendarDays(year, month) {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Día de la semana del día 1 (0 = domingo, 1 = lunes, ..., 6 = sábado)
  // Convertimos a índice con Lunes = 0, ..., Domingo = 6
  let firstDayWeekIndex = firstDayOfMonth.getDay() - 1;
  if (firstDayWeekIndex < 0) firstDayWeekIndex = 6; // Si era domingo (0), pasa a ser 6

  const todayStr = formatDateISO(new Date());
  const calendarCells = [];

  // Días del mes anterior para completar la primera semana
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = firstDayWeekIndex - 1; i >= 0; i--) {
    const dayNum = prevMonthLastDay - i;
    const cellDate = new Date(year, month - 1, dayNum);
    const dateStr = formatDateISO(cellDate);
    calendarCells.push({
      date: cellDate,
      dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  // Días del mes actual
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const dateStr = formatDateISO(cellDate);
    calendarCells.push({
      date: cellDate,
      dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayStr
    });
  }

  // Si el mes se desborda a una 6ta fila (más de 35 celdas, como ocurre en Noviembre cuando el 30
  // o 30 y 31 caen en la semana 6), se integran en la fila anterior (30 en el 23, 31 en el 24).
  // De esta manera se elimina la 6ta fila innecesaria y la cuadrícula queda en 5 filas uniformes.
  if (calendarCells.length > 35) {
    const overflowCells = calendarCells.splice(35);
    overflowCells.forEach((overflowCell, index) => {
      const targetIndex = 28 + index; // 28 es el lunes de la 5ta fila (ej: día 23)
      if (calendarCells[targetIndex]) {
        calendarCells[targetIndex].splitDay = overflowCell;
      }
    });
  }

  // Rellenar hasta exactamente 35 celdas (5 filas × 7 columnas)
  // Garantiza que todos los meses tengan la misma altura de cuadrícula de 5 semanas
  const totalTarget = 35;
  const daysToAdd = totalTarget - calendarCells.length;

  for (let d = 1; d <= daysToAdd; d++) {
    const cellDate = new Date(year, month + 1, d);
    const dateStr = formatDateISO(cellDate);
    calendarCells.push({
      date: cellDate,
      dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayStr
    });
  }

  return calendarCells;
}

/**
 * Retorna fecha formateada para lectura (ej: "Sábado 18 de Octubre, 2026")
 */
export function formatReadableDate(dateStr) {
  const d = parseISODate(dateStr);
  const dayIndex = d.getDay() === 0 ? 6 : d.getDay() - 1;
  const dayName = FULL_DAY_NAMES[dayIndex];
  const dayNum = d.getDate();
  const monthName = MONTH_NAMES[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName} ${dayNum} de ${monthName}, ${year}`;
}
