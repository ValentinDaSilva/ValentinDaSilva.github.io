

import { 
  Reserva, 
  Persona, 
  Huesped, 
  Habitacion,
  Direccion,
  EstadoReserva,
  EstadoHabitacion
} from "../../../Clases/Dominio/dominio.js";


function obtenerNumeroDesdeNombre(nombreHabitacion) {
  const partes = nombreHabitacion.split('-');
  if (partes.length === 2) {
    const numero = parseInt(partes[1], 10);
    return isNaN(numero) ? null : numero;
  }
  return null;
}


function compararFechas(fecha1, fecha2) {
  const partes1 = fecha1.split('-').map(Number);
  const partes2 = fecha2.split('-').map(Number);
  
  if (partes1[0] !== partes2[0]) return partes1[0] - partes2[0];
  if (partes1[1] !== partes2[1]) return partes1[1] - partes2[1];
  return partes1[2] - partes2[2];
}


export function convertirReservaJSONADominio(reservaJSON, idReserva, habitacionesData = []) {
  
  const id = reservaJSON.id || idReserva;
  
  
  const titular = new Persona(
    reservaJSON.titular?.nombre || '',
    reservaJSON.titular?.apellido || '',
    reservaJSON.titular?.telefono || ''
  );
  
  
  const habitaciones = (reservaJSON.habitaciones || []).map(habJSON => {
    
    if (habJSON.tipo && habJSON.costoPorNoche !== undefined) {
      return new Habitacion(
        habJSON.numero,
        habJSON.tipo,
        habJSON.categoria || '',
        habJSON.costoPorNoche,
        habJSON.estadoHabitacion === 'Disponible' ? EstadoHabitacion.DISPONIBLE : EstadoHabitacion.OCUPADA
      );
    }
    
    
    const habitacionData = habitacionesData.find(h => h.numero === habJSON.numero);
    if (habitacionData) {
      return new Habitacion(
        habitacionData.numero,
        habitacionData.tipo,
        habitacionData.categoria || '',
        habitacionData.costoNoche,
        EstadoHabitacion.DISPONIBLE
      );
    }
    
    
    return new Habitacion(
      habJSON.numero,
      'IND', 
      '',
      0,
      EstadoHabitacion.DISPONIBLE
    );
  });
  
  
  let estado = EstadoReserva.PENDIENTE;
  if (reservaJSON.estado === 'Confirmada') {
    estado = EstadoReserva.CONFIRMADA;
  } else if (reservaJSON.estado === 'Cancelada') {
    estado = EstadoReserva.CANCELADA;
  }
  
  
  const reserva = new Reserva(
    id,
    reservaJSON.fechaInicio || reservaJSON.desde, 
    reservaJSON.fechaFin || reservaJSON.hasta,   
    titular,
    estado
  );
  
  reserva.habitaciones = habitaciones.length > 0 ? habitaciones : [];
  
  return reserva;
}


export function convertirHuespedJSONADominio(huespedJSON) {
  
  const direccionOrigen = huespedJSON.direccion || {};
  
  const direccion = new Direccion(
    direccionOrigen.calle || huespedJSON.calle || '',
    direccionOrigen.numero || huespedJSON.numeroCalle || '',
    direccionOrigen.piso || huespedJSON.piso || '',
    direccionOrigen.departamento || huespedJSON.departamento || '',
    direccionOrigen.ciudad || direccionOrigen.localidad || huespedJSON.localidad || '',
    direccionOrigen.provincia || huespedJSON.provincia || '',
    direccionOrigen.codigoPostal || huespedJSON.codigoPostal || '',
    direccionOrigen.pais || huespedJSON.pais || ''
  );
  
  
  const numeroDocumento = huespedJSON.numeroDocumento || huespedJSON.nroDocumento || '';
  
  const huesped = new Huesped(
    huespedJSON.nombre || huespedJSON.nombre || '',
    huespedJSON.apellido || '',
    huespedJSON.tipoDocumento || '',
    numeroDocumento,
    huespedJSON.fechaNacimiento || '2000-01-01',
    huespedJSON.ocupacion || '',
    huespedJSON.nacionalidad || '',
    huespedJSON.cuit || '',
    huespedJSON.email || '',
    direccion,
    null 
  );
  
  
  if (huespedJSON.telefono) {
    huesped.telefono = huespedJSON.telefono;
  } else if (huespedJSON.caracteristica || huespedJSON.telefonoNumero) {
    const prefijo = huespedJSON.caracteristica || '';
    const numero = huespedJSON.telefonoNumero || '';
    huesped.telefono = prefijo && numero ? `${prefijo}-${numero}` : (prefijo || numero || '');
  }
  
  return huesped;
}



export function buscarReservasParaHabitaciones(habitacionesSeleccionadas, reservasJSON) {
  const reservasCoincidentes = [];
  
  habitacionesSeleccionadas.forEach(seleccion => {
    
    const numeroHabitacion = obtenerNumeroDesdeNombre(seleccion.habitacion);
    if (!numeroHabitacion) return;
    
    
    const reservasEncontradas = reservasJSON.filter(reserva => {
      
      const habitacionesReserva = reserva.habitaciones || [];
      const tieneHabitacion = habitacionesReserva.some(hab => hab.numero === numeroHabitacion);
      
      if (!tieneHabitacion) {
        return false;
      }
      
      
      const reservaDesde = reserva.fechaInicio || reserva.desde; 
      const reservaHasta = reserva.fechaFin || reserva.hasta;     
      const seleccionDesde = seleccion.fechaDesde;
      const seleccionHasta = seleccion.fechaHasta;
      
      
      
      
      
      return (
        (compararFechas(reservaDesde, seleccionDesde) >= 0 && compararFechas(reservaDesde, seleccionHasta) <= 0) ||
        (compararFechas(reservaHasta, seleccionDesde) >= 0 && compararFechas(reservaHasta, seleccionHasta) <= 0) ||
        (compararFechas(reservaDesde, seleccionDesde) <= 0 && compararFechas(reservaHasta, seleccionHasta) >= 0)
      );
    });
    
    reservasCoincidentes.push(...reservasEncontradas);
  });
  
  
  const reservasUnicas = [];
  const idsVistos = new Set();
  
  reservasCoincidentes.forEach(reserva => {
    const id = reserva.id || `${reserva.numeroHabitacion || ''}-${reserva.fechaInicio || reserva.desde || ''}-${reserva.fechaFin || reserva.hasta || ''}`;
    if (!idsVistos.has(id)) {
      idsVistos.add(id);
      reservasUnicas.push(reserva);
    }
  });
  
  return reservasUnicas;
}

