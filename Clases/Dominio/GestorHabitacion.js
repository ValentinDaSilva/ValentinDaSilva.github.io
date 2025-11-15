import Habitacion from "./Habitacion.js";
import { EstadoHabitacion } from "./Enums.js";


class GestorHabitacion {
  constructor() {
    this._rutaBD = '/Datos/habitaciones.json';
  }

  
  _convertirHabitacionADTO(habitacion) {
    return new HabitacionDTO(
      habitacion.numero,
      habitacion.tipo,
      habitacion.categoria,
      habitacion.costoPorNoche,
      habitacion.estadoHabitacion
    );
  }

  
  _convertirDTOAHabitacion(habitacionDTO) {
    return new Habitacion(
      habitacionDTO.numero,
      habitacionDTO.tipo,
      habitacionDTO.categoria || '',
      habitacionDTO.costoPorNoche,
      habitacionDTO.estadoHabitacion || EstadoHabitacion.DISPONIBLE
    );
  }

  
  async _leerHabitacionesDesdeBD() {
    try {
      const respuesta = await fetch(this._rutaBD);
      if (!respuesta.ok) {
        throw new Error(`Error al leer habitaciones: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      return datos.habitaciones || [];
    } catch (error) {
      console.error('Error al leer habitaciones desde BD:', error);
      throw error;
    }
  }

  
  async cargarHabitacionesDesdeBD() {
    try {
      const habitacionesDTO = await this._leerHabitacionesDesdeBD();
      return habitacionesDTO.map(dto => this._convertirDTOAHabitacion(dto));
    } catch (error) {
      console.error('Error al cargar habitaciones desde BD:', error);
      throw error;
    }
  }
}

export default GestorHabitacion;

