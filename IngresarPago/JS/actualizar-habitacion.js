

import { obtenerHabitaciones, cargarHabitaciones } from './datos-habitaciones.js';
import { EstadoHabitacion } from '../../../Clases/Dominio/Enums.js';


export async function actualizarEstadoHabitacion(numeroHabitacion, nuevoEstado) {
  try {
    
    
    const habitaciones = obtenerHabitaciones();
    const habitacion = habitaciones.find(h => h.numero === numeroHabitacion);
    
    if (habitacion) {
      habitacion.estadoHabitacion = nuevoEstado;
      console.log(`Habitación ${numeroHabitacion} actualizada a estado: ${nuevoEstado}`);
    }
  } catch (error) {
    console.error('Error al actualizar estado de habitación:', error);
    throw error;
  }
}

