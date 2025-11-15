

let estadiaActual = null;


const EstadoEstadia = {
  EN_CURSO: "EnCurso",
  FINALIZADA: "Finalizada"
};


function compararFechas(fecha1, fecha2) {
  if (!fecha1 || !fecha2) return 0;
  const partes1 = fecha1.split('-').map(Number);
  const partes2 = fecha2.split('-').map(Number);
  
  if (partes1[0] !== partes2[0]) return partes1[0] - partes2[0];
  if (partes1[1] !== partes2[1]) return partes1[1] - partes2[1];
  return partes1[2] - partes2[2];
}


function normalizarEstado(estado) {
  if (!estado) return '';
  return estado.toUpperCase().replace(/\s+/g, '');
}


function estaEnCurso(estado) {
  const estadoNormalizado = normalizarEstado(estado);
  return estadoNormalizado === 'ENCURSO' || estadoNormalizado === 'EN_CURSO' || estadoNormalizado === 'EN CURSO';
}


function obtenerFechaActual() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const día = String(hoy.getDate()).padStart(2, '0');
  return `${año}-${mes}-${día}`;
}


async function buscarEstadiaPorHabitacion(numeroHabitacion) {
  try {
    const respuesta = await fetch('../Datos/estadia.json');
    if (!respuesta.ok) {
      throw new Error('Error al cargar estadías');
    }
    
    const datos = await respuesta.json();
    const estadias = datos.estadias || [];
    const fechaActual = obtenerFechaActual();
    
    console.log('Buscando estadía para habitación:', numeroHabitacion);
    console.log('Fecha actual:', fechaActual);
    console.log('Total de estadías:', estadias.length);
    
    
    
    
    
    
    const estadiaEncontrada = estadias.find(estadia => {
      
      const habitaciones = estadia.reserva?.habitaciones || [];
      const tieneHabitacion = habitaciones.some(
        hab => hab.numero === parseInt(numeroHabitacion)
      );
      
      if (!tieneHabitacion) {
        return false;
      }
      
      
      const estaEnCursoEstado = estaEnCurso(estadia.estado);
      
      
      const fechaCheckInValida = estadia.fechaCheckIn && compararFechas(estadia.fechaCheckIn, fechaActual) <= 0;
      const fechaCheckOutValida = !estadia.fechaCheckOut || compararFechas(estadia.fechaCheckOut, fechaActual) >= 0;
      
      const encontrada = estaEnCursoEstado && fechaCheckInValida && fechaCheckOutValida;
      
      if (encontrada) {
        console.log('Estadía encontrada:', estadia);
      }
      
      return encontrada;
    });
    
    if (estadiaEncontrada) {
      estadiaActual = estadiaEncontrada;
      return estadiaEncontrada;
    }
    
    console.log('No se encontró estadía en curso para la habitación:', numeroHabitacion);
    return null;
  } catch (error) {
    console.error('Error al buscar estadía:', error);
    throw error;
  }
}


function obtenerEstadiaActual() {
  return estadiaActual;
}


function limpiarEstadiaActual() {
  estadiaActual = null;
}


