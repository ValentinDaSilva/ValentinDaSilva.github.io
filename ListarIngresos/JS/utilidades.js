


export function formatearFecha(fecha) {
  if (!fecha) return '-';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}


export function formatearMonto(monto) {
  if (monto === null || monto === undefined) return '$0.00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(monto);
}


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


export function obtenerNombreResponsable(responsableDePago) {
  if (!responsableDePago) {
    return '-';
  }
  
  if (responsableDePago.tipo === 'huesped') {
    const apellido = responsableDePago.apellido || '';
    const nombre = responsableDePago.nombre || '';
    return `${apellido}, ${nombre}`.trim() || '-';
  } else if (responsableDePago.tipo === 'tercero') {
    return responsableDePago.razonSocial || '-';
  }
  
  return '-';
}

