

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


let reservaSeleccionada = null;
let titularSeleccionado = null;
let acompaniantesSeleccionados = [];


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

    
    await asegurarDatosCargados();
    const reservasJSON = obtenerReservas();
    
    
    const reservasCoincidentes = buscarReservasParaHabitaciones(habitacionesSeleccionadas, reservasJSON);
    
    if (reservasCoincidentes.length === 0) {
      mensajeError("No se encontraron reservas para las habitaciones seleccionadas. Por favor, verifique las fechas.");
      return;
    }
    
    
    if (reservasCoincidentes.length === 1) {
      reservaSeleccionada = reservasCoincidentes[0];
      
      mostrarFormularioBusquedaTitular();
    } else {
      
      mostrarSelectorReservas(reservasCoincidentes);
    }
  });
}


function mostrarSelectorReservas(reservasCoincidentes) {
  
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
    
    
    const habitaciones = reserva.habitaciones || [];
    const primeraHabitacion = habitaciones.length > 0 ? habitaciones[0] : null;
    const numeroHabitacion = primeraHabitacion ? primeraHabitacion.numero : (reserva.numeroHabitacion || 'N/A');
    const tipoHabitacion = primeraHabitacion ? primeraHabitacion.tipo : '';
    
    
    const fechaDesde = reserva.fechaInicio || reserva.desde;
    const fechaHasta = reserva.fechaFin || reserva.hasta;
    
    
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
  
  
  contenido.querySelectorAll('.btn-seleccionar-reserva').forEach(btn => {
    btn.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      reservaSeleccionada = reservasCoincidentes[index];
      document.body.removeChild(modalReservas);
      mostrarFormularioBusquedaTitular();
    });
  });
}


function mostrarFormularioBusquedaTitular() {
  
  const resultadoDiv = document.querySelector('.resultado, .contenedor-resultados');
  if (resultadoDiv) {
    resultadoDiv.style.display = 'none';
  }
  const container = document.querySelector('.container');
  if (container) {
    
    const titulo = container.querySelector('h1');
    if (titulo) {
      titulo.textContent = 'Buscar Titular de la Estadía';
    }
    
    const siguienteBusquedaButton = document.querySelector('.siguienteBusqueda');
    if (siguienteBusquedaButton) {
      siguienteBusquedaButton.textContent = 'Aceptar';
    }
    container.style.display = 'block';
    
    setTimeout(() => {
      container.style.top = '50px';
    }, 10);
  }
  const bookingForm = document.querySelector('.booking-form, .formulario-busqueda');
  if (bookingForm) {
    bookingForm.style.display = 'none';
  }
  
  
  titularSeleccionado = null;
  acompaniantesSeleccionados = [];
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

    const fechaDesde = document.getElementById('checkin').value;
    const fechaHasta = document.getElementById('checkout').value;

    
    limpiarHabitacionesSeleccionadas();
    const selectFiltro = document.getElementById('filtro-tipo-habitacion');
    if (selectFiltro) {
      selectFiltro.value = '';
    }
    
    
    asegurarDatosCargados().then(() => {
      
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


function manejarSeleccionTitular(huespedJSON) {
  titularSeleccionado = huespedJSON;
  
  
  pregunta(
    "¿Desea agregar acompañantes?",
    "Sí, agregar acompañantes ✅",
    "No, continuar sin acompañantes ❌",
    "Cancelar ❌"
  ).then(boton => {
    if (boton === "Cancelar") {
      
      titularSeleccionado = null;
      return;
    }
    
    if (boton === "Sí, agregar acompañantes") {
      
      mostrarFormularioBusquedaAcompaniantes();
    } else {
      
      crearEstadia();
    }
  });
}


function mostrarFormularioBusquedaAcompaniantes() {
  const container = document.querySelector('.container');
  if (container) {
    const titulo = container.querySelector('h1');
    if (titulo) {
      titulo.textContent = 'Buscar Acompañantes (opcional)';
    }
    
    const siguienteBusquedaButton = document.querySelector('.siguienteBusqueda');
    if (siguienteBusquedaButton) {
      siguienteBusquedaButton.textContent = 'Continuar';
    }
    
    const form = container.querySelector('form');
    if (form) {
      form.reset();
    }
    
    const resultadoDiv = document.querySelector('.resultadoBusqueda');
    if (resultadoDiv) {
      resultadoDiv.style.display = 'none';
    }
    
    container.style.display = 'block';
    setTimeout(() => {
      container.style.top = '50px';
    }, 10);
  }
  
  
  acompaniantesSeleccionados = [];
}


function manejarSeleccionAcompaniantes(acompaniantesJSON) {
  acompaniantesSeleccionados = acompaniantesJSON;
  
  
  crearEstadia();
}


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
    
    
    await asegurarDatosCargados();
    const habitacionesData = obtenerHabitaciones();
    
    
    
    const idReserva = reservaSeleccionada.id || (obtenerReservas().indexOf(reservaSeleccionada) + 1);
    const reserva = convertirReservaJSONADominio(reservaSeleccionada, idReserva, habitacionesData);
    
    
    const titular = convertirHuespedJSONADominio(titularSeleccionado);
    
    
    const acompaniantes = acompaniantesSeleccionados.map(acompJSON => 
      convertirHuespedJSONADominio(acompJSON)
    );
    
    
    const fechaCheckIn = reservaSeleccionada.fechaInicio || reservaSeleccionada.desde;
    const fechaCheckOut = reservaSeleccionada.fechaFin || reservaSeleccionada.hasta;
    
    
    const gestorEstadia = new GestorEstadia();
    
    
    const estadia = gestorEstadia.crearEstadia(
      reserva,
      titular,
      acompaniantes,
      fechaCheckIn,
      fechaCheckOut
    );
    
    
    const container = document.querySelector('.container');
    if (container) {
      container.style.display = 'none';
    }
    const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
    if (resultadoBusqueda) {
      resultadoBusqueda.style.display = 'none';
    }
    
    
    mostrarJSONEstadiaEnPantalla(estadia, function() {
      
      mensajeCorrecto(`Estadía creada exitosamente.<br>Presione cualquier tecla para continuar.`);
      
      
      document.addEventListener('keydown', function limpiarEstadia() {
        const modalCorrecto = document.getElementById('modal-correcto');
        if (modalCorrecto) {
          modalCorrecto.style.display = 'none';
        }
        
        
        const contenedorJSON = document.getElementById('contenedor-json-estadia');
        if (contenedorJSON) {
          contenedorJSON.style.display = 'none';
        }
        
        
        location.reload();
        
        document.removeEventListener('keydown', limpiarEstadia);
      }, { once: true });
    });
    
  } catch (error) {
    console.error('Error al crear la estadía:', error);
    mensajeError("Error al crear la estadía. Por favor, intente nuevamente.");
  }
}


function inicializarOcuparHabitacion() {
  manejarBusqueda();
  manejarClickOcupar();
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarOcuparHabitacion);
} else {
  inicializarOcuparHabitacion();
}


window.manejarSeleccionTitular = manejarSeleccionTitular;
window.manejarSeleccionAcompaniantes = manejarSeleccionAcompaniantes;

