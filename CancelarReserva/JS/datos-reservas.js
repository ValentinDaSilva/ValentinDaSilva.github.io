/* Gestión de datos de reservas desde reservas.json */

let reservas = [];

/**
 * Carga las reservas desde el archivo JSON
 * @returns {Promise<void>}
 */
async function cargarReservas() {
  try {
    const respuesta = await fetch('/Datos/reservas.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    reservas = datos.reservas || [];
    console.log('Reservas cargadas:', reservas.length);
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    // Mostrar error en consola, el modal se manejará desde otros módulos
    reservas = [];
  }
}

/**
 * Obtiene todas las reservas cargadas
 * @returns {Array} - Array de reservas
 */
function obtenerReservas() {
  return reservas;
}

/**
 * Extrae el apellido del titular (nuevo formato) o del campo responsable (formato antiguo)
 * @param {Object|string} reserva - Objeto reserva con titular o string responsable
 * @returns {string} - Apellido extraído
 */
function extraerApellido(reserva) {
  if (!reserva) return '';
  // Nuevo formato: reserva.titular.apellido
  if (typeof reserva === 'object' && reserva.titular && reserva.titular.apellido) {
    return reserva.titular.apellido.toUpperCase();
  }
  // Formato antiguo: reserva.responsable (string "Apellido, Nombre")
  if (typeof reserva === 'string') {
    const partes = reserva.split(',');
    return partes[0] ? partes[0].trim().toUpperCase() : '';
  }
  // Compatibilidad: si viene como objeto con responsable
  if (typeof reserva === 'object' && reserva.responsable) {
    const partes = reserva.responsable.split(',');
    return partes[0] ? partes[0].trim().toUpperCase() : '';
  }
  return '';
}

/**
 * Extrae el nombre del titular (nuevo formato) o del campo responsable (formato antiguo)
 * @param {Object|string} reserva - Objeto reserva con titular o string responsable
 * @returns {string} - Nombre extraído
 */
function extraerNombre(reserva) {
  if (!reserva) return '';
  // Nuevo formato: reserva.titular.nombre
  if (typeof reserva === 'object' && reserva.titular && reserva.titular.nombre) {
    return reserva.titular.nombre.toUpperCase();
  }
  // Formato antiguo: reserva.responsable (string "Apellido, Nombre")
  if (typeof reserva === 'string') {
    const partes = reserva.split(',');
    return partes[1] ? partes[1].trim().toUpperCase() : '';
  }
  // Compatibilidad: si viene como objeto con responsable
  if (typeof reserva === 'object' && reserva.responsable) {
    const partes = reserva.responsable.split(',');
    return partes[1] ? partes[1].trim().toUpperCase() : '';
  }
  return '';
}

/**
 * Asegura que las reservas estén cargadas
 * @returns {Promise<void>}
 */
async function asegurarReservasCargadas() {
  if (reservas.length === 0) {
    await cargarReservas();
  }
}

// Cargar reservas al inicializar el módulo
cargarReservas();
