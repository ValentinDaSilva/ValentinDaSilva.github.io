

let facturaGenerada = null;


function obtenerFechaActual() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const día = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${día}`;
}


function calcularNumeroNoches(fechaInicio, fechaFin) {
  if (!fechaInicio) return 0;
  
  const inicio = new Date(fechaInicio);
  const fin = fechaFin ? new Date(fechaFin) : new Date();
  
  
  inicio.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(fin - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}


function calcularValorEstadia(estadia) {
  if (!estadia || !estadia.reserva || !estadia.reserva.habitaciones) {
    return 0;
  }
  
  const habitacion = estadia.reserva.habitaciones[0];
  const costoPorNoche = habitacion.costoPorNoche || 0;
  const numeroNoches = calcularNumeroNoches(
    estadia.fechaCheckIn,
    estadia.fechaCheckOut || obtenerFechaActual()
  );
  
  return costoPorNoche * numeroNoches;
}


function calcularTotalConsumos(consumos) {
  if (!consumos || !Array.isArray(consumos)) {
    return 0;
  }
  
  return consumos.reduce((total, consumo) => {
    return total + (consumo.precio || 0);
  }, 0);
}


function calcularIVA(subtotal) {
  return subtotal * 0.21;
}


function calcularRecargoCheckout(horaSalida, costoPorNoche) {
  if (!horaSalida || !costoPorNoche) {
    return {
      recargo: 0,
      tipo: 'normal',
      mensaje: '',
      requiereNuevaOcupacion: false
    };
  }

  
  const [horas, minutos] = horaSalida.split(':').map(Number);
  const minutosDesdeMedianoche = horas * 60 + minutos;
  
  const limiteNormal = 10 * 60; 
  const limiteTolerancia = 11 * 60; 
  const limiteRecargoCompleto = 18 * 60; 

  if (minutosDesdeMedianoche <= limiteTolerancia) {
    
    return {
      recargo: 0,
      tipo: 'normal',
      mensaje: 'Check-out normal (antes de las 11:00)',
      requiereNuevaOcupacion: false
    };
  } else if (minutosDesdeMedianoche <= limiteRecargoCompleto) {
    
    const recargo = costoPorNoche * 0.5;
    return {
      recargo: recargo,
      tipo: 'recargo_parcial',
      mensaje: `Recargo por checkout tardío (11:01 - 18:00): 50% del valor de la habitación`,
      requiereNuevaOcupacion: false
    };
  } else {
    
    const recargo = costoPorNoche;
    return {
      recargo: recargo,
      tipo: 'recargo_completo',
      mensaje: `Recargo por checkout tardío (después de las 18:00): día completo`,
      requiereNuevaOcupacion: true
    };
  }
}


const TipoFactura = {
  A: "A",
  B: "B"
};

const EstadoFactura = {
  PENDIENTE: "Pendiente",
  PAGADA: "Pagada"
};


function generarJSONFactura(estadia, responsableDePago, horaSalida, tipoFactura = TipoFactura.B) {
  if (!estadia) {
    throw new Error('No se puede generar factura sin estadía');
  }
  
  const fechaActual = obtenerFechaActual();
  const horaActual = new Date().toTimeString().slice(0, 5);
  
  
  const valorEstadia = calcularValorEstadia(estadia);
  const numeroNoches = calcularNumeroNoches(
    estadia.fechaCheckIn,
    estadia.fechaCheckOut || fechaActual
  );
  const totalConsumos = calcularTotalConsumos(estadia.consumos || []);
  
  
  const costoPorNoche = estadia.reserva.habitaciones[0].costoPorNoche || 0;
  const recargoCheckout = calcularRecargoCheckout(horaSalida, costoPorNoche);
  
  const subtotal = valorEstadia + totalConsumos + recargoCheckout.recargo;
  const iva = calcularIVA(subtotal);
  const total = subtotal + iva;
  
  
  let responsable = null;
  if (responsableDePago.razonSocial) {
    
    responsable = {
      tipo: 'tercero',
      razonSocial: responsableDePago.razonSocial,
      cuit: responsableDePago.cuit,
      telefono: responsableDePago.telefono,
      direccion: responsableDePago.direccion
    };
  } else {
    
    responsable = {
      tipo: 'huesped',
      apellido: responsableDePago.apellido || estadia.titular.apellido,
      nombres: responsableDePago.nombres || estadia.titular.nombres,
      documento: responsableDePago.numeroDocumento || estadia.titular.numeroDocumento,
      cuit: responsableDePago.cuit || estadia.titular.cuit
    };
  }
  
  
  const factura = {
    id: null, 
    hora: horaActual,
    fecha: fechaActual,
    horaSalida: horaSalida,
    tipo: tipoFactura,
    estado: EstadoFactura.PENDIENTE,
    responsableDePago: responsable,
    medioDePago: null, 
    estadia: {
      id: estadia.id,
      fechaCheckIn: estadia.fechaCheckIn,
      fechaCheckOut: estadia.fechaCheckOut || fechaActual,
      habitacion: estadia.reserva.habitaciones[0],
      titular: estadia.titular,
      acompaniantes: estadia.acompaniantes || []
    },
    detalle: {
      valorEstadia: valorEstadia,
      numeroNoches: numeroNoches,
      costoPorNoche: estadia.reserva.habitaciones[0].costoPorNoche,
      consumos: estadia.consumos || [],
      totalConsumos: totalConsumos,
      recargoCheckout: recargoCheckout.recargo,
      tipoRecargoCheckout: recargoCheckout.tipo,
      mensajeRecargoCheckout: recargoCheckout.mensaje,
      requiereNuevaOcupacion: recargoCheckout.requiereNuevaOcupacion,
      subtotal: subtotal,
      iva: iva,
      total: total
    }
  };
  
  facturaGenerada = factura;
  return factura;
}


function obtenerFacturaGenerada() {
  return facturaGenerada;
}


function limpiarFacturaGenerada() {
  facturaGenerada = null;
}

