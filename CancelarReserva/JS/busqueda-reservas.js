

let reservasFiltradas = [];


async function buscarReservas() {
  
  if (!validarFormularioBusqueda()) {
    return;
  }

  
  if (window.gestorReserva) {
    reservasFiltradas = await window.gestorReserva.buscarReservasParaCancelar();
    window.reservasFiltradas = reservasFiltradas;
  } else if (window.gestorCancelarReserva) {
    await window.gestorCancelarReserva.buscarReservas();
    reservasFiltradas = window.reservasFiltradas || [];
  } else {
    
    await asegurarReservasCargadas();
    
    const apellido = document.getElementById('apellido').value.trim().toUpperCase();
    const nombre = document.getElementById('nombre').value.trim().toUpperCase();

  const todasLasReservas = obtenerReservas();

  
  reservasFiltradas = todasLasReservas.filter(reserva => {
    const apellidoReserva = extraerApellido(reserva);
    const nombreReserva = extraerNombre(reserva);
    
    const cumpleApellido = apellidoReserva.startsWith(apellido);
    const cumplenombre = !nombre || nombreReserva.startsWith(nombre);
    
    return cumpleApellido && cumplenombre;
  });

  mostrarResultados();
}
}


window.reservasFiltradas = reservasFiltradas;
