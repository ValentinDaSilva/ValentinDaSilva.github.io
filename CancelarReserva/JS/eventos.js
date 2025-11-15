


function inicializarEventos() {
  
  const inputs = document.querySelectorAll('input[type="text"]');
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      convertirAMayusculas(this);
    });
  });

  
  const formularioBusqueda = document.getElementById('formulario-busqueda');
  if (formularioBusqueda) {
    formularioBusqueda.addEventListener('submit', function(event) {
      event.preventDefault();
      buscarReservas();
    });
  }

  
  const botonContinuar = document.getElementById('boton-continuar');
  if (botonContinuar) {
    botonContinuar.addEventListener('click', function() {
      
      if (reservasSeleccionadas && reservasSeleccionadas.length > 0) {
        mostrarModalConfirmacion();
      } else {
        
        alert('Por favor, seleccione al menos una reserva para cancelar.');
      }
    });
  }

  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const elementoActivo = document.activeElement;
      if (elementoActivo.tagName === 'BUTTON' && !elementoActivo.disabled) {
        elementoActivo.click();
      }
    }
  });

  
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

  
  window.addEventListener('click', manejarClicFueraModal);

  
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      cerrarTodosLosModales();
    }
  });
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}

