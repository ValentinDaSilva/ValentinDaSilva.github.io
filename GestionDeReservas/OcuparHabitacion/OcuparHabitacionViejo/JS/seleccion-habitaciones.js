


let habitacionesSeleccionadas = [];


let celdaInicioSeleccion = null; 
let seleccionEnProgreso = false;


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

  
  const fechaDesdeForm = document.getElementById('checkin').value;
  const fechaHastaForm = document.getElementById('checkout').value;
  const todasLasFechas = generarArrayFechas(fechaDesdeForm, fechaHastaForm);

  
  if (compararFechas(fechaDesde, fechaDesdeForm) < 0 || compararFechas(fechaHasta, fechaHastaForm) > 0) {
    mensajeError("El rango seleccionado debe estar dentro de las fechas del formulario");
    return;
  }

  
  const fechasRango = generarArrayFechas(fechaDesde, fechaHasta);
  const todasLibres = fechasRango.every(fecha => {
    return !estaHabitacionReservada(numeroHabitacion, fecha);
  });

  
  if (!todasLibres) {
    const checkinDate = document.getElementById('checkin').value;
    const checkoutDate = document.getElementById('checkout').value;
    
    advertencia(
      `La habitación ${habitacion} está reservada en algunas fechas del rango seleccionado.<br>Desde Fecha: ${checkinDate} <br>Hasta Fecha: ${checkoutDate}.`,
      "OCUPAR IGUAL",
      "VOLVER"
    ).then(boton => {
      if (boton !== "OCUPAR IGUAL") {
        return; 
      }
      
    });
    
    
    
  }

  
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
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarSeleccionHabitaciones);
} else {
  inicializarSeleccionHabitaciones();
}

