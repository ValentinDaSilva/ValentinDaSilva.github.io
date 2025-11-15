/* Utilidades y funciones auxiliares */

/**
 * Formatea una fecha de formato YYYY-MM-DD a DD/MM/YYYY
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} - Fecha formateada
 */
export function formatearFecha(fecha) {
  if (!fecha) return '-';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Formatea un monto a formato de moneda argentina
 * @param {number} monto - Monto a formatear
 * @returns {string} - Monto formateado
 */
export function formatearMonto(monto) {
  if (monto === null || monto === undefined) return '$0.00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(monto);
}

/**
 * Obtiene el nombre del responsable de pago
 * @param {Object} responsableDePago - Objeto del responsable de pago
 * @returns {string} - Nombre formateado
 */
export function obtenerNombreResponsable(responsableDePago) {
  if (!responsableDePago) {
    return '-';
  }
  
  if (responsableDePago.tipo === 'huesped') {
    const apellido = responsableDePago.apellido || '';
    const nombres = responsableDePago.nombres || '';
    return `${apellido}, ${nombres}`.trim() || '-';
  } else if (responsableDePago.tipo === 'tercero') {
    return responsableDePago.razonSocial || '-';
  }
  
  return '-';
}

