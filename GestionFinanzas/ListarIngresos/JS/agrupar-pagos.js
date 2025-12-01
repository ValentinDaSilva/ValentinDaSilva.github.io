


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


function obtenerTipoMedioPago(medioDePago) {
  if (!medioDePago || !medioDePago.tipo) {
    return 'Desconocido';
  }
  
  const tipo = medioDePago.tipo.toLowerCase();
  
  
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


export function calcularTotalGeneral(pagos) {
  return pagos.reduce((total, pago) => {
    return total + (pago.montoTotal || 0);
  }, 0);
}

