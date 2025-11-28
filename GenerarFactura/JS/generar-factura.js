

let facturaGenerada = null;

// Hacer facturaGenerada disponible globalmente
if (typeof window !== 'undefined') {
  // Crear getter/setter para facturaGenerada
  Object.defineProperty(window, 'facturaGenerada', {
    get: function() {
      return facturaGenerada;
    },
    set: function(value) {
      facturaGenerada = value;
    },
    enumerable: true,
    configurable: true
  });
}


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

/**
 * Convierte un huésped al formato estándar requerido
 * @param {Object} huesped - Huésped en cualquier formato (dominio, JSON, etc.)
 * @returns {Object} Huésped en formato estándar
 */
function convertirHuespedAFormatoEstandar(huesped) {
  if (!huesped) return null;
  
  // Obtener dirección - puede venir como objeto direccion o como campos planos
  let direccion = null;
  if (huesped.direccion && typeof huesped.direccion === 'object') {
    // Dirección viene como objeto
    const dir = huesped.direccion;
    direccion = {
      calle: dir.calle || '',
      numero: dir.numero || '',
      piso: dir.piso || '',
      departamento: dir.departamento || '',
      ciudad: dir.ciudad || dir.localidad || '',
      provincia: dir.provincia || '',
      codigoPostal: dir.codigoPostal || '',
      pais: dir.pais || ''
    };
  } else if (huesped.calle || huesped.numeroCalle || huesped.localidad) {
    // Dirección viene en formato plano (campos directos del huésped)
    direccion = {
      calle: huesped.calle || '',
      numero: huesped.numero || huesped.numeroCalle || '',
      piso: huesped.piso || '',
      departamento: huesped.departamento || '',
      ciudad: huesped.ciudad || huesped.localidad || '',
      provincia: huesped.provincia || '',
      codigoPostal: huesped.codigoPostal || '',
      pais: huesped.pais || ''
    };
  } else {
    // Si no hay dirección, crear una vacía
    direccion = {
      calle: '',
      numero: '',
      piso: '',
      departamento: '',
      ciudad: '',
      provincia: '',
      codigoPostal: '',
      pais: ''
    };
  }
  
  return {
    apellido: huesped.apellido || '',
    nombre: huesped.nombre || huesped.nombre || '',
    tipoDocumento: huesped.tipoDocumento || '',
    numeroDocumento: huesped.numeroDocumento || huesped.nroDocumento || huesped.documento || '',
    cuit: huesped.cuit || '',
    email: huesped.email || '',
    ocupacion: huesped.ocupacion || '',
    nacionalidad: huesped.nacionalidad || '',
    direccion: direccion
  };
}


async function generarJSONFactura(estadia, responsableDePago, horaSalida, tipoFactura = TipoFactura.B) {
  if (!estadia) {
    throw new Error('No se puede generar factura sin estadía');
  }
  
  // Importar la clase Factura para usar sus métodos
  const Factura = (await import('../../Clases/Dominio/Factura.js')).default;
  const PersonaFisica = (await import('../../Clases/Dominio/PersonaFisica.js')).default;
  const PersonaJuridica = (await import('../../Clases/Dominio/PersonaJuridica.js')).default;
  
  // Crear instancia de Factura temporal para usar sus métodos de cálculo
  const facturaTemporal = new Factura(null, null, null, null, null, null, estadia);
  const fechaActual = facturaTemporal.obtenerFechaActual();
  const horaActual = new Date().toTimeString().slice(0, 5);
  
  // Usar métodos de la clase Factura para calcular IVA y total (ahora es async)
  const resultado = await facturaTemporal.calcularDetalle(estadia, horaSalida);
  
  // Crear responsable usando la clase ResponsableDePago
  let responsable = null;
  
  // Si ya es una instancia de ResponsableDePago (PersonaFisica o PersonaJuridica), usarla directamente
  if (responsableDePago && (responsableDePago instanceof PersonaFisica || responsableDePago instanceof PersonaJuridica)) {
    responsable = responsableDePago;
  } else if (responsableDePago.razonSocial) {
    // Es un tercero (persona jurídica)
    responsable = new PersonaJuridica({
      razonSocial: responsableDePago.razonSocial,
      cuit: responsableDePago.cuit,
      telefono: responsableDePago.telefono,
      direccion: responsableDePago.direccion
    });
  } else {
    // Es un huésped (persona física)
    responsable = new PersonaFisica({
      apellido: responsableDePago.apellido || estadia.titular.apellido,
      nombre: responsableDePago.nombre || estadia.titular.nombre,
      documento: responsableDePago.numeroDocumento || responsableDePago.documento || estadia.titular.numeroDocumento
    });
  }
  
  // Generar JSON con la estructura completa de Factura (sin detalle)
  // Convertir responsable a JSON si es una instancia de ResponsableDePago
  const responsableJSON = (responsable instanceof PersonaFisica || responsable instanceof PersonaJuridica)
    ? responsable.toJSON() 
    : responsable;
  
  // Convertir titular y acompañantes al formato estándar
  const titularEstandar = convertirHuespedAFormatoEstandar(estadia.titular);
  const acompaniantesEstandar = (estadia.acompaniantes || []).map(acomp => 
    convertirHuespedAFormatoEstandar(acomp)
  ).filter(acomp => acomp !== null);
  
  // Crear estadía con huéspedes en formato estándar
  const estadiaEstandar = {
    ...estadia,
    titular: titularEstandar,
    acompaniantes: acompaniantesEstandar
  };
  
  // Generar JSON de Factura con solo los campos de la clase Factura
  const factura = {
    id: null, 
    hora: horaActual,
    fecha: fechaActual,
    tipo: tipoFactura,
    estado: EstadoFactura.PENDIENTE,
    responsableDePago: responsableJSON,
    estadia: estadiaEstandar, // Estadía con huéspedes en formato estándar
    pagos: [], // Array vacío inicialmente
    total: resultado.total, // Total de la factura
    iva: resultado.iva, // IVA calculado
    horaSalida: horaSalida // Hora de salida para calcular recargos
  };
  
  facturaGenerada = factura;
  return factura;
}


function obtenerFacturaGenerada() {
  // Primero verificar window.facturaGenerada, luego la variable local
  if (typeof window !== 'undefined' && window.facturaGenerada) {
    facturaGenerada = window.facturaGenerada;
    return window.facturaGenerada;
  }
  return facturaGenerada;
}


function limpiarFacturaGenerada() {
  facturaGenerada = null;
  if (typeof window !== 'undefined') {
    window.facturaGenerada = null;
  }
}


if (typeof window !== 'undefined') {
  window.generarJSONFactura = generarJSONFactura;
  window.obtenerFacturaGenerada = obtenerFacturaGenerada;
  window.limpiarFacturaGenerada = limpiarFacturaGenerada;
}

