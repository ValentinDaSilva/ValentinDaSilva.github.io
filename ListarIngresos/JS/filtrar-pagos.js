/* Filtrado de pagos por rango de fechas */

import { extraerTodosLosPagos } from './datos-facturas.js';

let pagosFiltrados = [];

/**
 * Filtra los pagos por rango de fechas
 * @param {string} fechaDesde - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fechaHasta - Fecha de fin (YYYY-MM-DD)
 * @returns {Array} - Array de pagos filtrados
 */
export function filtrarPagosPorFecha(fechaDesde, fechaHasta) {
  const todosLosPagos = extraerTodosLosPagos();
  
  pagosFiltrados = todosLosPagos.filter(pago => {
    const fechaPago = pago.fecha;
    
    // Comparar fechas (formato YYYY-MM-DD)
    return fechaPago >= fechaDesde && fechaPago <= fechaHasta;
  });
  
  return pagosFiltrados;
}

/**
 * Obtiene los pagos filtrados actuales
 * @returns {Array} - Array de pagos filtrados
 */
export function obtenerPagosFiltrados() {
  return pagosFiltrados;
}

