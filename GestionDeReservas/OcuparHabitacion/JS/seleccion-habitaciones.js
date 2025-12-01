


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
  
  // Remover listeners anteriores para evitar duplicados
  const nuevoBoton = boton.cloneNode(true);
  boton.parentNode.replaceChild(nuevoBoton, boton);
  
  nuevoBoton.addEventListener('click', async () => {
    if (habitacionesSeleccionadas.length === 0) {
      if (typeof mensajeError === "function") {
        mensajeError("Debe seleccionar al menos una habitación.");
      }
      return;
    }
    
    // Deshabilitar botón mientras se procesa
    nuevoBoton.disabled = true;
    
    try {
      console.log("🔍 Botón Continuar presionado - Selecciones:", habitacionesSeleccionadas.length);
      
      // Llamar a UIEstadia para procesar TODAS las selecciones
      if (typeof window.UIEstadia !== 'undefined' && window.UIEstadia.manejarMultiplesSelecciones) {
        await window.UIEstadia.manejarMultiplesSelecciones(habitacionesSeleccionadas);
      } else {
        console.error("❌ UIEstadia.manejarMultiplesSelecciones no está disponible");
        if (typeof mensajeError === "function") {
          mensajeError("Error: No se pudo procesar las selecciones.");
        }
      }
    } catch (error) {
      console.error("❌ Error al procesar selecciones:", error);
      if (typeof mensajeError === "function") {
        mensajeError("Error al procesar las selecciones: " + error.message);
      }
    } finally {
      nuevoBoton.disabled = false;
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

  
  // Verificar que todas las celdas del rango estén reservadas o libres (no ocupadas)
  let todasValidas = true;
  let hayOcupadas = false;
  let hayReservadas = false;
  let hayLibres = false;
  
  todasLasFechas.forEach(fecha => {
    if (compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0) {
      const celda = document.querySelector(
        `.tabla-habitaciones td[data-numero-habitacion="${numeroHabitacion}"][data-fecha="${fecha}"]`
      );
      if (celda) {
        const estadoOriginal = celda.getAttribute('data-estado-original');
        if (estadoOriginal === 'ocupada') {
          hayOcupadas = true;
          todasValidas = false;
        } else if (estadoOriginal === 'reservada') {
          hayReservadas = true;
        } else if (estadoOriginal === 'libre') {
          hayLibres = true;
        } else if (estadoOriginal === 'fuera-servicio') {
          todasValidas = false;
        }
      }
    }
  });

  // Si hay celdas ocupadas en el rango, no permitir la selección
  if (hayOcupadas) {
    mensajeError("El rango seleccionado contiene días ocupados (reservas confirmadas). No se puede seleccionar.");
    // Remover la selección que se agregó
    const indice = habitacionesSeleccionadas.findIndex(h => h.habitacion === habitacion);
    if (indice !== -1) {
      habitacionesSeleccionadas.splice(indice, 1);
    }
    mostrarBotonContinuar();
    return;
  }

  // El rango debe estar completamente libre O completamente reservado (no mezclado)
  if (hayReservadas && hayLibres) {
    mensajeError("El rango seleccionado contiene días mezclados (algunos libres y algunos reservados). Seleccione un rango completamente libre o completamente reservado.");
    // Remover la selección que se agregó
    const indice = habitacionesSeleccionadas.findIndex(h => h.habitacion === habitacion);
    if (indice !== -1) {
      habitacionesSeleccionadas.splice(indice, 1);
    }
    mostrarBotonContinuar();
    return;
  }

  // Todas las celdas están reservadas o libres, proceder con la selección visual
  todasLasFechas.forEach(fecha => {
    if (compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0) {
      const celda = document.querySelector(
        `.tabla-habitaciones td[data-numero-habitacion="${numeroHabitacion}"][data-fecha="${fecha}"]`
      );
      if (celda) {
        const estadoOriginal = celda.getAttribute('data-estado-original');
        
        if (estadoOriginal === 'reservada' || estadoOriginal === 'libre') {
          celda.style.backgroundColor = 'yellow';
          celda.classList.add('estado-seleccionada');
          celda.classList.remove('estado-reservada', 'estado-libre');
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
      // Restaurar el estado original correcto
      if (estadoOriginal === 'reservada') {
        celda.classList.add('estado-reservada');
      } else if (estadoOriginal === 'ocupada') {
        celda.classList.add('estado-ocupada');
      } else {
        celda.classList.add('estado-libre');
      }
      aplicarEstilosCeldas();
    }
  });
  
  mostrarBotonContinuar();
}


function manejarClickCelda(celda) {
  
  const estadoOriginal = celda.getAttribute('data-estado-original');
  // Se pueden seleccionar celdas RESERVADAS o LIBRES (no ocupadas, no fuera de servicio)
  if (estadoOriginal === 'ocupada' || estadoOriginal === 'fuera-servicio') {
    if (estadoOriginal === 'ocupada') {
      mensajeError("Esta habitación ya está ocupada (reserva confirmada). No se puede seleccionar.");
    }
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
    // Las celdas RESERVADAS y LIBRES son clicables para ocupar
    if (estadoOriginal === 'reservada' || estadoOriginal === 'libre') {
      celda.style.cursor = 'pointer';
    } else {
      celda.style.cursor = 'not-allowed';
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

