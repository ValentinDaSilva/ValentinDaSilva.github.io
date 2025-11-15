/* Selección de facturas para anular */

import { obtenerFacturasActuales } from './buscar-facturas.js';
import { obtenerFacturas } from './datos-facturas.js';

let facturasSeleccionadas = [];

/**
 * Obtiene las facturas seleccionadas
 * @returns {Array} - Array de IDs de facturas seleccionadas
 */
export function obtenerFacturasSeleccionadas() {
  const checkboxes = document.querySelectorAll('#tablaFacturas input[type="checkbox"]:checked');
  const idsSeleccionados = Array.from(checkboxes).map(cb => parseInt(cb.dataset.facturaId));
  
  // Obtener los objetos completos de las facturas
  const todasLasFacturas = obtenerFacturas();
  facturasSeleccionadas = idsSeleccionados
    .map(id => todasLasFacturas.find(f => f.id === id))
    .filter(f => f !== undefined);
  
  return facturasSeleccionadas;
}

/**
 * Obtiene los objetos completos de las facturas seleccionadas
 * @returns {Array} - Array de objetos factura
 */
export function obtenerFacturasSeleccionadasCompletas() {
  return facturasSeleccionadas;
}

/**
 * Limpia la selección de facturas
 */
export function limpiarSeleccionFacturas() {
  facturasSeleccionadas = [];
  const checkboxes = document.querySelectorAll('#tablaFacturas input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
}




