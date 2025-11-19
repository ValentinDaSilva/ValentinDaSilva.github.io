

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
    const nombres = document.getElementById('nombres').value.trim().toUpperCase();

  const todasLasReservas = obtenerReservas();

  
  reservasFiltradas = todasLasReservas.filter(reserva => {
    const apellidoReserva = extraerApellido(reserva);
    const nombresReserva = extraerNombre(reserva);
    
    const cumpleApellido = apellidoReserva.startsWith(apellido);
    const cumpleNombres = !nombres || nombresReserva.startsWith(nombres);
    
    return cumpleApellido && cumpleNombres;
  });

  mostrarResultados();
}
}


window.reservasFiltradas = reservasFiltradas;
