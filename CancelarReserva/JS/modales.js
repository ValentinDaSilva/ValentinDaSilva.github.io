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
  // Usar directamente la estructura de la reserva tal como está en el JSON
  const reservasAEliminar = reservasSeleccionadas.map(reserva => {
    // Crear una copia profunda de la reserva para no modificar la original
    const reservaCompleta = JSON.parse(JSON.stringify(reserva));
    
    // Asegurar que el titular tenga todos los campos necesarios (incluso si son null)
    if (!reservaCompleta.titular) {
      reservaCompleta.titular = {};
    }
    
    // Asegurar que todos los campos del titular estén presentes
    const titularCompleto = {
      nombre: reservaCompleta.titular.nombre || '',
      apellido: reservaCompleta.titular.apellido || '',
      telefono: reservaCompleta.titular.telefono || '',
      tipoDocumento: reservaCompleta.titular.tipoDocumento || null,
      nroDocumento: reservaCompleta.titular.nroDocumento || null,
      fechaNacimiento: reservaCompleta.titular.fechaNacimiento || null,
      condicionIVA: reservaCompleta.titular.condicionIVA || null,
      ocupacion: reservaCompleta.titular.ocupacion || null,
      nacionalidad: reservaCompleta.titular.nacionalidad || null,
      cuit: reservaCompleta.titular.cuit || null,
      email: reservaCompleta.titular.email || null
    };
    
    // Asegurar que habitaciones sea un array y tenga todos los campos necesarios
    if (!reservaCompleta.habitaciones || !Array.isArray(reservaCompleta.habitaciones)) {
      reservaCompleta.habitaciones = [];
    }
    
    // Asegurar que cada habitación tenga todos los campos
    const habitacionesCompletas = reservaCompleta.habitaciones.map(habitacion => ({
      numero: habitacion.numero || null,
      tipo: habitacion.tipo || null,
      categoria: habitacion.categoria || '',
      costoPorNoche: habitacion.costoPorNoche || null,
      estadoHabitacion: habitacion.estadoHabitacion || null
    }));
    
    // Retornar la reserva con la estructura completa
    return {
      id: reservaCompleta.id || null,
      fechaInicio: reservaCompleta.fechaInicio || reservaCompleta.desde || null,
      fechaFin: reservaCompleta.fechaFin || reservaCompleta.hasta || null,
      titular: titularCompleto,
      estado: reservaCompleta.estado || null,
      habitaciones: habitacionesCompletas
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
