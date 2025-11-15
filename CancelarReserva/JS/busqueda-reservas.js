

let reservasFiltradas = [];


async function buscarReservas() {
  
  await asegurarReservasCargadas();
  
  const apellido = document.getElementById('apellido').value.trim().toUpperCase();
  const nombres = document.getElementById('nombres').value.trim().toUpperCase();

  
  if (!validarFormularioBusqueda()) {
    return;
  }

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
