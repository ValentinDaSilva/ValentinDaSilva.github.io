/* 
 * Funciones para convertir datos JSON a objetos de dominio
 */

import { 
  Reserva, 
  Persona, 
  Huesped, 
  Habitacion,
  Direccion,
  EstadoReserva,
  EstadoHabitacion
} from "../../Clases/Dominio/dominio.js";

/**
 * Obtiene el número de habitación desde el formato TIPO-NUMERO
 * @param {string} nombreHabitacion - Nombre en formato TIPO-NUMERO (ej: IND-101)
 * @returns {number|null} - Número de habitación o null si no se puede parsear
 */
function obtenerNumeroDesdeNombre(nombreHabitacion) {
  const partes = nombreHabitacion.split('-');
  if (partes.length === 2) {
    const numero = parseInt(partes[1], 10);
    return isNaN(numero) ? null : numero;
  }
  return null;
}

/**
 * Compara dos fechas en formato YYYY-MM-DD
 * @param {string} fecha1 - Primera fecha en formato YYYY-MM-DD
 * @param {string} fecha2 - Segunda fecha en formato YYYY-MM-DD
 * @returns {number} - Negativo si fecha1 < fecha2, 0 si son iguales, positivo si fecha1 > fecha2
 */
function compararFechas(fecha1, fecha2) {
  const partes1 = fecha1.split('-').map(Number);
  const partes2 = fecha2.split('-').map(Number);
  
  if (partes1[0] !== partes2[0]) return partes1[0] - partes2[0];
  if (partes1[1] !== partes2[1]) return partes1[1] - partes2[1];
  return partes1[2] - partes2[2];
}

/**
 * Convierte una reserva del JSON a un objeto Reserva de dominio
 * @param {Object} reservaJSON - Objeto reserva del JSON (nuevo formato)
 * @param {number} idReserva - ID de la reserva (se usa el del JSON si existe)
 * @param {Array} habitacionesData - Array de habitaciones cargadas desde el JSON (opcional, ya vienen en reservaJSON)
 * @returns {Reserva} - Objeto Reserva de dominio
 */
export function convertirReservaJSONADominio(reservaJSON, idReserva, habitacionesData = []) {
  // Usar el ID del JSON si existe, sino el proporcionado
  const id = reservaJSON.id || idReserva;
  
  // Crear el titular como Persona básica (nuevo formato)
  const titular = new Persona(
    reservaJSON.titular?.nombre || '',
    reservaJSON.titular?.apellido || '',
    reservaJSON.titular?.telefono || ''
  );
  
  // Convertir las habitaciones del nuevo formato
  const habitaciones = (reservaJSON.habitaciones || []).map(habJSON => {
    // Si ya tenemos los datos completos en el JSON, usarlos
    if (habJSON.tipo && habJSON.costoPorNoche !== undefined) {
      return new Habitacion(
        habJSON.numero,
        habJSON.tipo,
        habJSON.categoria || '',
        habJSON.costoPorNoche,
        habJSON.estadoHabitacion === 'Disponible' ? EstadoHabitacion.DISPONIBLE : EstadoHabitacion.OCUPADA
      );
    }
    
    // Si no, buscar en habitacionesData
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
    
    // Si no se encontró, crear una básica
    return new Habitacion(
      habJSON.numero,
      'IND', // Tipo por defecto
      '',
      0,
      EstadoHabitacion.DISPONIBLE
    );
  });
  
  // Convertir estado
  let estado = EstadoReserva.PENDIENTE;
  if (reservaJSON.estado === 'Confirmada') {
    estado = EstadoReserva.CONFIRMADA;
  } else if (reservaJSON.estado === 'Cancelada') {
    estado = EstadoReserva.CANCELADA;
  }
  
  // Crear la reserva
  const reserva = new Reserva(
    id,
    reservaJSON.fechaInicio || reservaJSON.desde, // Compatibilidad con formato antiguo
    reservaJSON.fechaFin || reservaJSON.hasta,   // Compatibilidad con formato antiguo
    titular,
    estado
  );
  
  reserva.habitaciones = habitaciones.length > 0 ? habitaciones : [];
  
  return reserva;
}

/**
 * Convierte un huésped del JSON a un objeto Huesped de dominio
 * @param {Object} huespedJSON - Objeto huésped del JSON
 * @returns {Huesped} - Objeto Huesped de dominio
 */
export function convertirHuespedJSONADominio(huespedJSON) {
  // Combinar caracteristica y telefonoNumero para crear el teléfono completo
  // Usar formato "caracteristica-telefonoNumero" para poder separarlo después si es necesario
  const caracteristica = huespedJSON.caracteristica || '';
  const telefonoNumero = huespedJSON.telefonoNumero || '';
  const telefono = caracteristica && telefonoNumero 
    ? `${caracteristica}-${telefonoNumero}` 
    : (caracteristica || telefonoNumero || '');
  
  // Crear la dirección
  const direccion = new Direccion(
    huespedJSON.calle || '',
    huespedJSON.numeroCalle || '',
    huespedJSON.piso || '',
    huespedJSON.departamento || '',
    huespedJSON.localidad || '',
    huespedJSON.provincia || '',
    huespedJSON.codigoPostal || '',
    huespedJSON.pais || ''
  );
  
  // Crear el huésped
  const huesped = new Huesped(
    huespedJSON.nombres || '',
    huespedJSON.apellido || '',
    huespedJSON.tipoDocumento || '',
    huespedJSON.numeroDocumento || '',
    huespedJSON.fechaNacimiento || '2000-01-01',
    huespedJSON.ocupacion || '',
    huespedJSON.nacionalidad || '',
    huespedJSON.cuit || '',
    huespedJSON.email || '',
    direccion,
    huespedJSON.condicionIVA || null // condicionIVA - puede venir en el JSON
  );
  
  // Asignar el teléfono
  huesped.telefono = telefono;
  
  return huesped;
}


/**
 * Busca reservas que coincidan con las habitaciones seleccionadas
 * @param {Array} habitacionesSeleccionadas - Array de objetos { habitacion: string, fechaDesde: string, fechaHasta: string }
 * @param {Array} reservasJSON - Array de reservas del JSON (nuevo formato)
 * @returns {Array} - Array de reservas que coinciden
 */
export function buscarReservasParaHabitaciones(habitacionesSeleccionadas, reservasJSON) {
  const reservasCoincidentes = [];
  
  habitacionesSeleccionadas.forEach(seleccion => {
    // Obtener el número de habitación desde el formato "TIPO-NUMERO"
    const numeroHabitacion = obtenerNumeroDesdeNombre(seleccion.habitacion);
    if (!numeroHabitacion) return;
    
    // Buscar reservas que coincidan con esta habitación y fechas
    const reservasEncontradas = reservasJSON.filter(reserva => {
      // Verificar si alguna habitación de la reserva coincide
      const habitacionesReserva = reserva.habitaciones || [];
      const tieneHabitacion = habitacionesReserva.some(hab => hab.numero === numeroHabitacion);
      
      if (!tieneHabitacion) {
        return false;
      }
      
      // Verificar si las fechas se solapan (nuevo formato usa fechaInicio/fechaFin)
      const reservaDesde = reserva.fechaInicio || reserva.desde; // Compatibilidad con formato antiguo
      const reservaHasta = reserva.fechaFin || reserva.hasta;     // Compatibilidad con formato antiguo
      const seleccionDesde = seleccion.fechaDesde;
      const seleccionHasta = seleccion.fechaHasta;
      
      // Las fechas se solapan si:
      // - La fecha desde de la reserva está dentro del rango seleccionado, o
      // - La fecha hasta de la reserva está dentro del rango seleccionado, o
      // - El rango de la reserva contiene completamente el rango seleccionado
      return (
        (compararFechas(reservaDesde, seleccionDesde) >= 0 && compararFechas(reservaDesde, seleccionHasta) <= 0) ||
        (compararFechas(reservaHasta, seleccionDesde) >= 0 && compararFechas(reservaHasta, seleccionHasta) <= 0) ||
        (compararFechas(reservaDesde, seleccionDesde) <= 0 && compararFechas(reservaHasta, seleccionHasta) >= 0)
      );
    });
    
    reservasCoincidentes.push(...reservasEncontradas);
  });
  
  // Eliminar duplicados (mismo id)
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

