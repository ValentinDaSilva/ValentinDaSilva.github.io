/* Funcionalidad de ordenamiento de cheques */

import { mostrarResultados } from './mostrar-resultados.js';
import { obtenerChequesFiltrados } from './filtrar-cheques.js';
import { obtenerNombreResponsable } from './utilidades.js';

// Variable para almacenar el criterio de ordenamiento actual
let criterioOrdenamientoActual = 'fecha';

/**
 * Función de comparación para ordenar cheques
 * @param {Object} a - Primer cheque
 * @param {Object} b - Segundo cheque
 * @returns {number} - Resultado de la comparación
 */
function compararCheques(a, b) {
  switch (criterioOrdenamientoActual) {
    case 'fecha':
      // Ordenar por fecha de cobro (o fecha de pago si no hay fecha de cobro)
      const fechaA = a.fechaCobro || a.fechaPago || '';
      const fechaB = b.fechaCobro || b.fechaPago || '';
      return fechaA.localeCompare(fechaB);
      
    case 'monto':
      const montoA = a.importe || 0;
      const montoB = b.importe || 0;
      return montoB - montoA; // Orden descendente
      
    case 'numero':
      const numeroA = a.numeroCheque || '';
      const numeroB = b.numeroCheque || '';
      return numeroA.localeCompare(numeroB);
      
    case 'banco':
      const bancoA = a.banco || '';
      const bancoB = b.banco || '';
      return bancoA.localeCompare(bancoB);
      
    case 'responsable':
      const nombreA = obtenerNombreResponsable(a.responsableDePago);
      const nombreB = obtenerNombreResponsable(b.responsableDePago);
      return nombreA.localeCompare(nombreB);
      
    default:
      return 0;
  }
}

/**
 * Ordena los cheques según el criterio seleccionado
 * @param {string} criterio - Criterio de ordenamiento (fecha, monto, numero, banco, responsable)
 */
export function ordenarCheques(criterio) {
  criterioOrdenamientoActual = criterio;
  const cheques = [...obtenerChequesFiltrados()];
  
  // Ordenar los cheques
  cheques.sort(compararCheques);
  
  // Volver a mostrar los resultados con el nuevo orden
  mostrarResultados(cheques);
}

/**
 * Obtiene el criterio de ordenamiento actual
 * @returns {string} - Criterio actual
 */
export function obtenerCriterioOrdenamiento() {
  return criterioOrdenamientoActual;
}

