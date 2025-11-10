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
 * Extrae el apellido del campo responsable
 * @param {string} responsable - String en formato "Apellido, Nombre"
 * @returns {string} - Apellido extraído
 */
function extraerApellido(responsable) {
  if (!responsable) return '';
  const partes = responsable.split(',');
  return partes[0] ? partes[0].trim().toUpperCase() : '';
}

/**
 * Extrae el nombre del campo responsable
 * @param {string} responsable - String en formato "Apellido, Nombre"
 * @returns {string} - Nombre extraído
 */
function extraerNombre(responsable) {
  if (!responsable) return '';
  const partes = responsable.split(',');
  return partes[1] ? partes[1].trim().toUpperCase() : '';
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
