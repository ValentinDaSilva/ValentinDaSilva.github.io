import Estadia from "./Estadia.js";
import { EstadoEstadia } from "./Enums.js";

class GestorEstadia {
  constructor() { 
    this.estadias = [];
  }

  
  _obtenerSiguienteId() {
    if (this.estadias.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.estadias.map(e => e.id));
    return maxId + 1;
  }

  
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

