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
 * @param {Object} reservaJSON - Objeto reserva del JSON
 * @param {number} idReserva - ID de la reserva (se genera si no existe en el JSON)
 * @param {Array} habitacionesData - Array de habitaciones cargadas desde el JSON
 * @returns {Reserva} - Objeto Reserva de dominio
 */
export function convertirReservaJSONADominio(reservaJSON, idReserva, habitacionesData = []) {
  // Crear el titular como Persona básica
  const nombreCompleto = reservaJSON.responsable || '';
  const partesNombre = nombreCompleto.split(',').map(s => s.trim());
  const apellido = partesNombre[0] || '';
  const nombre = partesNombre[1] || '';
  
  const titular = new Persona(nombre, apellido, reservaJSON.telefono || '');
  
  // Buscar la habitación en los datos cargados
  let habitacion = null;
  if (habitacionesData && habitacionesData.length > 0) {
    const habitacionData = habitacionesData.find(h => h.numero === reservaJSON.numeroHabitacion);
    if (habitacionData) {
      habitacion = new Habitacion(
        habitacionData.numero,
        habitacionData.tipo,
        habitacionData.categoria || '',
        habitacionData.costoNoche,
        EstadoHabitacion.DISPONIBLE
      );
    }
  }
  
  // Si no se encontró la habitación, crear una básica
  if (!habitacion) {
    habitacion = new Habitacion(
      reservaJSON.numeroHabitacion,
      'IND', // Tipo por defecto
      '',
      0,
      EstadoHabitacion.DISPONIBLE
    );
  }
  
  // Crear la reserva
  const reserva = new Reserva(
    idReserva,
    reservaJSON.desde,
    reservaJSON.hasta,
    titular,
    EstadoReserva.PENDIENTE
  );
  
  reserva.habitaciones = [habitacion];
  
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
 * @param {Array} reservasJSON - Array de reservas del JSON
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
      if (reserva.numeroHabitacion !== numeroHabitacion) {
        return false;
      }
      
      // Verificar si las fechas se solapan
      const reservaDesde = reserva.desde;
      const reservaHasta = reserva.hasta;
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
  
  // Eliminar duplicados (mismo numeroHabitacion, desde, hasta)
  const reservasUnicas = [];
  const claves = new Set();
  
  reservasCoincidentes.forEach(reserva => {
    const clave = `${reserva.numeroHabitacion}-${reserva.desde}-${reserva.hasta}`;
    if (!claves.has(clave)) {
      claves.add(clave);
      reservasUnicas.push(reserva);
    }
  });
  
  return reservasUnicas;
}

