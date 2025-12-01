


function mostrarModalError() {
  const modal = document.getElementById('modal-error');
  if (modal) {
    modal.style.display = 'flex';
  }
}


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


function mostrarModalNoResultados() {
  const modal = document.getElementById('modal-no-resultados');
  if (modal) {
    modal.style.display = 'flex';
  }
}


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


async function confirmarCancelacion() {
  const modalConfirmacion = document.getElementById('modal-confirmacion');
  if (modalConfirmacion) {
    modalConfirmacion.style.display = 'none';
  }
  
  if (!reservasSeleccionadas || reservasSeleccionadas.length === 0) {
    mensajeError("No se han seleccionado reservas para cancelar.");
    return;
  }
  
  try {
    if (window.gestorReserva) {
      const exito = await window.gestorReserva.cancelarReservas(reservasSeleccionadas);
      
      if (exito) {
        if (typeof mostrarModalExito === 'function') {
          mostrarModalExito();
        }
      }
    } else {
      mensajeError("Error: El gestor de reservas no está disponible.");
    }
  } catch (error) {
    console.error('Error al cancelar reservas:', error);
    mensajeError("Error al cancelar las reservas. Por favor, intente nuevamente.");
  }
}


function mostrarModalExito() {
  const modalExito = document.getElementById('modal-exito');
  if (modalExito) {
    modalExito.style.display = 'flex';
    
    
    const cerrarConTecla = function(event) {
      modalExito.style.display = 'none';
      
      window.location.href = '/index.html';
      document.removeEventListener('keydown', cerrarConTecla);
    };
    
    document.addEventListener('keydown', cerrarConTecla, { once: true });
  }
}


function cancelarOperacion() {
  const modal = document.getElementById('modal-confirmacion');
  if (modal) {
    modal.style.display = 'none';
  }
  
  
  reservasSeleccionadas = [];
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
    const fila = checkbox.closest('tr');
    if (fila) {
      fila.classList.remove('fila-seleccionada');
    }
  });
}


function cerrarTodosLosModales() {
  const modales = document.querySelectorAll('.modal');
  modales.forEach(modal => {
    if (modal.style.display === 'flex') {
      modal.style.display = 'none';
    }
  });
}


function manejarClicFueraModal(event) {
  const modales = document.querySelectorAll('.modal');
  modales.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}
