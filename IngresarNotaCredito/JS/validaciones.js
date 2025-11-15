/* Validaciones */

import { mensajeError } from './modales.js';
import { obtenerFacturasSeleccionadas } from './seleccion-facturas.js';

/**
 * Valida que se haya ingresado un DNI o CUIT
 * @param {string} dniCuit - DNI o CUIT a validar
 * @returns {boolean} - true si es válido
 */
export function validarDniCuit(dniCuit) {
  if (!dniCuit || dniCuit.trim() === '') {
    mensajeError('Debe ingresar un DNI o CUIT del responsable de pago.');
    return false;
  }
  return true;
}

/**
 * Valida que se hayan seleccionado facturas
 * @returns {boolean} - true si hay facturas seleccionadas
 */
export function validarFacturasSeleccionadas() {
  const facturasSeleccionadas = obtenerFacturasSeleccionadas();
  
  if (!facturasSeleccionadas || facturasSeleccionadas.length === 0) {
    mensajeError('Debe seleccionar al menos una factura para anular.');
    return false;
  }
  
  return true;
}




