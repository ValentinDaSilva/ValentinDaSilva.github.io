/* Manejo de eventos */

/**
 * Inicializa todos los event listeners
 */
function inicializarEventos() {
  // Configurar conversión automática a mayúsculas
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      convertirAMayusculas(this);
    });
  });

  // Configurar formulario de búsqueda
  const formularioBusqueda = document.getElementById('formulario-busqueda');
  if (formularioBusqueda) {
    formularioBusqueda.addEventListener('submit', function(event) {
      event.preventDefault();
      buscarReservas();
    });
  }

  // Configurar botón continuar
  const botonContinuar = document.getElementById('boton-continuar');
  if (botonContinuar) {
    botonContinuar.addEventListener('click', function() {
      // Verificar si hay reservas seleccionadas
      if (reservasSeleccionadas && reservasSeleccionadas.length > 0) {
        mostrarModalConfirmacion();
      } else {
        // Si no hay reservas seleccionadas, mostrar mensaje
        alert('Por favor, seleccione al menos una reserva para cancelar.');
      }
    });
  }

  // Configurar Enter para botones
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const elementoActivo = document.activeElement;
      if (elementoActivo.tagName === 'BUTTON' && !elementoActivo.disabled) {
        elementoActivo.click();
      }
    }
  });

  // Configurar Shift+Tab para retroceder campos
  document.addEventListener('keydown', function(event) {
    if (event.shiftKey && event.key === 'Tab') {
      event.preventDefault();
      const inputs = document.querySelectorAll('input');
      const elementoActivo = document.activeElement;
      let indiceActual = -1;
      
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === elementoActivo) {
          indiceActual = i;
          break;
        }
      }
      
      if (indiceActual > 0) {
        inputs[indiceActual - 1].focus();
      } else {
        inputs[inputs.length - 1].focus();
      }
    }
  });

  // Cerrar modales al hacer clic fuera de ellos
  window.addEventListener('click', manejarClicFueraModal);

  // Cerrar modales con la tecla Escape
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      cerrarTodosLosModales();
    }
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}

