/* Búsqueda de estadía por habitación y fecha */

let estadiaActual = null;

// Valores de enum EstadoEstadia (debe coincidir con Enums.js)
const EstadoEstadia = {
  EN_CURSO: "EnCurso",
  FINALIZADA: "Finalizada"
};

/**
 * Compara dos fechas en formato YYYY-MM-DD
 * @param {string} fecha1 - Primera fecha en formato YYYY-MM-DD
 * @param {string} fecha2 - Segunda fecha en formato YYYY-MM-DD
 * @returns {number} - Negativo si fecha1 < fecha2, 0 si son iguales, positivo si fecha1 > fecha2
 */
function compararFechas(fecha1, fecha2) {
  if (!fecha1 || !fecha2) return 0;
  const partes1 = fecha1.split('-').map(Number);
  const partes2 = fecha2.split('-').map(Number);
  
  if (partes1[0] !== partes2[0]) return partes1[0] - partes2[0];
  if (partes1[1] !== partes2[1]) return partes1[1] - partes2[1];
  return partes1[2] - partes2[2];
}

/**
 * Normaliza el estado de estadía para comparación (case-insensitive, sin espacios)
 * @param {string} estado - Estado a normalizar
 * @returns {string} - Estado normalizado
 */
function normalizarEstado(estado) {
  if (!estado) return '';
  return estado.toUpperCase().replace(/\s+/g, '');
}

/**
 * Verifica si una estadía está en curso
 * @param {string} estado - Estado de la estadía
 * @returns {boolean} - true si está en curso
 */
function estaEnCurso(estado) {
  const estadoNormalizado = normalizarEstado(estado);
  return estadoNormalizado === 'ENCURSO' || estadoNormalizado === 'EN_CURSO' || estadoNormalizado === 'EN CURSO';
}

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
    
    console.log('Buscando estadía para habitación:', numeroHabitacion);
    console.log('Fecha actual:', fechaActual);
    console.log('Total de estadías:', estadias.length);
    
    // Buscar estadía que:
    // 1. Tenga la habitación buscada
    // 2. Esté en estado EnCurso (diferentes formatos posibles)
    // 3. La fecha de check-in sea menor o igual a la fecha actual
    // 4. La fecha de check-out sea null o mayor o igual a la fecha actual
    const estadiaEncontrada = estadias.find(estadia => {
      // Verificar si tiene la habitación buscada
      const habitaciones = estadia.reserva?.habitaciones || [];
      const tieneHabitacion = habitaciones.some(
        hab => hab.numero === parseInt(numeroHabitacion)
      );
      
      if (!tieneHabitacion) {
        return false;
      }
      
      // Verificar estado (acepta diferentes formatos: "ENCURSO", "EnCurso", "En Curso", etc.)
      const estaEnCursoEstado = estaEnCurso(estadia.estado);
      
      // Verificar fechas usando comparación correcta
      const fechaCheckInValida = estadia.fechaCheckIn && compararFechas(estadia.fechaCheckIn, fechaActual) <= 0;
      const fechaCheckOutValida = !estadia.fechaCheckOut || compararFechas(estadia.fechaCheckOut, fechaActual) >= 0;
      
      const encontrada = estaEnCursoEstado && fechaCheckInValida && fechaCheckOutValida;
      
      if (encontrada) {
        console.log('Estadía encontrada:', estadia);
      }
      
      return encontrada;
    });
    
    if (estadiaEncontrada) {
      estadiaActual = estadiaEncontrada;
      return estadiaEncontrada;
    }
    
    console.log('No se encontró estadía en curso para la habitación:', numeroHabitacion);
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


