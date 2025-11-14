import Estadia from "./Estadia.js";
import { EstadoEstadia } from "./Enums.js";

class GestorEstadia {
  constructor() { 
    this.estadias = [];
  }

  /**
   * Obtiene el siguiente ID disponible para una nueva estadía
   * @returns {number} - El siguiente ID disponible
   */
  _obtenerSiguienteId() {
    if (this.estadias.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.estadias.map(e => e.id));
    return maxId + 1;
  }

  /**
   * Crea una nueva estadía con reserva, titular y acompañantes
   * @param {Reserva} reserva - Objeto Reserva al que hace referencia la estadía
   * @param {Huesped} titular - Huésped titular de la estadía
   * @param {Array<Huesped>} acompaniantes - Array de acompañantes (puede estar vacío)
   * @param {string} fechaCheckIn - Fecha de check-in en formato YYYY-MM-DD
   * @param {string} fechaCheckOut - Fecha de check-out en formato YYYY-MM-DD (opcional, puede ser null)
   * @returns {Estadia} - La estadía creada
   */
  crearEstadia(reserva, titular, acompaniantes = [], fechaCheckIn, fechaCheckOut = null) {
    const siguienteId = this._obtenerSiguienteId();
    const estadia = new Estadia(
      siguienteId,
      fechaCheckIn,
      fechaCheckOut,
      EstadoEstadia.EN_CURSO,
      reserva,
      titular,
      acompaniantes
    );
    this.estadias.push(estadia);
    return estadia;
  }

  registrarCheckIn(fecha, habitaciones) {
    const e = new Estadia(this.estadias.length + 1, fecha, null);
    e.habitaciones = habitaciones;
    this.estadias.push(e);
  }

  registrarCheckOut(id, fecha) {
    const e = this.estadias.find(est => est.id === id);
    if (e) e.registrarCheckOut(fecha);
  }

  agregarConsumos(id, descripcion, monto) {
    const e = this.estadias.find(est => est.id === id);
    if (e) e.agregarConsumos(descripcion, monto);
  }

  verConsumos(id) {
    const e = this.estadias.find(est => est.id === id);
    return e ? e.verConsumos() : [];
  }
}

export default GestorEstadia;

