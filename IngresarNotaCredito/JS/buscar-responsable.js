/* Búsqueda de responsable de pago */

import { buscarResponsablePorDniCuit } from './datos-responsables.js';
import { mensajeError } from './modales.js';

let responsableActual = null;

/**
 * Busca un responsable de pago por DNI o CUIT
 * @param {string} dniCuit - DNI o CUIT a buscar
 * @returns {Promise<Object|null>} - Responsable encontrado o null
 */
export async function buscarResponsable(dniCuit) {
  if (!dniCuit || dniCuit.trim() === '') {
    mensajeError('Debe ingresar un DNI o CUIT del responsable de pago.');
    return null;
  }
  
  try {
    const responsable = await buscarResponsablePorDniCuit(dniCuit.trim());
    
    if (!responsable) {
      mensajeError('No se encontró un responsable de pago con el DNI o CUIT ingresado.');
      return null;
    }
    
    responsableActual = responsable;
    return responsable;
  } catch (error) {
    console.error('Error al buscar responsable:', error);
    mensajeError('Error al buscar el responsable de pago. Por favor, intente nuevamente.');
    return null;
  }
}

/**
 * Obtiene el responsable actual
 * @returns {Object|null} - Responsable actual
 */
export function obtenerResponsableActual() {
  return responsableActual;
}

/**
 * Limpia el responsable actual
 */
export function limpiarResponsableActual() {
  responsableActual = null;
}


