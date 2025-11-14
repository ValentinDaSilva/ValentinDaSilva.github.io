/* Actualización del estado de habitaciones */

import { obtenerHabitaciones, cargarHabitaciones } from './datos-habitaciones.js';
import { EstadoHabitacion } from '../../../Clases/Dominio/Enums.js';

/**
 * Actualiza el estado de una habitación
 * @param {number} numeroHabitacion - Número de habitación
 * @param {string} nuevoEstado - Nuevo estado de la habitación
 * @returns {Promise<void>}
 */
export async function actualizarEstadoHabitacion(numeroHabitacion, nuevoEstado) {
  try {
    // En un entorno real, esto se haría con una llamada al servidor
    // Por ahora, solo se actualiza en memoria
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

