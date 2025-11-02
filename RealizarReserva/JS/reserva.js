/* Gestión del flujo principal de reserva */

/**
 * Crea el formulario de datos del huésped
 * @param {HTMLElement} contenedor - Contenedor donde se insertará el formulario
 * @param {string} desdeFecha - Fecha de entrada
 * @param {string} hastaFecha - Fecha de salida
 * @param {string[]} habitaciones - Array de habitaciones seleccionadas
 */
function crearFormularioDatosHuesped(contenedor, desdeFecha, hastaFecha, habitaciones) {
  const fechaSeleccionada1 = new Date(desdeFecha);
  const fechaSeleccionada2 = new Date(hastaFecha);
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const diaSemanaInput1 = dias[fechaSeleccionada1.getDay()];
  const diaSemanaInput2 = dias[fechaSeleccionada2.getDay()];

  contenedor.innerHTML = '';
  contenedor.style.display = 'flex';
  contenedor.style.flexDirection = 'column';
  contenedor.style.alignItems = 'center';

  const nuevoTitulo = document.createElement('h2');
  nuevoTitulo.textContent = "Datos del huésped";
  contenedor.appendChild(nuevoTitulo);

  const formularioHuesped = document.createElement('form');
  formularioHuesped.className = 'formulario-datos-huesped';
  formularioHuesped.style.width = '100%';
  formularioHuesped.innerHTML = `
    <div class="contenedor-campo-huesped">
      <label class="etiqueta-campo requerido" for="nombre">Nombre:</label>
      <input type="text" id="nombre" name="nombre" required class="campo-huesped">
      
      <label class="etiqueta-campo requerido" for="apellido">Apellido:</label>
      <input type="text" id="apellido" name="apellido" required class="campo-huesped">
      
      <label class="etiqueta-campo requerido" for="telefono">Teléfono:</label>
      <input type="tel" id="telefono" name="telefono" required class="campo-huesped">
    </div>
  `;

  const confirmarButton = document.createElement('button');
  confirmarButton.type = "submit";
  confirmarButton.textContent = "Enviar";
  confirmarButton.className = "boton-confirmar";
  confirmarButton.addEventListener('click', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const inputs = [
      document.getElementById('nombre'),
      document.getElementById('apellido'),
      document.getElementById('telefono')
    ];

    inputs.forEach(input => {
      if (!input.value) {
        input.style.border = '2px solid red';
      } else {
        input.style.border = '1px solid #ccc';
      }
    });

    if (inputs.some(input => !input.value)) {
      mensajeError("Por favor, complete todos los campos requeridos.");
      return;
    }

    mensajeCorrecto(`Reserva realizada con éxito para <br>"${nombre} ${apellido}".<br>Presione cualquier tecla para continuar.`);
    
    document.addEventListener('keydown', function limpiarReserva() {
      contenedor.remove();
      aplicarEstilosCeldas();
      limpiarHabitacionesSeleccionadas();
      const fondoReserva = document.querySelector('.fondo-reserva');
      if (fondoReserva) {
        fondoReserva.classList.remove('opaco');
      }
      document.removeEventListener('keydown', limpiarReserva);
    }, { once: true });
  });

  contenedor.appendChild(formularioHuesped);
  contenedor.appendChild(confirmarButton);

  // Crear divs de habitaciones seleccionadas
  habitaciones.forEach((habitacion) => {
    const habitacionDiv = document.createElement('div');
    habitacionDiv.className = 'contenedor-habitacion-reserva';
    habitacionDiv.innerHTML = `
      <p>Habitación: <strong>${habitacion}</strong></p>
      <p>Desde fecha: <strong>${diaSemanaInput1}, ${desdeFecha}, 12:00</strong></p>
      <p>Hasta fecha: <strong>${diaSemanaInput2}, ${hastaFecha}, 10:00</strong></p>
    `;
    contenedor.insertBefore(habitacionDiv, confirmarButton);
  });
}

/**
 * Muestra la pantalla de confirmación de reserva
 * @param {string[]} habitaciones - Array de habitaciones seleccionadas
 * @param {string} desdeFecha - Fecha de entrada
 * @param {string} hastaFecha - Fecha de salida
 */
function mostrarConfirmacionReserva(habitaciones, desdeFecha, hastaFecha) {
  const resultadoDiv = document.querySelector('.contenedor-resultados');
  const resultadoCopia = resultadoDiv.cloneNode(true);
  resultadoDiv.style.display = 'none';
  document.body.appendChild(resultadoCopia);

  resultadoCopia.querySelector('.contenedor-tabla-scroll').remove();
  resultadoCopia.querySelector('.boton-reservar').remove();
  resultadoCopia.querySelector('.titulo-resultados').textContent = "Horarios por reservar:";

  resultadoCopia.style.display = 'block';

  const nuevoSiguienteButton = document.createElement('div');
  nuevoSiguienteButton.className = 'boton-reservar boton-aceptar-reserva';
  nuevoSiguienteButton.textContent = "Aceptar";

  const nuevoCancelarButton = document.createElement('div');
  nuevoCancelarButton.className = 'boton-reservar boton-rechazar-reserva';
  nuevoCancelarButton.textContent = "Rechazar";

  nuevoCancelarButton.addEventListener('click', function() {
    resultadoCopia.remove();
    aplicarEstilosCeldas();
    limpiarHabitacionesSeleccionadas();
    const fondoReserva = document.querySelector('.fondo-reserva');
    if (fondoReserva) {
      fondoReserva.classList.remove('opaco');
    }
  });

  nuevoSiguienteButton.addEventListener('click', function() {
    crearFormularioDatosHuesped(resultadoCopia, desdeFecha, hastaFecha, habitaciones);
  });

  resultadoCopia.appendChild(nuevoCancelarButton);
  resultadoCopia.appendChild(nuevoSiguienteButton);

  // Agregar información de habitaciones
  habitaciones.forEach((habitacion) => {
    const fechaSeleccionada1 = new Date(desdeFecha);
    const fechaSeleccionada2 = new Date(hastaFecha);
    const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const diaSemanaInput1 = dias[fechaSeleccionada1.getDay()];
    const diaSemanaInput2 = dias[fechaSeleccionada2.getDay()];

    const habitacionDiv = document.createElement('div');
    habitacionDiv.className = 'contenedor-habitacion-reserva';
    habitacionDiv.innerHTML = `
      <p>Habitación: <strong>${habitacion}</strong></p>
      <p>Desde fecha: <strong>${diaSemanaInput1}, ${desdeFecha}, 12:00</strong></p>
      <p>Hasta fecha: <strong>${diaSemanaInput2}, ${hastaFecha}, 10:00</strong></p>
    `;
    resultadoCopia.insertBefore(habitacionDiv, nuevoCancelarButton);
  });
}

/**
 * Maneja el evento de clic en el botón de reservar
 */
function manejarClickReservar() {
  const botonReservar = document.querySelector('.boton-reservar');
  if (!botonReservar) {
    console.error('Botón de reservar no encontrado');
    return;
  }

  botonReservar.addEventListener('click', function() {
    const habitaciones = obtenerHabitacionesSeleccionadas();
    
    if (habitaciones.length === 0) {
      mensajeError("Por favor, seleccione al menos una habitación.");
      return;
    }

    const desdeFecha = document.getElementById('fecha-desde').value;
    const hastaFecha = document.getElementById('fecha-hasta').value;

    mostrarConfirmacionReserva(habitaciones, desdeFecha, hastaFecha);
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

    const fechaDesde = document.getElementById('fecha-desde').value;
    const fechaHasta = document.getElementById('fecha-hasta').value;

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
      
      const fondoReserva = document.querySelector('.fondo-reserva');
      if (fondoReserva) {
        fondoReserva.classList.add('opaco');
      }
      const resultadoDiv = document.querySelector('.contenedor-resultados');
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
 * Inicializa el flujo de reserva
 */
function inicializarReserva() {
  manejarBusqueda();
  manejarClickReservar();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarReserva);
} else {
  inicializarReserva();
}

