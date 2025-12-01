

let reservasSeleccionadas = [];


function toggleSeleccion(index) {
  const checkbox = document.getElementById(`check_${index}`);
  const reservas = window.reservasFiltradas || reservasFiltradas || [];
  const reserva = reservas[index];
  
  if (!checkbox || !reserva) {
    return;
  }

  const fila = checkbox.closest('tr');
  
  if (checkbox.checked) {
    
    reservasSeleccionadas.push(reserva);
    if (fila) {
      fila.classList.add('fila-seleccionada');
    }
  } else {
    
    
    
    const indice = reservasSeleccionadas.findIndex(r => {
      
      if (r.id && reserva.id) {
        return r.id === reserva.id;
      }
      
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


function obtenerReservasSeleccionadas() {
  return reservasSeleccionadas;
}
