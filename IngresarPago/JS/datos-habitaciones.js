/* Gestión de datos de habitaciones */

let habitaciones = [];

/**
 * Carga las habitaciones desde el archivo JSON
 * @returns {Promise<void>}
 */
export async function cargarHabitaciones() {
  try {
    const respuesta = await fetch('/Datos/habitaciones.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    habitaciones = datos.habitaciones || [];
    console.log('Habitaciones cargadas:', habitaciones.length);
  } catch (error) {
    console.error('Error al cargar habitaciones:', error);
    habitaciones = [];
  }
}

/**
 * Obtiene todas las habitaciones cargadas
 * @returns {Array} - Array de habitaciones
 */
export function obtenerHabitaciones() {
  return habitaciones;
}

/**
 * Verifica si una habitación existe
 * @param {number} numeroHabitacion - Número de habitación
 * @returns {boolean} - true si existe, false en caso contrario
 */
export function existeHabitacion(numeroHabitacion) {
  const existe = habitaciones.some(h => h.numero === numeroHabitacion);
  console.log(`Buscando habitación ${numeroHabitacion}, habitaciones cargadas: ${habitaciones.length}, existe: ${existe}`);
  return existe;
}

/**
 * Obtiene una habitación por su número
 * @param {number} numeroHabitacion - Número de habitación
 * @returns {Object|null} - Habitación encontrada o null
 */
export function obtenerHabitacionPorNumero(numeroHabitacion) {
  return habitaciones.find(h => h.numero === numeroHabitacion) || null;
}

// Cargar habitaciones al inicializar el módulo
cargarHabitaciones();

