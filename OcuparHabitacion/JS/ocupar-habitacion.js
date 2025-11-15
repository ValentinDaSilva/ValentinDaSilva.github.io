/* Gestión del flujo principal de ocupar habitación */

import { 
  GestorEstadia 
} from "../../Clases/Dominio/dominio.js";
import { 
  convertirReservaJSONADominio, 
  convertirHuespedJSONADominio,
  buscarReservasParaHabitaciones
} from "./conversor-datos.js";
import { 
  mostrarJSONEstadiaEnPantalla 
} from "./mostrar-json-estadia.js";

// Variables globales para el flujo de ocupar habitación
let reservaSeleccionada = null;
let titularSeleccionado = null;
let acompaniantesSeleccionados = [];

/**
 * Maneja el evento de clic en el botón de ocupar
 */
async function manejarClickOcupar() {
  const botonOcupar = document.querySelector('.boton-ocupar');
  if (!botonOcupar) {
    console.error('Botón de ocupar no encontrado');
    return;
  }

  botonOcupar.addEventListener('click', async function() {
    const habitacionesSeleccionadas = obtenerHabitacionesSeleccionadas();
    
    if (habitacionesSeleccionadas.length === 0) {
      mensajeError("Por favor, seleccione al menos una habitación.");
      return;
    }

    // Cargar reservas si no están cargadas
    await asegurarDatosCargados();
    const reservasJSON = obtenerReservas();
    
    // Buscar reservas que coincidan con las habitaciones seleccionadas
    const reservasCoincidentes = buscarReservasParaHabitaciones(habitacionesSeleccionadas, reservasJSON);
    
    if (reservasCoincidentes.length === 0) {
      mensajeError("No se encontraron reservas para las habitaciones seleccionadas. Por favor, verifique las fechas.");
      return;
    }
    
    // Si hay una sola reserva, seleccionarla automáticamente
    if (reservasCoincidentes.length === 1) {
      reservaSeleccionada = reservasCoincidentes[0];
      // Continuar con la selección de titular y acompañantes
      mostrarFormularioBusquedaTitular();
    } else {
      // Si hay múltiples reservas, mostrar un selector
      mostrarSelectorReservas(reservasCoincidentes);
    }
  });
}

/**
 * Muestra un selector de reservas cuando hay múltiples opciones
 * @param {Array} reservasCoincidentes - Array de reservas que coinciden
 */
function mostrarSelectorReservas(reservasCoincidentes) {
  // Crear un contenedor modal para seleccionar la reserva
  const modalReservas = document.createElement('div');
  modalReservas.id = 'modal-seleccion-reserva';
  modalReservas.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
  `;
  
  const contenido = document.createElement('div');
  contenido.style.cssText = `
    background: white;
    padding: 20px;
    border-radius: 8px;
    max-width: 80%;
    max-height: 80%;
    overflow: auto;
  `;
  
  const titulo = document.createElement('h2');
  titulo.textContent = 'Seleccione una reserva';
  titulo.style.marginBottom = '20px';
  contenido.appendChild(titulo);
  
  const tabla = document.createElement('table');
  tabla.style.width = '100%';
  tabla.style.borderCollapse = 'collapse';
  
  // Encabezados
  const thead = document.createElement('thead');
  thead.innerHTML = `
    <tr>
      <th style="padding: 10px; border: 1px solid #ddd;">Habitación</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Desde</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Hasta</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Responsable</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Teléfono</th>
      <th style="padding: 10px; border: 1px solid #ddd;">Acción</th>
    </tr>
  `;
  tabla.appendChild(thead);
  
  const tbody = document.createElement('tbody');
  reservasCoincidentes.forEach((reserva, index) => {
    const fila = document.createElement('tr');
    
    // Nuevo formato: obtener datos de habitaciones y titular
    const habitaciones = reserva.habitaciones || [];
    const primeraHabitacion = habitaciones.length > 0 ? habitaciones[0] : null;
    const numeroHabitacion = primeraHabitacion ? primeraHabitacion.numero : (reserva.numeroHabitacion || 'N/A');
    const tipoHabitacion = primeraHabitacion ? primeraHabitacion.tipo : '';
    
    // Fechas: nuevo formato usa fechaInicio/fechaFin, antiguo usa desde/hasta
    const fechaDesde = reserva.fechaInicio || reserva.desde;
    const fechaHasta = reserva.fechaFin || reserva.hasta;
    
    // Titular: nuevo formato tiene titular como objeto, antiguo tiene responsable como string
    const nombreTitular = reserva.titular 
      ? `${reserva.titular.apellido || ''}, ${reserva.titular.nombre || ''}`.trim()
      : (reserva.responsable || '');
    const telefonoTitular = reserva.titular 
      ? (reserva.titular.telefono || '')
      : (reserva.telefono || '');
    
    fila.innerHTML = `
      <td style="padding: 10px; border: 1px solid #ddd;">${tipoHabitacion}-${numeroHabitacion}${habitaciones.length > 1 ? ` (+${habitaciones.length - 1})` : ''}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${fechaDesde}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${fechaHasta}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${nombreTitular}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">${telefonoTitular}</td>
      <td style="padding: 10px; border: 1px solid #ddd;">
        <button class="btn-seleccionar-reserva" data-index="${index}" style="padding: 5px 10px; cursor: pointer;">Seleccionar</button>
      </td>
    `;
    tbody.appendChild(fila);
  });
  tabla.appendChild(tbody);
  contenido.appendChild(tabla);
  
  const botonCerrar = document.createElement('button');
  botonCerrar.textContent = 'Cancelar';
  botonCerrar.style.cssText = 'margin-top: 20px; padding: 10px 20px; cursor: pointer;';
  botonCerrar.onclick = function() {
    document.body.removeChild(modalReservas);
  };
  contenido.appendChild(botonCerrar);
  
  modalReservas.appendChild(contenido);
  document.body.appendChild(modalReservas);
  
  // Agregar listeners a los botones de selección
  contenido.querySelectorAll('.btn-seleccionar-reserva').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      reservaSeleccionada = reservasCoincidentes[index];
      document.body.removeChild(modalReservas);
      mostrarFormularioBusquedaTitular();
    });
  });
}

/**
 * Muestra el formulario de búsqueda de huésped para seleccionar el titular
 */
function mostrarFormularioBusquedaTitular() {
  // Ocultar el contenedor de resultados y mostrar el formulario de búsqueda de huésped
  const resultadoDiv = document.querySelector('.resultado, .contenedor-resultados');
  if (resultadoDiv) {
    resultadoDiv.style.display = 'none';
  }
  const container = document.querySelector('.container');
  if (container) {
    // Actualizar el título para indicar que se busca el titular
    const titulo = container.querySelector('h1');
    if (titulo) {
      titulo.textContent = 'Buscar Titular de la Estadía';
    }
    // Actualizar el texto del botón
    const siguienteBusquedaButton = document.querySelector('.siguienteBusqueda');
    if (siguienteBusquedaButton) {
      siguienteBusquedaButton.textContent = 'Aceptar';
    }
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
  
  // Limpiar selecciones anteriores
  titularSeleccionado = null;
  acompaniantesSeleccionados = [];
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
 * Maneja la selección del titular desde los resultados de búsqueda
 * @param {Object} huespedJSON - Datos del huésped seleccionado en formato JSON
 */
function manejarSeleccionTitular(huespedJSON) {
  titularSeleccionado = huespedJSON;
  
  // Preguntar si desea agregar acompañantes
  pregunta(
    "¿Desea agregar acompañantes?",
    "Sí, agregar acompañantes",
    "No, continuar sin acompañantes",
    "Cancelar"
  ).then(boton => {
    if (boton === "Cancelar") {
      // Limpiar selección y volver
      titularSeleccionado = null;
      return;
    }
    
    if (boton === "Sí, agregar acompañantes") {
      // Mostrar formulario para buscar acompañantes
      mostrarFormularioBusquedaAcompaniantes();
    } else {
      // Continuar sin acompañantes y crear la estadía
      crearEstadia();
    }
  });
}

/**
 * Muestra el formulario de búsqueda de huésped para seleccionar acompañantes
 */
function mostrarFormularioBusquedaAcompaniantes() {
  const container = document.querySelector('.container');
  if (container) {
    const titulo = container.querySelector('h1');
    if (titulo) {
      titulo.textContent = 'Buscar Acompañantes (opcional)';
    }
    // Actualizar el texto del botón
    const siguienteBusquedaButton = document.querySelector('.siguienteBusqueda');
    if (siguienteBusquedaButton) {
      siguienteBusquedaButton.textContent = 'Continuar';
    }
    // Limpiar el formulario
    const form = container.querySelector('form');
    if (form) {
      form.reset();
    }
    // Limpiar resultados anteriores
    const resultadoDiv = document.querySelector('.resultadoBusqueda');
    if (resultadoDiv) {
      resultadoDiv.style.display = 'none';
    }
    // Asegurar que el contenedor esté visible
    container.style.display = 'block';
    setTimeout(() => {
      container.style.top = '50px';
    }, 10);
  }
  
  // Limpiar selección de acompañantes
  acompaniantesSeleccionados = [];
}

/**
 * Maneja la selección de acompañantes desde los resultados de búsqueda
 * @param {Array} acompaniantesJSON - Array de datos de acompañantes en formato JSON
 */
function manejarSeleccionAcompaniantes(acompaniantesJSON) {
  acompaniantesSeleccionados = acompaniantesJSON;
  
  // Crear la estadía
  crearEstadia();
}

/**
 * Crea la estadía usando el gestor y la muestra en formato JSON
 */
async function crearEstadia() {
  try {
    if (!reservaSeleccionada) {
      mensajeError("No se ha seleccionado una reserva.");
      return;
    }
    
    if (!titularSeleccionado) {
      mensajeError("No se ha seleccionado un titular.");
      return;
    }
    
    // Cargar datos necesarios
    await asegurarDatosCargados();
    const habitacionesData = obtenerHabitaciones();
    
    // Convertir la reserva JSON a objeto Reserva de dominio
    // El ID viene directamente del JSON en el nuevo formato
    const idReserva = reservaSeleccionada.id || (obtenerReservas().indexOf(reservaSeleccionada) + 1);
    const reserva = convertirReservaJSONADominio(reservaSeleccionada, idReserva, habitacionesData);
    
    // Convertir el titular JSON a objeto Huesped de dominio
    const titular = convertirHuespedJSONADominio(titularSeleccionado);
    
    // Convertir los acompañantes JSON a objetos Huesped de dominio
    const acompaniantes = acompaniantesSeleccionados.map(acompJSON => 
      convertirHuespedJSONADominio(acompJSON)
    );
    
    // Obtener las fechas de la reserva para el check-in (nuevo formato usa fechaInicio/fechaFin)
    const fechaCheckIn = reservaSeleccionada.fechaInicio || reservaSeleccionada.desde;
    const fechaCheckOut = reservaSeleccionada.fechaFin || reservaSeleccionada.hasta;
    
    // Crear el gestor de estadías
    const gestorEstadia = new GestorEstadia();
    
    // Crear la estadía
    const estadia = gestorEstadia.crearEstadia(
      reserva,
      titular,
      acompaniantes,
      fechaCheckIn,
      fechaCheckOut
    );
    
    // Ocultar formularios
    const container = document.querySelector('.container');
    if (container) {
      container.style.display = 'none';
    }
    const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
    if (resultadoBusqueda) {
      resultadoBusqueda.style.display = 'none';
    }
    
    // Mostrar el JSON en pantalla
    mostrarJSONEstadiaEnPantalla(estadia, function() {
      // Callback cuando se cierra el JSON
      mensajeCorrecto(`Estadía creada exitosamente.<br>Presione cualquier tecla para continuar.`);
      
      // Agregar listener para cerrar cuando se presione cualquier tecla
      document.addEventListener('keydown', function limpiarEstadia() {
        const modalCorrecto = document.getElementById('modal-correcto');
        if (modalCorrecto) {
          modalCorrecto.style.display = 'none';
        }
        
        // Cerrar el contenedor JSON si está abierto
        const contenedorJSON = document.getElementById('contenedor-json-estadia');
        if (contenedorJSON) {
          contenedorJSON.style.display = 'none';
        }
        
        // Recargar la página para limpiar todo
        location.reload();
        
        document.removeEventListener('keydown', limpiarEstadia);
      }, { once: true });
    });
    
  } catch (error) {
    console.error('Error al crear la estadía:', error);
    mensajeError("Error al crear la estadía. Por favor, intente nuevamente.");
  }
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

// Exportar funciones para uso en otros módulos
window.manejarSeleccionTitular = manejarSeleccionTitular;
window.manejarSeleccionAcompaniantes = manejarSeleccionAcompaniantes;

