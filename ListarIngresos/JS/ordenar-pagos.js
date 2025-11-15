/* Funcionalidad de ordenamiento de pagos */

import { mostrarResultados } from './mostrar-resultados.js';
import { obtenerPagosFiltrados } from './filtrar-pagos.js';
import { obtenerNombreResponsable } from './utilidades.js';

// Variable para almacenar el criterio de ordenamiento actual
let criterioOrdenamientoActual = 'fecha';

/**
 * Obtiene el tipo de medio de pago normalizado
 * @param {Object} medioDePago - Objeto del medio de pago
 * @returns {string} - Tipo de medio de pago normalizado
 */
function obtenerTipoMedioPago(medioDePago) {
  if (!medioDePago || !medioDePago.tipo) {
    return 'Desconocido';
  }
  
  const tipo = medioDePago.tipo.toLowerCase();
  
  if (tipo === 'efectivo') return 'Efectivo';
  if (tipo === 'tarjetas') return 'Tarjeta';
  if (tipo === 'cheques') return 'Cheque';
  if (tipo === 'monedaextranjera' || tipo === 'monedaextranjera') return 'Moneda Extranjera';
  
  return 'Desconocido';
}

/**
 * Función de comparación para ordenar pagos
 * @param {Object} a - Primer pago
 * @param {Object} b - Segundo pago
 * @returns {number} - Resultado de la comparación
 */
function compararPagos(a, b) {
  switch (criterioOrdenamientoActual) {
    case 'fecha':
      const fechaA = a.fecha || '';
      const fechaB = b.fecha || '';
      if (fechaA !== fechaB) {
        return fechaA.localeCompare(fechaB);
      }
      // Si las fechas son iguales, ordenar por hora
      const horaA = a.hora || '';
      const horaB = b.hora || '';
      return horaA.localeCompare(horaB);
      
    case 'monto':
      const montoA = a.montoTotal || 0;
      const montoB = b.montoTotal || 0;
      return montoB - montoA; // Orden descendente
      
    case 'tipoMedio':
      const tipoA = obtenerTipoMedioPago(a.medioDePago);
      const tipoB = obtenerTipoMedioPago(b.medioDePago);
      return tipoA.localeCompare(tipoB);
      
    case 'responsable':
      const nombreA = obtenerNombreResponsable(a.responsableDePago);
      const nombreB = obtenerNombreResponsable(b.responsableDePago);
      return nombreA.localeCompare(nombreB);
      
    default:
      return 0;
  }
}

/**
 * Ordena los pagos según el criterio seleccionado
 * @param {string} criterio - Criterio de ordenamiento (fecha, monto, tipoMedio, responsable)
 */
export function ordenarPagos(criterio) {
  criterioOrdenamientoActual = criterio;
  const pagos = [...obtenerPagosFiltrados()];
  
  // Ordenar los pagos
  pagos.sort(compararPagos);
  
  // Volver a mostrar los resultados con el nuevo orden
  mostrarResultados(pagos);
}

/**
 * Obtiene el criterio de ordenamiento actual
 * @returns {string} - Criterio actual
 */
export function obtenerCriterioOrdenamiento() {
  return criterioOrdenamientoActual;
}

