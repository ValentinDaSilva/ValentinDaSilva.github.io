/* Validaciones de formulario */

/**
 * Valida el formulario de factura y busca la estadía
 * @returns {Promise<boolean>} - true si el formulario es válido y se encontró la estadía, false en caso contrario
 */
async function validarFormularioFactura() {
  const habitacion = document.getElementById("habitacion").value.trim();
  const horaSalida = document.getElementById("horaSalida").value.trim();

  if (!habitacion || !horaSalida) {
    mensajeError("Por favor, completa todos los campos requeridos.");
    
    if (!habitacion) {
      document.getElementById("habitacion").style.border = "2px solid red";
    } else {
      document.getElementById("habitacion").style.border = "";
    }
    
    if (!horaSalida) {
      document.getElementById("horaSalida").style.border = "2px solid red";
    } else {
      document.getElementById("horaSalida").style.border = "";
    }
    
    return false;
  }
  
  document.getElementById("habitacion").style.border = "";
  document.getElementById("horaSalida").style.border = "";
  
  // Buscar estadía
  try {
    const estadia = await buscarEstadiaPorHabitacion(habitacion);
    if (!estadia) {
      mensajeError(`No se encontró una estadía en curso para la habitación ${habitacion} en la fecha actual.`);
      return false;
    }
    
    // Cargar huéspedes en la tabla
    const huespedes = obtenerHuespedesDeEstadia(estadia);
    if (huespedes.length === 0) {
      mensajeError("No se encontraron huéspedes en la estadía.");
      return false;
    }
    
    cargarHuespedesEnTabla(huespedes);
    return true;
  } catch (error) {
    console.error('Error al buscar estadía:', error);
    mensajeError("Error al buscar la estadía. Por favor, intente nuevamente.");
    return false;
  }
}

