

let reservas = [];


async function cargarReservas() {
  try {
    const respuesta = await fetch('/Datos/reservas.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    reservas = datos.reservas || [];
    console.log('Reservas cargadas:', reservas.length);
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    
    reservas = [];
  }
}


function obtenerReservas() {
  return reservas;
}


function extraerApellido(reserva) {
  if (!reserva) return '';
  
  if (typeof reserva === 'object' && reserva.titular && reserva.titular.apellido) {
    return reserva.titular.apellido.toUpperCase();
  }
  
  if (typeof reserva === 'string') {
    const partes = reserva.split(',');
    return partes[0] ? partes[0].trim().toUpperCase() : '';
  }
  
  if (typeof reserva === 'object' && reserva.responsable) {
    const partes = reserva.responsable.split(',');
    return partes[0] ? partes[0].trim().toUpperCase() : '';
  }
  return '';
}


function extraerNombre(reserva) {
  if (!reserva) return '';
  
  if (typeof reserva === 'object' && reserva.titular && reserva.titular.nombre) {
    return reserva.titular.nombre.toUpperCase();
  }
  
  if (typeof reserva === 'string') {
    const partes = reserva.split(',');
    return partes[1] ? partes[1].trim().toUpperCase() : '';
  }
  
  if (typeof reserva === 'object' && reserva.responsable) {
    const partes = reserva.responsable.split(',');
    return partes[1] ? partes[1].trim().toUpperCase() : '';
  }
  return '';
}


async function asegurarReservasCargadas() {
  if (reservas.length === 0) {
    await cargarReservas();
  }
}


cargarReservas();
