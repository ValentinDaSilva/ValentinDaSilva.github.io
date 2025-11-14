/* Manejo de modales */

/**
 * Muestra el modal de error
 */
function mostrarModalError() {
  const modal = document.getElementById('modal-error');
  if (modal) {
    modal.style.display = 'flex';
  }
}

/**
 * Cierra el modal de error
 */
function cerrarModalError() {
  const modal = document.getElementById('modal-error');
  if (modal) {
    modal.style.display = 'none';
    const apellidoInput = document.getElementById('apellido');
    if (apellidoInput) {
      apellidoInput.focus();
    }
  }
}

/**
 * Muestra el modal de no resultados
 */
function mostrarModalNoResultados() {
  const modal = document.getElementById('modal-no-resultados');
  if (modal) {
    modal.style.display = 'flex';
  }
}

/**
 * Cierra el modal de no resultados
 */
function cerrarModalNoResultados() {
  const modal = document.getElementById('modal-no-resultados');
  if (modal) {
    modal.style.display = 'none';
    const apellidoInput = document.getElementById('apellido');
    if (apellidoInput) {
      apellidoInput.focus();
    }
  }
}

/**
 * Muestra el modal de confirmación
 */
function mostrarModalConfirmacion() {
  if (reservasSeleccionadas.length === 0) {
    alert('Por favor, seleccione al menos una reserva para cancelar.');
    return;
  }
  
  const modal = document.getElementById('modal-confirmacion');
  if (modal) {
    modal.style.display = 'flex';
  }
}

/**
 * Confirma la cancelación de reservas
 */
async function confirmarCancelacion() {
  const modalConfirmacion = document.getElementById('modal-confirmacion');
  if (modalConfirmacion) {
    modalConfirmacion.style.display = 'none';
  }
  
  // Obtener las reservas seleccionadas en formato JSON con todos los datos de Reserva
  const reservasAEliminar = reservasSeleccionadas.map(reserva => {
    // Extraer nombre y apellido del campo responsable (formato: "Apellido, Nombre")
    let nombre = '';
    let apellido = '';
    if (reserva.responsable) {
      const partes = reserva.responsable.split(',');
      apellido = partes[0] ? partes[0].trim() : '';
      nombre = partes[1] ? partes[1].trim() : '';
    }

    // Determinar tipo de habitación según el número (misma lógica que tabla-resultados.js)
    let tipoHabitacion = null;
    if (reserva.numeroHabitacion) {
      if (reserva.numeroHabitacion >= 101 && reserva.numeroHabitacion <= 115) tipoHabitacion = 'IND';
      else if (reserva.numeroHabitacion >= 201 && reserva.numeroHabitacion <= 215) tipoHabitacion = 'DOBE';
      else if (reserva.numeroHabitacion >= 302 && reserva.numeroHabitacion <= 308) tipoHabitacion = 'FAM';
      else if (reserva.numeroHabitacion >= 402 && reserva.numeroHabitacion <= 409) tipoHabitacion = 'SUITE';
    }

    // Construir el objeto titular completo
    const titularCompleto = {
      nombre: nombre,
      apellido: apellido,
      telefono: reserva.telefono || '',
      tipoDocumento: reserva.titular?.tipoDocumento || null,
      nroDocumento: reserva.titular?.nroDocumento || null,
      fechaNacimiento: reserva.titular?.fechaNacimiento || null,
      condicionIVA: reserva.titular?.condicionIVA || null,
      ocupacion: reserva.titular?.ocupacion || null,
      nacionalidad: reserva.titular?.nacionalidad || null,
      cuit: reserva.titular?.cuit || null,
      email: reserva.titular?.email || null
    };

    // Construir el array de habitaciones completo
    const habitacionesCompletas = [{
      numero: reserva.numeroHabitacion,
      tipo: reserva.habitacion?.tipo || tipoHabitacion || null,
      categoria: reserva.habitacion?.categoria || reserva.categoria || '',
      costoPorNoche: reserva.habitacion?.costoPorNoche || reserva.costoPorNoche || null,
      estadoHabitacion: reserva.habitacion?.estadoHabitacion || reserva.estadoHabitacion || null
    }];

    return {
      id: reserva.id || null,
      fechaInicio: reserva.desde,
      fechaFin: reserva.hasta,
      titular: titularCompleto,
      estado: reserva.estado || null,
      habitaciones: habitacionesCompletas,
      // Mantener campos legacy para compatibilidad
      numeroHabitacion: reserva.numeroHabitacion,
      desde: reserva.desde,
      hasta: reserva.hasta,
      responsable: reserva.responsable,
      telefono: reserva.telefono
    };
  });
  
  // Mostrar el JSON en pantalla antes de "eliminar"
  // Pasar una función callback para mostrar el modal de éxito cuando se cierre el JSON
  mostrarJSONCancelacionEnPantalla(reservasAEliminar, function() {
    // Esta función se ejecutará cuando el usuario cierre el JSON
    mostrarModalExito();
  });
  
  // Simular eliminación de reservas
  // En un caso real, aquí se actualizaría la base de datos eliminando estas reservas
  console.log('Reservas a eliminar:', reservasAEliminar);
  
  // TODO: Implementar eliminación real cuando se tenga acceso al servidor
  // Por ahora, solo se simula la eliminación
}

/**
 * Muestra el modal de éxito
 */
function mostrarModalExito() {
  const modalExito = document.getElementById('modal-exito');
  if (modalExito) {
    modalExito.style.display = 'flex';
    
    // Configurar para cerrar con cualquier tecla
    const cerrarConTecla = function(event) {
      modalExito.style.display = 'none';
      // Redirigir al menú principal
      window.location.href = '/index.html';
      document.removeEventListener('keydown', cerrarConTecla);
    };
    
    document.addEventListener('keydown', cerrarConTecla, { once: true });
  }
}

/**
 * Cancela la operación de cancelación
 */
function cancelarOperacion() {
  const modal = document.getElementById('modal-confirmacion');
  if (modal) {
    modal.style.display = 'none';
  }
  
  // Deseleccionar todas las reservas
  reservasSeleccionadas = [];
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
    const fila = checkbox.closest('tr');
    if (fila) {
      fila.classList.remove('fila-seleccionada');
    }
  });
}

/**
 * Cierra todos los modales visibles
 */
function cerrarTodosLosModales() {
  const modales = document.querySelectorAll('.modal');
  modales.forEach(modal => {
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}

/**
 * Cierra modales al hacer clic fuera de ellos
 * @param {Event} event - Evento de clic
 */
function manejarClicFueraModal(event) {
  const modales = document.querySelectorAll('.modal');
  modales.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}
