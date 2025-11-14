/* Búsqueda de estadía por habitación y fecha */

let estadiaActual = null;

// Valores de enum EstadoEstadia (debe coincidir con Enums.js)
const EstadoEstadia = {
  EN_CURSO: "EnCurso",
  FINALIZADA: "Finalizada"
};

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
 * Busca una estadía por número de habitación que esté en curso en la fecha actual
 * @param {number} numeroHabitacion - Número de habitación a buscar
 * @returns {Promise<Object|null>} - Estadía encontrada o null si no se encuentra
 */
async function buscarEstadiaPorHabitacion(numeroHabitacion) {
  try {
    const respuesta = await fetch('../Datos/estadia.json');
    if (!respuesta.ok) {
      throw new Error('Error al cargar estadías');
    }
    
    const datos = await respuesta.json();
    const estadias = datos.estadias || [];
    const fechaActual = obtenerFechaActual();
    
    // Buscar estadía que:
    // 1. Tenga la habitación buscada
    // 2. Esté en estado EnCurso (EstadoEstadia.EN_CURSO)
    // 3. La fecha de check-in sea menor o igual a la fecha actual
    // 4. La fecha de check-out sea null o mayor o igual a la fecha actual
    const estadiaEncontrada = estadias.find(estadia => {
      const tieneHabitacion = estadia.reserva?.habitaciones?.some(
        hab => hab.numero === parseInt(numeroHabitacion)
      );
      
      const estaEnCurso = estadia.estado === EstadoEstadia.EN_CURSO;
      
      const fechaCheckInValida = estadia.fechaCheckIn && estadia.fechaCheckIn <= fechaActual;
      const fechaCheckOutValida = !estadia.fechaCheckOut || estadia.fechaCheckOut >= fechaActual;
      
      return tieneHabitacion && estaEnCurso && fechaCheckInValida && fechaCheckOutValida;
    });
    
    if (estadiaEncontrada) {
      estadiaActual = estadiaEncontrada;
      return estadiaEncontrada;
    }
    
    return null;
  } catch (error) {
    console.error('Error al buscar estadía:', error);
    throw error;
  }
}

/**
 * Obtiene la estadía actual almacenada
 * @returns {Object|null} - Estadía actual
 */
function obtenerEstadiaActual() {
  return estadiaActual;
}

/**
 * Limpia la estadía actual
 */
function limpiarEstadiaActual() {
  estadiaActual = null;
}


