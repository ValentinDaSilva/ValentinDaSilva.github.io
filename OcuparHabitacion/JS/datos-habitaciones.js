/* Gestión de datos de habitaciones y reservas */

let habitaciones = [];
let reservas = [];

/**
 * Carga las habitaciones desde el archivo JSON
 * @returns {Promise<void>}
 */
async function cargarHabitaciones() {
  try {
    const respuesta = await fetch('/Datos/habitaciones.json');
    const datos = await respuesta.json();
    habitaciones = datos.habitaciones || [];
  } catch (error) {
    console.error('Error al cargar habitaciones:', error);
    mensajeError('Error al cargar los datos de habitaciones.');
    habitaciones = [];
  }
}

/**
 * Carga las reservas desde el archivo JSON
 * @returns {Promise<void>}
 */
async function cargarReservas() {
  try {
    const respuesta = await fetch('/Datos/reservas.json');
    const datos = await respuesta.json();
    reservas = datos.reservas || [];
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    mensajeError('Error al cargar los datos de reservas.');
    reservas = [];
  }
}

/**
 * Carga todos los datos necesarios
 * @returns {Promise<void>}
 */
async function cargarTodosLosDatos() {
  await Promise.all([cargarHabitaciones(), cargarReservas()]);
}

/**
 * Obtiene todas las habitaciones cargadas
 * @returns {Array} - Array de habitaciones
 */
function obtenerHabitaciones() {
  return habitaciones;
}

/**
 * Obtiene todas las reservas cargadas
 * @returns {Array} - Array de reservas
 */
function obtenerReservas() {
  return reservas;
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
 * Verifica si una habitación está reservada en una fecha específica
 * @param {number} numeroHabitacion - Número de la habitación
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean} - true si está reservada, false si no
 */
function estaHabitacionReservada(numeroHabitacion, fecha) {
  return reservas.some(reserva => {
    // Nuevo formato: verificar si la habitación está en el array de habitaciones
    const habitacionesReserva = reserva.habitaciones || [];
    const tieneHabitacion = habitacionesReserva.some(hab => hab.numero === numeroHabitacion);
    
    // Si no tiene la habitación en el nuevo formato, verificar formato antiguo
    if (!tieneHabitacion && reserva.numeroHabitacion !== numeroHabitacion) {
      return false;
    }
    
    // Comparar fechas directamente sin usar Date para evitar problemas de zona horaria
    // Nuevo formato usa fechaInicio/fechaFin, antiguo usa desde/hasta
    const fechaDesde = reserva.fechaInicio || reserva.desde; // Compatibilidad con formato antiguo
    const fechaHasta = reserva.fechaFin || reserva.hasta;   // Compatibilidad con formato antiguo
    
    // La fecha está dentro del rango de reserva (inclusive)
    return compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0;
  });
}

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
 * Formatea el número de habitación al formato TIPO-NUMERO
 * @param {Object} habitacion - Objeto habitación con tipo y numero
 * @returns {string} - Formato TIPO-NUMERO (ej: IND-101)
 */
function formatearNombreHabitacion(habitacion) {
  return `${habitacion.tipo}-${habitacion.numero}`;
}

/**
 * Genera un array de fechas desde fechaInicio hasta fechaFin
 * @param {string} fechaInicio - Fecha inicio en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha fin en formato YYYY-MM-DD
 * @returns {Array<string>} - Array de fechas en formato YYYY-MM-DD
 */
function generarArrayFechas(fechaInicio, fechaFin) {
  const fechas = [];
  
  const partesInicio = fechaInicio.split('-').map(Number);
  const partesFin = fechaFin.split('-').map(Number);
  
  const inicio = new Date(partesInicio[0], partesInicio[1] - 1, partesInicio[2]);
  const fin = new Date(partesFin[0], partesFin[1] - 1, partesFin[2]);
  
  const fechaActual = new Date(inicio);
  
  while (fechaActual <= fin) {
    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    fechas.push(`${año}-${mes}-${dia}`);
    
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  
  return fechas;
}

/**
 * Formatea una fecha para mostrar en formato DD/MM/YYYY
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} - Fecha en formato DD/MM/YYYY
 */
function formatearFechaParaMostrar(fecha) {
  const partes = fecha.split('-').map(Number);
  const dia = String(partes[2]).padStart(2, '0');
  const mes = String(partes[1]).padStart(2, '0');
  const año = partes[0];
  return `${dia}/${mes}/${año}`;
}

// Variable para rastrear si los datos ya fueron cargados
let datosCargados = false;

/**
 * Carga todos los datos si aún no se han cargado
 * @returns {Promise<void>}
 */
function asegurarDatosCargados() {
  if (datosCargados && habitaciones.length > 0) {
    return Promise.resolve();
  }
  
  return cargarTodosLosDatos().then(() => {
    datosCargados = true;
  });
}

