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
 * Obtiene el detalle del medio de pago según su tipo
 * @param {Object} medioDePago - Objeto del medio de pago
 * @returns {string} - Detalle formateado del medio de pago
 */
export function obtenerDetalleMedioPago(medioDePago) {
  if (!medioDePago || !medioDePago.tipo) {
    return '-';
  }
  
  const tipo = medioDePago.tipo.toLowerCase();
  let detalle = '';
  
  if (tipo === 'efectivo') {
    detalle = 'Efectivo';
  } else if (tipo === 'tarjetas') {
    const tipoTarjeta = medioDePago.tipoTarjeta || '-';
    const numeroTarjeta = medioDePago.numeroTarjeta || '-';
    // Mostrar solo últimos 4 dígitos por seguridad
    const ultimosDigitos = numeroTarjeta !== '-' && numeroTarjeta.length >= 4 
      ? numeroTarjeta.slice(-4) 
      : numeroTarjeta;
    detalle = `Tarjeta ${tipoTarjeta} - Nro: ****${ultimosDigitos}`;
  } else if (tipo === 'cheques') {
    const numero = medioDePago.numero || '-';
    const fechaVencimiento = medioDePago.fechaVencimiento 
      ? formatearFecha(medioDePago.fechaVencimiento) 
      : '-';
    detalle = `Cheque Nro: ${numero} - Vencimiento: ${fechaVencimiento}`;
  } else if (tipo === 'monedaextranjera' || tipo === 'monedaextranjera') {
    const tipoMoneda = medioDePago.tipoMoneda || '-';
    const montoExtranjero = medioDePago.montoExtranjero || 0;
    const cotizacion = medioDePago.cotizacion || 0;
    detalle = `${tipoMoneda} ${montoExtranjero} - Cotización: ${cotizacion}`;
  } else {
    detalle = 'Desconocido';
  }
  
  return detalle;
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

