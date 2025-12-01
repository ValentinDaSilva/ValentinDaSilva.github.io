
let habitaciones = [];
let reservas = [];


async function cargarHabitaciones() {
  try {
    const respuesta = await fetch('/Datos/habitaciones.json');
    const datos = await respuesta.json();
    habitaciones = datos.habitaciones || [];
    console.log('Habitaciones cargadas:', habitaciones);
  } catch (error) {
    console.error('Error al cargar habitaciones:', error);
    mensajeError('Error al cargar los datos de habitaciones.');
    habitaciones = [];
  }
}


async function cargarReservas() {
  try {
    const respuesta = await fetch('/Datos/reservas.json');
    const datos = await respuesta.json();
    reservas = datos.reservas || [];
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    mensajeError('Error al cargar los datos de reservas.');
    reservas = [];
  }
}


async function cargarTodosLosDatos() {
  await Promise.all([cargarHabitaciones(), cargarReservas()]);
}


function obtenerHabitaciones() {
  return habitaciones;
}


function obtenerReservas() {
  return reservas;
}


function compararFechas(fecha1, fecha2) {
  const partes1 = fecha1.split('-').map(Number);
  const partes2 = fecha2.split('-').map(Number);
  
  if (partes1[0] !== partes2[0]) return partes1[0] - partes2[0];
  if (partes1[1] !== partes2[1]) return partes1[1] - partes2[1];
  return partes1[2] - partes2[2];
}


function estaHabitacionReservada(numeroHabitacion, fecha) {
  // Usar reservas del backend (obtenidas por GestorEstadia) si están disponibles
  const reservasParaUsar = window.listaReservasCU07 || reservas || [];
  
  if (!reservasParaUsar || reservasParaUsar.length === 0) {
    return false;
  }
  
  // Convertir numeroHabitacion a número si es string para comparación correcta
  const numHab = typeof numeroHabitacion === 'string' ? parseInt(numeroHabitacion, 10) : numeroHabitacion;
  
  return reservasParaUsar.some(reserva => {
    if (!reserva) return false;
    
    // Verificar si la reserva tiene esta habitación
    const habitacionesReserva = reserva.habitaciones || [];
    let tieneHabitacion = habitacionesReserva.some(hab => {
      if (!hab) return false;
      const numHabReserva = typeof hab.numero === 'string' ? parseInt(hab.numero, 10) : hab.numero;
      return numHabReserva === numHab;
    });
    
    // También verificar si hay un campo directo numeroHabitacion
    if (!tieneHabitacion && reserva.numeroHabitacion !== undefined) {
      const numHabDirecto = typeof reserva.numeroHabitacion === 'string' 
        ? parseInt(reserva.numeroHabitacion, 10) 
        : reserva.numeroHabitacion;
      tieneHabitacion = (numHabDirecto === numHab);
    }
    
    // Si no tiene la habitación, no es esta reserva
    if (!tieneHabitacion) {
      return false;
    }
    
    // Verificar que la fecha esté en el rango de la reserva
    const fechaDesde = reserva.fechaInicio || reserva.desde; 
    const fechaHasta = reserva.fechaFin || reserva.hasta;
    
    if (!fechaDesde || !fechaHasta) {
      return false;
    }
    
    const fechaEnRango = compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0;
    return fechaEnRango;
  });
}


// Obtener el estado de la reserva para una habitación y fecha específica
// Retorna: 'ocupada' si el estado es "Confirmada" o "Finalizada", 'reservada' si es "Pendiente", null si no hay reserva
function obtenerEstadoReservaHabitacion(numeroHabitacion, fecha) {
  // Usar reservas del backend (obtenidas por GestorEstadia) si están disponibles
  const reservasParaUsar = window.listaReservasCU07 || reservas || [];
  
  // Debug: log detallado para primera llamada
  if (!window._debugObtenidoEstado) {
    window._debugObtenidoEstado = true;
    console.log("🔍 obtenerEstadoReservaHabitacion - Primera llamada:");
    console.log("  - window.listaReservasCU07:", window.listaReservasCU07);
    console.log("  - reservas (local):", reservas);
    console.log("  - reservasParaUsar:", reservasParaUsar);
    console.log("  - Cantidad de reservas:", reservasParaUsar?.length || 0);
  }
  
  if (!reservasParaUsar || reservasParaUsar.length === 0) {
    return null;
  }
  
  // Convertir numeroHabitacion a número si es string para comparación correcta
  const numHab = typeof numeroHabitacion === 'string' ? parseInt(numeroHabitacion, 10) : numeroHabitacion;
  
  if (isNaN(numHab)) {
    console.warn("⚠️ obtenerEstadoReservaHabitacion: número de habitación inválido:", numeroHabitacion);
    return null;
  }
  
  for (const reserva of reservasParaUsar) {
    if (!reserva) continue;
    
    // Verificar si la reserva tiene esta habitación
    const habitacionesReserva = reserva.habitaciones || [];
    let tieneHabitacion = habitacionesReserva.some(hab => {
      if (!hab) return false;
      const numHabReserva = typeof hab.numero === 'string' ? parseInt(hab.numero, 10) : hab.numero;
      return numHabReserva === numHab;
    });
    
    // También verificar si hay un campo directo numeroHabitacion
    if (!tieneHabitacion && reserva.numeroHabitacion !== undefined) {
      const numHabDirecto = typeof reserva.numeroHabitacion === 'string' 
        ? parseInt(reserva.numeroHabitacion, 10) 
        : reserva.numeroHabitacion;
      tieneHabitacion = (numHabDirecto === numHab);
    }
    
    // Si no tiene la habitación, continuar con la siguiente reserva
    if (!tieneHabitacion) {
      continue;
    }
    
    // Verificar que la fecha esté en el rango de la reserva
    const fechaDesde = reserva.fechaInicio || reserva.desde; 
    const fechaHasta = reserva.fechaFin || reserva.hasta;
    
    if (!fechaDesde || !fechaHasta) {
      continue;
    }
    
    const fechaEnRango = compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0;
    if (fechaEnRango) {
      // Verificar el estado de la reserva
      const estadoReserva = (reserva.estado || "").trim();
      const estadoLower = estadoReserva.toLowerCase();
      if (estadoLower === "confirmada" || estadoLower === "finalizada") {
        return 'ocupada';
      } else {
        // Cualquier otro estado (Pendiente, etc.) se considera reservada
        return 'reservada';
      }
    }
  }
  
  return null;
}


function obtenerNumeroDesdeNombre(nombreHabitacion) {
  const partes = nombreHabitacion.split('-');
  if (partes.length === 2) {
    const numero = parseInt(partes[1], 10);
    return isNaN(numero) ? null : numero;
  }
  return null;
}


function formatearNombreHabitacion(habitacion) {
  return `${habitacion.tipo}-${habitacion.numero}`;
}


function generarArrayFechas(fechaInicio, fechaFin) {
  const fechas = [];
  
  const partesInicio = fechaInicio.split('-').map(Number);
  const partesFin = fechaFin.split('-').map(Number);
  
  const inicio = new Date(partesInicio[0], partesInicio[1] - 1, partesInicio[2]);
  const fin = new Date(partesFin[0], partesFin[1] - 1, partesFin[2]);
  
  const fechaActual = new Date(inicio);
  
  while (fechaActual <= fin) {
    const año = fechaActual.getFullYear();
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    fechas.push(`${año}-${mes}-${dia}`);
    
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  
  return fechas;
}


function formatearFechaParaMostrar(fecha) {
  const partes = fecha.split('-').map(Number);
  const dia = String(partes[2]).padStart(2, '0');
  const mes = String(partes[1]).padStart(2, '0');
  const año = partes[0];
  return `${dia}/${mes}/${año}`;
}


let datosCargados = false;


function asegurarDatosCargados() {
  if (datosCargados && habitaciones.length > 0) {
    return Promise.resolve();
  }
  
  return cargarTodosLosDatos().then(() => {
    datosCargados = true;
  });
}

