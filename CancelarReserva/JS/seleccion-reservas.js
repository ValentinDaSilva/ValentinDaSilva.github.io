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
    // Comparar por id para identificar únicamente (más confiable)
    // Si no hay id, comparar por fechaInicio/fechaFin y primera habitación
    const indice = reservasSeleccionadas.findIndex(r => {
      // Si ambas tienen id, comparar por id
      if (r.id && reserva.id) {
        return r.id === reserva.id;
      }
      // Si no, comparar por fechas y habitación
      const fechaInicioR = r.fechaInicio || r.desde;
      const fechaFinR = r.fechaFin || r.hasta;
      const fechaInicioReserva = reserva.fechaInicio || reserva.desde;
      const fechaFinReserva = reserva.fechaFin || reserva.hasta;
      
      const habitacionR = (r.habitaciones && r.habitaciones[0]) ? r.habitaciones[0].numero : (r.numeroHabitacion || null);
      const habitacionReserva = (reserva.habitaciones && reserva.habitaciones[0]) ? reserva.habitaciones[0].numero : (reserva.numeroHabitacion || null);
      
      return fechaInicioR === fechaInicioReserva && 
             fechaFinR === fechaFinReserva && 
             habitacionR === habitacionReserva;
    });
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
