/* Lógica de búsqueda de reservas */

let reservasFiltradas = [];

/**
 * Busca reservas según los criterios del formulario
 */
async function buscarReservas() {
  // Asegurar que las reservas estén cargadas
  await asegurarReservasCargadas();
  
  const apellido = document.getElementById('apellido').value.trim().toUpperCase();
  const nombres = document.getElementById('nombres').value.trim().toUpperCase();

  // Validar que el apellido no esté vacío
  if (!validarFormularioBusqueda()) {
    return;
  }

  const todasLasReservas = obtenerReservas();

  // Filtrar resultados con criterio "empieza con"
  reservasFiltradas = todasLasReservas.filter(reserva => {
    const apellidoReserva = extraerApellido(reserva.responsable);
    const nombresReserva = extraerNombre(reserva.responsable);
    
    const cumpleApellido = apellidoReserva.startsWith(apellido);
    const cumpleNombres = !nombres || nombresReserva.startsWith(nombres);
    
    return cumpleApellido && cumpleNombres;
  });

  mostrarResultados();
}
