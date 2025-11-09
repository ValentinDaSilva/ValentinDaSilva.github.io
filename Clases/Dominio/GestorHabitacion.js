import Habitacion from "./Habitacion.js";
import EstadoHabitacion from "./EstadoHabitacion.js";
// HabitacionDTO se importa desde el archivo dto.js que se carga antes en los HTML

class GestorHabitacion {
  constructor() {
    this._rutaBD = '/Datos/habitaciones.json';
  }

  /**
   * Convierte una Habitacion de dominio a HabitacionDTO
   * @param {Habitacion} habitacion - Objeto Habitacion de dominio
   * @returns {HabitacionDTO} - Objeto HabitacionDTO
   */
  _convertirHabitacionADTO(habitacion) {
    return new HabitacionDTO(
      habitacion.numero,
      habitacion.tipo,
      habitacion.categoria,
      habitacion.costoPorNoche,
      habitacion.estadoHabitacion
    );
  }

  /**
   * Convierte un HabitacionDTO a Habitacion de dominio
   * @param {HabitacionDTO} habitacionDTO - Objeto HabitacionDTO
   * @returns {Habitacion} - Objeto Habitacion de dominio
   */
  _convertirDTOAHabitacion(habitacionDTO) {
    return new Habitacion(
      habitacionDTO.numero,
      habitacionDTO.tipo,
      habitacionDTO.categoria || '',
      habitacionDTO.costoPorNoche,
      habitacionDTO.estadoHabitacion || EstadoHabitacion.DISPONIBLE
    );
  }

  /**
   * Lee las habitaciones desde el archivo JSON (base de datos)
   * @returns {Promise<Array>} - Array de objetos HabitacionDTO
   */
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

  /**
   * Carga las habitaciones desde la base de datos y las convierte a objetos de dominio
   * @returns {Promise<Array<Habitacion>>} - Array de objetos Habitacion de dominio
   */
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

