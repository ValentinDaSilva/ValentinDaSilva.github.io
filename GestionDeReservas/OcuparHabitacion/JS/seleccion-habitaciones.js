


let habitacionesSeleccionadas = [];


let celdaInicioSeleccion = null; 
let seleccionEnProgreso = false;

// Función para mostrar/ocultar botón Continuar
function mostrarBotonContinuar() {
  const boton = document.querySelector('.boton-continuar-ocupar');
  if (boton) {
    if (habitacionesSeleccionadas.length > 0) {
      boton.style.display = 'block';
    } else {
      boton.style.display = 'none';
    }
  }
}

// Función para inicializar el botón Continuar
function inicializarBotonContinuar() {
  const boton = document.querySelector('.boton-continuar-ocupar');
  if (!boton) return;
  
  boton.addEventListener('click', async () => {
    if (habitacionesSeleccionadas.length === 0) {
      mensajeError("Debe seleccionar al menos una habitación.");
      return;
    }
    
    // Tomar la primera selección (en CU07 solo se ocupa una habitación a la vez)
    const seleccion = habitacionesSeleccionadas[0];
    const nombreHab = seleccion.habitacion;
    const fechaDesde = seleccion.fechaDesde;
    const fechaHasta = seleccion.fechaHasta;
    
    // Llamar a UIEstadia para evaluar y continuar
    if (typeof window.UIEstadia !== 'undefined' && window.UIEstadia.manejarSeleccion) {
      await window.UIEstadia.manejarSeleccion(nombreHab, fechaDesde, fechaHasta);
    }
  });
}


function obtenerHabitacionesSeleccionadas() {
  return habitacionesSeleccionadas;
}


function limpiarHabitacionesSeleccionadas() {
  habitacionesSeleccionadas = [];
  celdaInicioSeleccion = null;
  seleccionEnProgreso = false;
  
  document.querySelectorAll('.estado-seleccionada').forEach(celda => {
    const estadoOriginal = celda.getAttribute('data-estado-original');
    celda.style.backgroundColor = '';
    celda.classList.remove('estado-seleccionada');
    celda.classList.add(estadoOriginal === 'reservada' ? 'estado-reservada' : 'estado-libre');
    aplicarEstilosCeldas();
  });
  
  mostrarBotonContinuar();
}


function obtenerCeldasHabitacion(numeroHabitacion) {
  const celdas = [];
  document.querySelectorAll('.tabla-habitaciones tbody tr').forEach(fila => {
    const celdasFila = Array.from(fila.cells);
    
    celdasFila.slice(1).forEach((celda, index) => {
      const numeroHabCelda = celda.getAttribute('data-numero-habitacion');
      if (numeroHabCelda === numeroHabitacion) {
        celdas.push(celda);
      }
    });
  });
  return celdas;
}


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


function seleccionarRangoHabitacion(habitacion, fechaDesde, fechaHasta) {
  
  if (compararFechas(fechaDesde, fechaHasta) > 0) {
    [fechaDesde, fechaHasta] = [fechaHasta, fechaDesde]; 
  }

  const numeroHabitacion = obtenerNumeroDesdeNombre(habitacion);
  if (!numeroHabitacion) return;

  
  // Obtener fechas del formulario de ocupar habitación
  const fechaDesdeForm = document.getElementById('desde')?.value || window.desdeCU07;
  const fechaHastaForm = document.getElementById('hasta')?.value || window.hastaCU07;
  const todasLasFechas = generarArrayFechas(fechaDesdeForm, fechaHastaForm);

  
  if (compararFechas(fechaDesde, fechaDesdeForm) < 0 || compararFechas(fechaHasta, fechaHastaForm) > 0) {
    mensajeError("El rango seleccionado debe estar dentro de las fechas del formulario");
    return;
  }

  
  // La evaluación de la selección se hace en UIEstadia.manejarSeleccion
  // según el diagrama de secuencia, así que solo guardamos la selección
  // y llamamos a UIEstadia para que evalúe

  
  const indiceExistente = habitacionesSeleccionadas.findIndex(
    h => h.habitacion === habitacion
  );

  if (indiceExistente !== -1) {
    
    deseleccionarRangoHabitacion(habitacion);
  }

  
  habitacionesSeleccionadas.push({
    habitacion: habitacion,
    fechaDesde: fechaDesde,
    fechaHasta: fechaHasta
  });

  
  todasLasFechas.forEach(fecha => {
    if (compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0) {
      const celda = document.querySelector(
        `.tabla-habitaciones td[data-numero-habitacion="${numeroHabitacion}"][data-fecha="${fecha}"]`
      );
      if (celda) {
        const estadoOriginal = celda.getAttribute('data-estado-original');
        
        if (estadoOriginal === 'libre' || estadoOriginal === 'reservada') {
          celda.style.backgroundColor = 'yellow';
          celda.classList.add('estado-seleccionada');
          celda.classList.remove('estado-libre', 'estado-reservada');
        }
      }
    }
  });

  // Mostrar botón "Continuar" cuando hay una selección
  mostrarBotonContinuar();
}


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
  
  mostrarBotonContinuar();
}


function manejarClickCelda(celda) {
  
  const estadoOriginal = celda.getAttribute('data-estado-original');
  if (estadoOriginal === 'fuera-servicio' || estadoOriginal === 'ocupada') {
    return;
  }

  const numeroHabitacion = celda.getAttribute('data-numero-habitacion');
  const fecha = celda.getAttribute('data-fecha');
  
  if (!numeroHabitacion || !fecha) return;

  
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

  
  const seleccionExistente = habitacionesSeleccionadas.find(
    h => h.habitacion === nombreHabitacion
  );
  
  if (seleccionExistente) {
    const fechaDesde = seleccionExistente.fechaDesde;
    const fechaHasta = seleccionExistente.fechaHasta;
    
    
    if (compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0) {
      deseleccionarRangoHabitacion(nombreHabitacion);
      celdaInicioSeleccion = null;
      seleccionEnProgreso = false;
      return;
    }
  }

  
  if (seleccionEnProgreso && celdaInicioSeleccion) {
    if (celdaInicioSeleccion.habitacion === nombreHabitacion) {
      
      seleccionarRangoHabitacion(
        nombreHabitacion,
        celdaInicioSeleccion.fecha,
        fecha
      );
      celdaInicioSeleccion = null;
      seleccionEnProgreso = false;
    } else {
      
      
      const indiceExistente = habitacionesSeleccionadas.findIndex(
        h => h.habitacion === nombreHabitacion
      );
      if (indiceExistente !== -1) {
        deseleccionarRangoHabitacion(nombreHabitacion);
      }
      
      celdaInicioSeleccion = { celda, habitacion: nombreHabitacion, fecha };
      seleccionEnProgreso = true;
      
      celda.style.backgroundColor = 'lightblue';
      setTimeout(() => {
        if (celdaInicioSeleccion && celdaInicioSeleccion.celda === celda) {
          aplicarEstilosCeldas();
        }
      }, 300);
    }
  } else {
    
    
    const indiceExistente = habitacionesSeleccionadas.findIndex(
      h => h.habitacion === nombreHabitacion
    );
    if (indiceExistente !== -1) {
      deseleccionarRangoHabitacion(nombreHabitacion);
    }

    celdaInicioSeleccion = { celda, habitacion: nombreHabitacion, fecha };
    seleccionEnProgreso = true;
    
    celda.style.backgroundColor = 'lightblue';
    setTimeout(() => {
      if (celdaInicioSeleccion && celdaInicioSeleccion.celda === celda) {
        aplicarEstilosCeldas();
      }
    }, 300);
  }
}


function inicializarSeleccionHabitaciones() {
  
  limpiarHabitacionesSeleccionadas();

  
  document.querySelectorAll('.tabla-habitaciones tbody td').forEach(celda => {
    
    if (celda.cellIndex === 0) return;
    
    
    const nuevaCelda = celda.cloneNode(true);
    celda.parentNode.replaceChild(nuevaCelda, celda);
  });

  
  document.querySelectorAll('.tabla-habitaciones tbody td').forEach(celda => {
    
    if (celda.cellIndex === 0) return;
    
    celda.addEventListener('click', () => {
      manejarClickCelda(celda);
    });
    
    
    const estadoOriginal = celda.getAttribute('data-estado-original');
    if (estadoOriginal !== 'fuera-servicio' && estadoOriginal !== 'ocupada') {
      celda.style.cursor = 'pointer';
    }
  });
  
  // Inicializar botón Continuar
  inicializarBotonContinuar();
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarSeleccionHabitaciones);
} else {
  inicializarSeleccionHabitaciones();
}

