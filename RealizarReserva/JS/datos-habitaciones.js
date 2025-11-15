

let habitaciones = [];
let reservas = [];


async function cargarHabitaciones() {
  try {
    const respuesta = await fetch('/Datos/habitaciones.json');
    const datos = await respuesta.json();
    habitaciones = datos.habitaciones || [];
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
  return reservas.some(reserva => {
    
    const habitacionesReserva = reserva.habitaciones || [];
    const tieneHabitacion = habitacionesReserva.some(hab => hab.numero === numeroHabitacion);
    
    
    if (!tieneHabitacion && reserva.numeroHabitacion !== numeroHabitacion) {
      return false;
    }
    
    
    
    const fechaDesde = reserva.fechaInicio || reserva.desde; 
    const fechaHasta = reserva.fechaFin || reserva.hasta;   
    
    
    return compararFechas(fecha, fechaDesde) >= 0 && compararFechas(fecha, fechaHasta) <= 0;
  });
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




