

import { 
  Persona, 
  Habitacion, 
  Reserva, 
  EstadoHabitacion, 
  EstadoReserva, 
  GestorReserva 
} from "../../Clases/Dominio/dominio.js";


function crearFormularioDatosHuesped(contenedor, habitacionesSeleccionadas) {
  
  contenedor.innerHTML = '';
  
  
  const divsHabitacion = contenedor.querySelectorAll('.contenedor-habitacion-reserva');
  divsHabitacion.forEach(div => div.remove());
  
  contenedor.style.display = 'flex';
  contenedor.style.flexDirection = 'column';
  contenedor.style.alignItems = 'center';

  const nuevoTitulo = document.createElement('h2');
  nuevoTitulo.textContent = "Datos del huésped";
  nuevoTitulo.className = "titulo-formulario-huesped";
  contenedor.appendChild(nuevoTitulo);

  const formularioHuesped = document.createElement('form');
  formularioHuesped.className = 'formulario-datos-huesped';
  formularioHuesped.setAttribute('novalidate', '');
  formularioHuesped.innerHTML = `
    <div class="cuadricula-formulario-huesped">
      <div class="contenedor-campo-huesped">
        <label class="etiqueta-campo requerido" for="nombre">Nombre:</label>
        <input 
          type="text" 
          id="nombre" 
          name="nombre" 
          required 
          class="campo-huesped"
          placeholder="Ingrese su nombre"
          minlength="2"
          maxlength="50"
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
        >
        <span class="mensaje-error" id="error-nombre"></span>
        <span class="icono-validacion" id="icono-nombre"></span>
      </div>
      
      <div class="contenedor-campo-huesped">
        <label class="etiqueta-campo requerido" for="apellido">Apellido:</label>
        <input 
          type="text" 
          id="apellido" 
          name="apellido" 
          required 
          class="campo-huesped"
          placeholder="Ingrese su apellido"
          minlength="2"
          maxlength="50"
          pattern="[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+"
        >
        <span class="mensaje-error" id="error-apellido"></span>
        <span class="icono-validacion" id="icono-apellido"></span>
      </div>
      
      <div class="contenedor-campo-huesped">
        <label class="etiqueta-campo requerido" for="telefono">Teléfono:</label>
        <input 
          type="tel" 
          id="telefono" 
          name="telefono" 
          required 
          class="campo-huesped"
          placeholder="Ej: 1234567890"
          pattern="[0-9]{10,15}"
          minlength="10"
          maxlength="15"
        >
        <span class="mensaje-error" id="error-telefono"></span>
        <span class="icono-validacion" id="icono-telefono"></span>
      </div>
    </div>
  `;

  
  inicializarValidacionesFormulario();

  contenedor.appendChild(formularioHuesped);
  
  const confirmarButton = document.createElement('button');
  confirmarButton.type = "button"; 
  confirmarButton.textContent = "Confirmar Reserva";
  confirmarButton.className = "boton-confirmar";
  
  
  confirmarButton.addEventListener('click', async function(event) {
    event.preventDefault();
    event.stopPropagation();
    
    console.log('Botón confirmar clickeado'); 
    
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const telefonoInput = document.getElementById('telefono');
    
    console.log('Inputs encontrados:', { nombreInput, apellidoInput, telefonoInput }); 
    
    if (!nombreInput || !apellidoInput || !telefonoInput) {
      console.error('No se encontraron los inputs del formulario');
      mensajeError("Error: No se encontraron los campos del formulario.");
      return;
    }
    
    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const telefono = telefonoInput.value.trim();
    
    
    let esValido = true;
    esValido = validarCampo(nombreInput, 'nombre') && esValido;
    esValido = validarCampo(apellidoInput, 'apellido') && esValido;
    esValido = validarCampo(telefonoInput, 'telefono') && esValido;

    if (!esValido) {
      mensajeError("Por favor, corrija los errores en el formulario.");
      return;
    }

    
    const habitacionesSeleccionadas = obtenerHabitacionesSeleccionadas();
    if (habitacionesSeleccionadas.length === 0) {
      mensajeError("Por favor, seleccione al menos una habitación.");
      return;
    }

    try {
      
      if (window.gestorReserva) {
        const datosTitular = { nombre, apellido, telefono };
        const exito = await window.gestorReserva.realizarReserva(habitacionesSeleccionadas, datosTitular);
        
        if (exito) {
          console.log(`Reserva creada exitosamente`);
          contenedor.style.display = 'none';
          
          if (typeof mostrarModalExitoReserva === 'function') {
        mostrarModalExitoReserva(nombre, apellido, contenedor);
          }
        }
      } else {
        mensajeError("Error: El gestor de reservas no está disponible.");
      }

    } catch (error) {
      console.error('Error al crear la reserva:', error);
      mensajeError("Error al crear la reserva. Por favor, intente nuevamente.");
    }
  });

  contenedor.appendChild(confirmarButton);
  
  
  formularioHuesped.addEventListener('submit', function(event) {
    event.preventDefault();
    confirmarButton.click(); 
  });
  
  
  
}


function inicializarValidacionesFormulario() {
  
  setTimeout(() => {
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const telefonoInput = document.getElementById('telefono');
    
    if (nombreInput) {
      nombreInput.addEventListener('blur', () => {
        nombreInput.value = nombreInput.value.toUpperCase();
        validarCampo(nombreInput, 'nombre');
      });
      nombreInput.addEventListener('input', () => {
        
        const cursorPosition = nombreInput.selectionStart;
        nombreInput.value = nombreInput.value.toUpperCase();
        
        nombreInput.setSelectionRange(cursorPosition, cursorPosition);
        limpiarError('nombre');
      });
    }
    
    if (apellidoInput) {
      apellidoInput.addEventListener('blur', () => {
        apellidoInput.value = apellidoInput.value.toUpperCase();
        validarCampo(apellidoInput, 'apellido');
      });
      apellidoInput.addEventListener('input', () => {
        
        const cursorPosition = apellidoInput.selectionStart;
        apellidoInput.value = apellidoInput.value.toUpperCase();
        
        apellidoInput.setSelectionRange(cursorPosition, cursorPosition);
        limpiarError('apellido');
      });
    }
    
    if (telefonoInput) {
      telefonoInput.addEventListener('blur', () => validarCampo(telefonoInput, 'telefono'));
      telefonoInput.addEventListener('input', () => {
        
        telefonoInput.value = telefonoInput.value.replace(/\D/g, '');
        limpiarError('telefono');
      });
    }
  }, 100);
}


function validarCampo(input, tipoCampo) {
  const valor = input.value.trim();
  const errorElement = document.getElementById(`error-${tipoCampo}`);
  const iconoElement = document.getElementById(`icono-${tipoCampo}`);
  
  let esValido = true;
  let mensajeError = '';
  
  
  if (!valor) {
    esValido = false;
    mensajeError = 'Este campo es requerido';
  } else {
    
    switch (tipoCampo) {
      case 'nombre':
      case 'apellido':
        if (valor.length < 2) {
          esValido = false;
          mensajeError = 'Debe tener al menos 2 caracteres';
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/.test(valor)) {
          esValido = false;
          mensajeError = 'Solo se permiten letras y espacios';
        } else if (valor.length > 50) {
          esValido = false;
          mensajeError = 'No puede tener más de 50 caracteres';
        }
        break;
      
      case 'telefono':
        if (valor.length < 10) {
          esValido = false;
          mensajeError = 'Debe tener al menos 10 dígitos';
        } else if (valor.length > 15) {
          esValido = false;
          mensajeError = 'No puede tener más de 15 dígitos';
        } else if (!/^[0-9]+$/.test(valor)) {
          esValido = false;
          mensajeError = 'Solo se permiten números';
        }
        break;
    }
  }
  
  
  if (esValido) {
    input.classList.remove('campo-invalido');
    input.classList.add('campo-valido');
    if (errorElement) errorElement.textContent = '';
    if (iconoElement) {
      iconoElement.textContent = '✓';
      iconoElement.className = 'icono-validacion icono-validacion-exito';
    }
  } else {
    input.classList.remove('campo-valido');
    input.classList.add('campo-invalido');
    if (errorElement) errorElement.textContent = mensajeError;
    if (iconoElement) {
      iconoElement.textContent = '✗';
      iconoElement.className = 'icono-validacion icono-validacion-error';
    }
  }
  
  return esValido;
}


function mostrarModalExitoReserva(nombre, apellido, contenedor) {
  console.log('Llamando a mensajeCorrecto'); 
  mensajeCorrecto(`Reserva realizada con éxito para <br>"${nombre} ${apellido}".<br>Presione cualquier tecla para continuar.`);
  
  
  setTimeout(() => {
    const modalCorrecto = document.getElementById('modal-correcto');
    console.log('Estado del modal después de mostrar:', modalCorrecto ? modalCorrecto.style.display : 'modal no encontrado'); 
    if (modalCorrecto && modalCorrecto.style.display !== 'flex') {
      console.error('El modal no se mostró correctamente, intentando mostrar manualmente');
      modalCorrecto.style.display = 'flex';
      modalCorrecto.style.zIndex = '9999';
    }
  }, 100);
  
  
  document.addEventListener('keydown', function limpiarReserva() {
    
    const modalCorrecto = document.getElementById('modal-correcto');
    if (modalCorrecto) {
      modalCorrecto.style.display = 'none';
    }
    
    
    const contenedorJSON = document.getElementById('contenedor-json-reserva');
    if (contenedorJSON) {
      contenedorJSON.style.display = 'none';
    }
    
    contenedor.remove();
    aplicarEstilosCeldas();
    limpiarHabitacionesSeleccionadas();
    const fondoReserva = document.querySelector('.fondo-reserva');
    if (fondoReserva) {
      fondoReserva.classList.remove('opaco');
    }
    document.removeEventListener('keydown', limpiarReserva);
  }, { once: true });
}


window.mostrarModalExitoReserva = mostrarModalExitoReserva;


function limpiarError(tipoCampo) {
  const input = document.getElementById(tipoCampo);
  const errorElement = document.getElementById(`error-${tipoCampo}`);
  const iconoElement = document.getElementById(`icono-${tipoCampo}`);
  
  if (input) {
    input.classList.remove('campo-invalido', 'campo-valido');
  }
  if (errorElement) errorElement.textContent = '';
  if (iconoElement) {
    iconoElement.textContent = '';
    iconoElement.className = 'icono-validacion';
  }
}



function mostrarConfirmacionReserva(habitacionesSeleccionadas) {
  try {
    console.log('mostrarConfirmacionReserva llamado con:', habitacionesSeleccionadas);
    
    const resultadoDiv = document.querySelector('.contenedor-resultados');
    if (!resultadoDiv) {
      console.error('No se encontró .contenedor-resultados');
      mensajeError("Error: No se pudo encontrar el contenedor de resultados.");
      return;
    }

    const resultadoCopia = resultadoDiv.cloneNode(true);
    resultadoDiv.style.display = 'none';
    document.body.appendChild(resultadoCopia);

    const tablaScroll = resultadoCopia.querySelector('.contenedor-tabla-scroll');
    const botonReservar = resultadoCopia.querySelector('.boton-reservar');
    const tituloResultados = resultadoCopia.querySelector('.titulo-resultados');

    if (tablaScroll) tablaScroll.remove();
    if (botonReservar) botonReservar.remove();
    if (tituloResultados) tituloResultados.textContent = "Horarios por reservar:";

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
      crearFormularioDatosHuesped(resultadoCopia, habitacionesSeleccionadas);
    });

    resultadoCopia.appendChild(nuevoCancelarButton);
    resultadoCopia.appendChild(nuevoSiguienteButton);

    
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    habitacionesSeleccionadas.forEach((seleccion) => {
      try {
        const partesDesde = seleccion.fechaDesde.split('-').map(Number);
        const partesHasta = seleccion.fechaHasta.split('-').map(Number);
        const fechaDesdeDate = new Date(partesDesde[0], partesDesde[1] - 1, partesDesde[2]);
        const fechaHastaDate = new Date(partesHasta[0], partesHasta[1] - 1, partesHasta[2]);
        
        const diaSemanaDesde = dias[fechaDesdeDate.getDay()];
        const diaSemanaHasta = dias[fechaHastaDate.getDay()];

        const habitacionDiv = document.createElement('div');
        habitacionDiv.className = 'contenedor-habitacion-reserva';
        habitacionDiv.innerHTML = `
          <p>Habitación: <strong>${seleccion.habitacion}</strong></p>
          <p>Desde fecha: <strong>${diaSemanaDesde}, ${seleccion.fechaDesde}, 12:00</strong></p>
          <p>Hasta fecha: <strong>${diaSemanaHasta}, ${seleccion.fechaHasta}, 10:00</strong></p>
        `;
        resultadoCopia.insertBefore(habitacionDiv, nuevoCancelarButton);
      } catch (error) {
        console.error('Error al procesar habitación:', seleccion, error);
      }
    });

    console.log('Pantalla de confirmación mostrada exitosamente');
  } catch (error) {
    console.error('Error en mostrarConfirmacionReserva:', error);
    mensajeError("Error al mostrar la pantalla de confirmación. Por favor, intente nuevamente.");
  }
}


function manejarClickReservar() {
  const botonReservar = document.querySelector('.boton-reservar');
  if (!botonReservar) {
    console.error('Botón de reservar no encontrado');
    return;
  }

  botonReservar.addEventListener('click', function() {
    try {
      console.log('Botón Reservar clickeado');
      const habitacionesSeleccionadas = obtenerHabitacionesSeleccionadas();
      
      console.log('Habitaciones seleccionadas:', habitacionesSeleccionadas);
      
      if (habitacionesSeleccionadas.length === 0) {
        mensajeError("Por favor, seleccione al menos una habitación.");
        return;
      }

      console.log('Llamando a mostrarConfirmacionReserva');
      mostrarConfirmacionReserva(habitacionesSeleccionadas);
    } catch (error) {
      console.error('Error en manejarClickReservar:', error);
      mensajeError("Error al procesar la reserva. Por favor, intente nuevamente.");
    }
  });
}


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

    
    limpiarHabitacionesSeleccionadas();
    const selectFiltro = document.getElementById('filtro-tipo-habitacion');
    if (selectFiltro) {
      selectFiltro.value = '';
    }
    
    
    asegurarDatosCargados()
      .then(() => cargarReservasEntreFechas(fechaDesde, fechaHasta))
      .then(() => {
        establecerTipoFiltro('');
        generarTablaHabitaciones(fechaDesde, fechaHasta);
      })
      .catch(error => {
        console.error("Error al generar tabla:", error);
        mensajeError("Error al generar la tabla de habitaciones.");
      });

  });
}


function inicializarReserva() {
  manejarBusqueda();
  manejarClickReservar();
  console.log('hola estoy aca');
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarReserva);
} else {
  inicializarReserva();
}

