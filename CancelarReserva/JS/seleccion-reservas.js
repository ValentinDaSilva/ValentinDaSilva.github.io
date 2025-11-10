/* Manejo de la selección de reservas */

let reservasSeleccionadas = [];

/**
 * Alterna la selección de una reserva
 * @param {number} index - Índice de la reserva en el array de reservas filtradas
 */
function toggleSeleccion(index) {
  const checkbox = document.getElementById(`check_${index}`);
  const reserva = reservasFiltradas[index];
  
  if (!checkbox || !reserva) {
    return;
  }

  const fila = checkbox.closest('tr');
  
  if (checkbox.checked) {
    // Agregar la reserva completa al array de seleccionadas
    reservasSeleccionadas.push(reserva);
    if (fila) {
      fila.classList.add('fila-seleccionada');
    }
  } else {
    // Buscar y eliminar la reserva del array
    // Comparar por numeroHabitacion, desde y hasta para identificar únicamente
    const indice = reservasSeleccionadas.findIndex(r => 
      r.numeroHabitacion === reserva.numeroHabitacion && 
      r.desde === reserva.desde &&
      r.hasta === reserva.hasta
    );
    if (indice !== -1) {
      reservasSeleccionadas.splice(indice, 1);
    }
    if (fila) {
      fila.classList.remove('fila-seleccionada');
    }
  }
}

/**
 * Obtiene las reservas seleccionadas
 * @returns {Array} - Array de reservas seleccionadas
 */
function obtenerReservasSeleccionadas() {
  return reservasSeleccionadas;
}
