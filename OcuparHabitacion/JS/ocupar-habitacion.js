/* Gestión del flujo principal de ocupar habitación */

/**
 * Maneja el evento de clic en el botón de ocupar
 */
function manejarClickOcupar() {
  const botonOcupar = document.querySelector('.boton-ocupar');
  if (!botonOcupar) {
    console.error('Botón de ocupar no encontrado');
    return;
  }

  botonOcupar.addEventListener('click', function() {
    const habitacionesSeleccionadas = obtenerHabitacionesSeleccionadas();
    
    if (habitacionesSeleccionadas.length === 0) {
      mensajeError("Por favor, seleccione al menos una habitación.");
      return;
    }

    // Ocultar el contenedor de resultados y mostrar el formulario de búsqueda de huésped
    const resultadoDiv = document.querySelector('.resultado, .contenedor-resultados');
    if (resultadoDiv) {
      resultadoDiv.style.display = 'none';
    }
    const container = document.querySelector('.container');
    if (container) {
      container.style.display = 'block';
      // Animar desde abajo del viewport hacia arriba
      setTimeout(() => {
        container.style.top = '50px';
      }, 10);
    }
    const bookingForm = document.querySelector('.booking-form, .formulario-busqueda');
    if (bookingForm) {
      bookingForm.style.display = 'none';
    }
  });
}

/**
 * Maneja el evento de envío del formulario de búsqueda
 */
function manejarBusqueda() {
  const formulario = document.querySelector('form');
  if (!formulario) {
    console.error('Formulario no encontrado');
    return;
  }

  formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    if (!validarFormularioBusqueda()) {
      return;
    }

    const fechaDesde = document.getElementById('checkin').value;
    const fechaHasta = document.getElementById('checkout').value;

    // Limpiar selecciones anteriores y resetear filtro
    limpiarHabitacionesSeleccionadas();
    const selectFiltro = document.getElementById('filtro-tipo-habitacion');
    if (selectFiltro) {
      selectFiltro.value = '';
    }
    
    // Asegurar que los datos estén cargados antes de generar la tabla
    asegurarDatosCargados().then(() => {
      // Resetear el tipo de filtro antes de generar
      if (typeof establecerTipoFiltro === 'function') {
        establecerTipoFiltro('');
      }
      generarTablaHabitaciones(fechaDesde, fechaHasta);
      
      const background = document.querySelector('.background, .fondo-reserva');
      if (background) {
        background.classList.add('opaco');
      }
      const resultadoDiv = document.querySelector('.resultado, .contenedor-resultados');
      if (resultadoDiv) {
        resultadoDiv.style.display = 'block';
      }
    }).catch(error => {
      console.error('Error al generar tabla:', error);
      mensajeError('Error al generar la tabla de habitaciones.');
    });
  });
}

/**
 * Inicializa el flujo de ocupar habitación
 */
function inicializarOcuparHabitacion() {
  manejarBusqueda();
  manejarClickOcupar();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarOcuparHabitacion);
} else {
  inicializarOcuparHabitacion();
}

