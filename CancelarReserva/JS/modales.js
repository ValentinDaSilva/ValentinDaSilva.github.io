


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
  
  
  
  const reservasAEliminar = reservasSeleccionadas.map(reserva => {
    
    const reservaCompleta = JSON.parse(JSON.stringify(reserva));
    
    
    if (!reservaCompleta.titular) {
      reservaCompleta.titular = {};
    }
    
    
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
    
    
    if (!reservaCompleta.habitaciones || !Array.isArray(reservaCompleta.habitaciones)) {
      reservaCompleta.habitaciones = [];
    }
    
    
    const habitacionesCompletas = reservaCompleta.habitaciones.map(habitacion => ({
      numero: habitacion.numero || null,
      tipo: habitacion.tipo || null,
      categoria: habitacion.categoria || '',
      costoPorNoche: habitacion.costoPorNoche || null,
      estadoHabitacion: habitacion.estadoHabitacion || null
    }));
    
    
    return {
      id: reservaCompleta.id || null,
      fechaInicio: reservaCompleta.fechaInicio || reservaCompleta.desde || null,
      fechaFin: reservaCompleta.fechaFin || reservaCompleta.hasta || null,
      titular: titularCompleto,
      estado: reservaCompleta.estado || null,
      habitaciones: habitacionesCompletas
    };
  });
  
  
  
  mostrarJSONCancelacionEnPantalla(reservasAEliminar, function() {
    
    mostrarModalExito();
  });
  
  
  
  console.log('Reservas a eliminar:', reservasAEliminar);
  
  
  
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
