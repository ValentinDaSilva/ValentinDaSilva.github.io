/* Agrupación de pagos por tipo de medio de pago */

/**
 * Agrupa los pagos por tipo de medio de pago
 * @param {Array} pagos - Array de pagos a agrupar
 * @returns {Object} - Objeto con pagos agrupados por tipo
 */
export function agruparPagosPorTipo(pagos) {
  const grupos = {};
  
  pagos.forEach(pago => {
    const tipoMedio = obtenerTipoMedioPago(pago.medioDePago);
    
    if (!grupos[tipoMedio]) {
      grupos[tipoMedio] = {
        tipo: tipoMedio,
        pagos: [],
        total: 0
      };
    }
    
    grupos[tipoMedio].pagos.push(pago);
    grupos[tipoMedio].total += pago.montoTotal || 0;
  });
  
  return grupos;
}

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
  
  // Normalizar tipos
  if (tipo === 'efectivo') {
    return 'Efectivo';
  } else if (tipo === 'tarjetas') {
    return 'Tarjeta';
  } else if (tipo === 'cheques') {
    return 'Cheque';
  } else if (tipo === 'monedaextranjera' || tipo === 'monedaextranjera') {
    return 'Moneda Extranjera';
  }
  
  return 'Desconocido';
}

/**
 * Calcula el total general de todos los pagos
 * @param {Array} pagos - Array de pagos
 * @returns {number} - Total general
 */
export function calcularTotalGeneral(pagos) {
  return pagos.reduce((total, pago) => {
    return total + (pago.montoTotal || 0);
  }, 0);
}

