/* Gestión de la selección de habitaciones */

// Estructura: [{ habitacion: "IND-101", fechaDesde: "2024-01-15", fechaHasta: "2024-01-20" }, ...]
let habitacionesSeleccionadas = [];

// Variable para rastrear el estado de selección actual
let celdaInicioSeleccion = null; // { celda, habitacion, fecha }
let seleccionEnProgreso = false;

/**
 * Obtiene la lista de habitaciones seleccionadas con sus rangos de fechas
 * @returns {Array} - Array con objetos { habitacion: string, fechaDesde: string, fechaHasta: string }
 */
function obtenerHabitacionesSeleccionadas() {
  return habitacionesSeleccionadas;
}

/**
 * Limpia la lista de habitaciones seleccionadas
 */
function limpiarHabitacionesSeleccionadas() {
  habitacionesSeleccionadas = [];
  celdaInicioSeleccion = null;
  seleccionEnProgreso = false;
  // Limpiar visualmente todas las selecciones
  document.querySelectorAll('.estado-seleccionada').forEach(celda => {
    const estadoOriginal = celda.getAttribute('data-estado-original');
    celda.style.backgroundColor = '';
    celda.classList.remove('estado-seleccionada');
    celda.classList.add(estadoOriginal === 'reservada' ? 'estado-reservada' : 'estado-libre');
    aplicarEstilosCeldas();
  });
}

/**
 * Obtiene todas las celdas de una habitación específica
 * @param {string} numeroHabitacion - Número de habitación
 * @returns {HTMLTableCellElement[]} - Array de celdas de la habitación
 */
function obtenerCeldasHabitacion(numeroHabitacion) {
  const celdas = [];
  document.querySelectorAll('.tabla-habitaciones tbody tr').forEach(fila => {
    const celdasFila = Array.from(fila.cells);
    // La primera celda es la fecha, el resto son habitaciones
    celdasFila.slice(1).forEach((celda, index) => {
      const numeroHabCelda = celda.getAttribute('data-numero-habitacion');
      if (numeroHabCelda === numeroHabitacion) {
        celdas.push(celda);
      }
    });
  });
  return celdas;
}

/**
 * Obtiene el índice de la columna de una habitación en la tabla
 * @param {string} numeroHabitacion - Número de habitación
 * @returns {number} - Índice de la columna (1-based, 0 es fecha)
 */
function obtenerIndiceColumnaHabitacion(numeroHabitacion) {
  const headers = document.querySelectorAll('.tabla-habitaciones thead th');
  for (let i = 1; i < headers.length; i++) {
    const headerText = headers[i].textContent.trim();
    const partes = headerText.split('-');
    if (partes.length === 2) {
      const numHab = parseInt(partes[1], 10);
      if (numHab.toString() === numeroHabitacion) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * Selecciona un rango de fechas para una habitación
 * @param {string} habitacion - Nombre de la habitación (ej: "IND-101")
 * @param {string} fechaDesde - Fecha inicio en formato YYYY-MM-DD
 * @param {string} fechaHasta - Fecha fin en formato YYYY-MM-DD
 */
function seleccionarRangoHabitacion(habitacion, fechaDesde, fechaHasta) {
  // Verificar que fechaDesde <= fechaHasta
  if (compararFechas(fechaDesde, fechaHasta) > 0) {
    [fechaDesde, fechaHasta] = [fechaHasta, fechaDesde]; // Intercambiar si están al revés
  }

  const numeroHabitacion = obtenerNumeroDesdeNombre(habitacion);
  if (!numeroHabitacion) return;

  // Obtener todas las fechas del rango seleccionado en el formulario
  const fechaDesdeForm = document.getElementById('fecha-desde').value;
  const fechaHastaForm = document.getElementById('fecha-hasta').value;
  const todasLasFechas = generarArrayFechas(fechaDesdeForm, fechaHastaForm);

  // Verificar que el rango seleccionado está dentro del rango del formulario
  if (compararFechas(fechaDesde, fechaDesdeForm) < 0 || compararFechas(fechaHasta, fechaHastaForm) > 0) {
    mensajeError("El rango seleccionado debe estar dentro de las fechas del formulario");
    return;
  }

  // Verificar que todas las celdas en el rango estén libres
  const fechasRango = generarArrayFechas(fechaDesde, fechaHasta);
  const todasLibres = fechasRango.every(fecha => {
    return !estaHabitacionReservada(numeroHabitacion, fecha);
  });

  if (!todasLibres) {
    mensajeError("No se puede seleccionar el rango porque hay días reservados");
    return;
  }

  // Buscar si ya existe una selección para esta habitación (para excluirla de la validación)
  const indiceExistente = habitacionesSeleccionadas.findIndex(
    h => h.habitacion === habitacion
  );

  // Si existe una selección previa para esta habitación, eliminarla
  if (indiceExistente !== -1) {
    deseleccionarRangoHabitacion(habitacion);
  }

  // Agregar nueva selección
  habitacionesSeleccionadas.push({
    habitacion: habitacion,
    fechaDesde: fechaDesde,
    fechaHasta: fechaHasta
  });

  // Marcar visualmente las celdas seleccionadas
  todasLasFechas.forEach(fecha => {
    if (compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0) {
      const celda = document.querySelector(
        `.tabla-habitaciones td[data-numero-habitacion="${numeroHabitacion}"][data-fecha="${fecha}"]`
      );
      if (celda && celda.getAttribute('data-estado-original') === 'libre') {
        celda.style.backgroundColor = 'yellow';
        celda.classList.add('estado-seleccionada');
        celda.classList.remove('estado-libre');
      }
    }
  });
}

/**
 * Deselecciona el rango de una habitación
 * @param {string} habitacion - Nombre de la habitación
 */
function deseleccionarRangoHabitacion(habitacion) {
  const indice = habitacionesSeleccionadas.findIndex(h => h.habitacion === habitacion);
  if (indice === -1) return;

  const seleccion = habitacionesSeleccionadas[indice];
  habitacionesSeleccionadas.splice(indice, 1);

  const numeroHabitacion = obtenerNumeroDesdeNombre(habitacion);
  if (!numeroHabitacion) return;

  const fechasRango = generarArrayFechas(seleccion.fechaDesde, seleccion.fechaHasta);
  fechasRango.forEach(fecha => {
    const celda = document.querySelector(
      `.tabla-habitaciones td[data-numero-habitacion="${numeroHabitacion}"][data-fecha="${fecha}"]`
    );
    if (celda) {
      const estadoOriginal = celda.getAttribute('data-estado-original');
      celda.style.backgroundColor = '';
      celda.classList.remove('estado-seleccionada');
      celda.classList.add(estadoOriginal === 'reservada' ? 'estado-reservada' : 'estado-libre');
      aplicarEstilosCeldas();
    }
  });
}

/**
 * Maneja el clic en una celda de habitación
 * @param {HTMLElement} celda - Celda clickeada
 */
function manejarClickCelda(celda) {
  // Ignorar celdas de fecha o reservadas
  if (celda.getAttribute('data-estado-original') === 'reservada') {
    return;
  }

  const numeroHabitacion = celda.getAttribute('data-numero-habitacion');
  const fecha = celda.getAttribute('data-fecha');
  
  if (!numeroHabitacion || !fecha) return;

  // Obtener nombre de la habitación desde el header
  const headers = document.querySelectorAll('.tabla-habitaciones thead th');
  let nombreHabitacion = null;
  for (let i = 1; i < headers.length; i++) {
    const headerText = headers[i].textContent.trim();
    const partes = headerText.split('-');
    if (partes.length === 2) {
      const numHab = parseInt(partes[1], 10);
      if (numHab.toString() === numeroHabitacion) {
        nombreHabitacion = headerText;
        break;
      }
    }
  }

  if (!nombreHabitacion) return;

  // Verificar si esta celda ya está seleccionada como parte de un rango
  const seleccionExistente = habitacionesSeleccionadas.find(
    h => h.habitacion === nombreHabitacion
  );
  
  if (seleccionExistente) {
    const fechaDesde = seleccionExistente.fechaDesde;
    const fechaHasta = seleccionExistente.fechaHasta;
    
    // Si la celda está dentro del rango seleccionado, deseleccionar
    if (compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0) {
      deseleccionarRangoHabitacion(nombreHabitacion);
      celdaInicioSeleccion = null;
      seleccionEnProgreso = false;
      return;
    }
  }

  // Si ya hay una selección en progreso para esta habitación
  if (seleccionEnProgreso && celdaInicioSeleccion) {
    if (celdaInicioSeleccion.habitacion === nombreHabitacion) {
      // Segundo clic en la misma habitación: completar selección
      seleccionarRangoHabitacion(
        nombreHabitacion,
        celdaInicioSeleccion.fecha,
        fecha
      );
      celdaInicioSeleccion = null;
      seleccionEnProgreso = false;
    } else {
      // Si se hace clic en otra habitación, cancelar la selección anterior y empezar nueva
      // Primero limpiar cualquier selección existente en la nueva habitación
      const indiceExistente = habitacionesSeleccionadas.findIndex(
        h => h.habitacion === nombreHabitacion
      );
      if (indiceExistente !== -1) {
        deseleccionarRangoHabitacion(nombreHabitacion);
      }
      
      celdaInicioSeleccion = { celda, habitacion: nombreHabitacion, fecha };
      seleccionEnProgreso = true;
      // Mostrar indicador visual temporal
      celda.style.backgroundColor = 'lightblue';
      setTimeout(() => {
        if (celdaInicioSeleccion && celdaInicioSeleccion.celda === celda) {
          aplicarEstilosCeldas();
        }
      }, 300);
    }
  } else {
    // Primer clic: iniciar selección
    // Si ya hay una selección para esta habitación, eliminarla primero
    const indiceExistente = habitacionesSeleccionadas.findIndex(
      h => h.habitacion === nombreHabitacion
    );
    if (indiceExistente !== -1) {
      deseleccionarRangoHabitacion(nombreHabitacion);
    }

    celdaInicioSeleccion = { celda, habitacion: nombreHabitacion, fecha };
    seleccionEnProgreso = true;
    // Mostrar indicador visual temporal
    celda.style.backgroundColor = 'lightblue';
    setTimeout(() => {
      if (celdaInicioSeleccion && celdaInicioSeleccion.celda === celda) {
        aplicarEstilosCeldas();
      }
    }, 300);
  }
}

/**
 * Inicializa los event listeners para la selección de habitaciones al hacer clic en las celdas
 */
function inicializarSeleccionHabitaciones() {
  // Limpiar selecciones anteriores
  limpiarHabitacionesSeleccionadas();

  // Remover listeners anteriores para evitar duplicados
  document.querySelectorAll('.tabla-habitaciones tbody td').forEach(celda => {
    // Ignorar la primera celda de cada fila (fecha)
    if (celda.cellIndex === 0) return;
    
    // Clonar y reemplazar para remover listeners
    const nuevaCelda = celda.cloneNode(true);
    celda.parentNode.replaceChild(nuevaCelda, celda);
  });

  // Agregar listeners a las celdas de habitaciones (no a las de fecha)
  document.querySelectorAll('.tabla-habitaciones tbody td').forEach(celda => {
    // Ignorar la primera celda de cada fila (fecha)
    if (celda.cellIndex === 0) return;
    
    celda.addEventListener('click', () => {
      manejarClickCelda(celda);
    });

    // Cursor pointer para indicar que es clickeable
    if (celda.getAttribute('data-estado-original') !== 'reservada') {
      celda.style.cursor = 'pointer';
    }
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarSeleccionHabitaciones);
} else {
  inicializarSeleccionHabitaciones();
}

