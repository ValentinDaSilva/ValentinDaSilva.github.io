/* Generación de JSON de factura */

let facturaGenerada = null;

/**
 * Obtiene la fecha actual en formato YYYY-MM-DD
 * @returns {string} - Fecha actual
 */
function obtenerFechaActual() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const día = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${día}`;
}

/**
 * Calcula el número de noches entre dos fechas
 * @param {string} fechaInicio - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fechaFin - Fecha de fin (YYYY-MM-DD) o null para usar fecha actual
 * @returns {number} - Número de noches
 */
function calcularNumeroNoches(fechaInicio, fechaFin) {
  if (!fechaInicio) return 0;
  
  const inicio = new Date(fechaInicio);
  const fin = fechaFin ? new Date(fechaFin) : new Date();
  
  // Ajustar horas para calcular días correctamente
  inicio.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(fin - inicio);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Calcula el valor total de la estadía
 * @param {Object} estadia - Objeto estadía
 * @returns {number} - Valor total de la estadía
 */
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

/**
 * Calcula el total de consumos
 * @param {Array} consumos - Array de consumos
 * @returns {number} - Total de consumos
 */
function calcularTotalConsumos(consumos) {
  if (!consumos || !Array.isArray(consumos)) {
    return 0;
  }
  
  return consumos.reduce((total, consumo) => {
    return total + (consumo.precio || 0);
  }, 0);
}

/**
 * Calcula el IVA (21%)
 * @param {number} subtotal - Subtotal antes de IVA
 * @returns {number} - Monto de IVA
 */
function calcularIVA(subtotal) {
  return subtotal * 0.21;
}

/**
 * Calcula el recargo por checkout tardío según la hora de salida
 * @param {string} horaSalida - Hora de salida en formato HH:mm
 * @param {number} costoPorNoche - Costo de una noche de la habitación
 * @returns {Object} - Objeto con el recargo y mensaje
 */
function calcularRecargoCheckout(horaSalida, costoPorNoche) {
  if (!horaSalida || !costoPorNoche) {
    return {
      recargo: 0,
      tipo: 'normal',
      mensaje: '',
      requiereNuevaOcupacion: false
    };
  }

  // Convertir hora a minutos desde medianoche para facilitar comparación
  const [horas, minutos] = horaSalida.split(':').map(Number);
  const minutosDesdeMedianoche = horas * 60 + minutos;
  
  const limiteNormal = 10 * 60; // 10:00 = 600 minutos
  const limiteTolerancia = 11 * 60; // 11:00 = 660 minutos
  const limiteRecargoCompleto = 18 * 60; // 18:00 = 1080 minutos

  if (minutosDesdeMedianoche <= limiteTolerancia) {
    // Check-out normal: antes de las 11:00
    return {
      recargo: 0,
      tipo: 'normal',
      mensaje: 'Check-out normal (antes de las 11:00)',
      requiereNuevaOcupacion: false
    };
  } else if (minutosDesdeMedianoche <= limiteRecargoCompleto) {
    // Recargo del 50%: entre 11:01 y 18:00
    const recargo = costoPorNoche * 0.5;
    return {
      recargo: recargo,
      tipo: 'recargo_parcial',
      mensaje: `Recargo por checkout tardío (11:01 - 18:00): 50% del valor de la habitación`,
      requiereNuevaOcupacion: false
    };
  } else {
    // Recargo completo: después de las 18:00
    const recargo = costoPorNoche;
    return {
      recargo: recargo,
      tipo: 'recargo_completo',
      mensaje: `Recargo por checkout tardío (después de las 18:00): día completo`,
      requiereNuevaOcupacion: true
    };
  }
}

// Valores de enums (deben coincidir con Enums.js)
const TipoFactura = {
  A: "A",
  B: "B"
};

const EstadoFactura = {
  PENDIENTE: "Pendiente",
  PAGADA: "Pagada"
};

/**
 * Genera el JSON de la factura
 * @param {Object} estadia - Objeto estadía
 * @param {Object} responsableDePago - Responsable de pago (huésped o tercero)
 * @param {string} horaSalida - Hora de salida
 * @param {string} tipoFactura - Tipo de factura (A o B)
 * @returns {Object} - JSON de la factura
 */
function generarJSONFactura(estadia, responsableDePago, horaSalida, tipoFactura = TipoFactura.B) {
  if (!estadia) {
    throw new Error('No se puede generar factura sin estadía');
  }
  
  const fechaActual = obtenerFechaActual();
  const horaActual = new Date().toTimeString().slice(0, 5);
  
  // Calcular valores
  const valorEstadia = calcularValorEstadia(estadia);
  const numeroNoches = calcularNumeroNoches(
    estadia.fechaCheckIn,
    estadia.fechaCheckOut || fechaActual
  );
  const totalConsumos = calcularTotalConsumos(estadia.consumos || []);
  
  // Calcular recargo por checkout tardío
  const costoPorNoche = estadia.reserva.habitaciones[0].costoPorNoche || 0;
  const recargoCheckout = calcularRecargoCheckout(horaSalida, costoPorNoche);
  
  const subtotal = valorEstadia + totalConsumos + recargoCheckout.recargo;
  const iva = calcularIVA(subtotal);
  const total = subtotal + iva;
  
  // Determinar responsable de pago
  let responsable = null;
  if (responsableDePago.razonSocial) {
    // Es un responsable de pago (tercero)
    responsable = {
      tipo: 'tercero',
      razonSocial: responsableDePago.razonSocial,
      cuit: responsableDePago.cuit,
      telefono: responsableDePago.telefono,
      direccion: responsableDePago.direccion
    };
  } else {
    // Es un huésped
    responsable = {
      tipo: 'huesped',
      apellido: responsableDePago.apellido || estadia.titular.apellido,
      nombres: responsableDePago.nombres || estadia.titular.nombres,
      documento: responsableDePago.numeroDocumento || estadia.titular.numeroDocumento,
      cuit: responsableDePago.cuit || estadia.titular.cuit
    };
  }
  
  // Generar factura
  const factura = {
    id: null, // Se asignará al guardar
    hora: horaActual,
    fecha: fechaActual,
    horaSalida: horaSalida,
    tipo: tipoFactura,
    estado: EstadoFactura.PENDIENTE,
    responsableDePago: responsable,
    medioDePago: null, // Se asignará después
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

/**
 * Obtiene la factura generada
 * @returns {Object|null} - Factura generada
 */
function obtenerFacturaGenerada() {
  return facturaGenerada;
}

/**
 * Limpia la factura generada
 */
function limpiarFacturaGenerada() {
  facturaGenerada = null;
}

