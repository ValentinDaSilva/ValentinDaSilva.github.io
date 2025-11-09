import EstadoEstadia from "./EstadoEstadia.js";

class Estadia {
  constructor(id, fechaCheckIn, fechaCheckOut, estado = EstadoEstadia.EN_CURSO, reserva, titular, acompaniantes) {
    this._id = id;
    this._fechaCheckIn = new Date(fechaCheckIn);
    this._fechaCheckOut = new Date(fechaCheckOut);
    this._estado = estado;
    this._consumos = [];
    this._reserva = reserva; //Tipo clase Reserva
    this._titular = titular; //Tipo clase Huesped
    this._acompaniantes = acompaniantes; //Tipo array de clase Huesped
  }

  get id() { return this._id; }
  set id(v) { this._id = v; }

  get fechaCheckIn() { return this._fechaCheckIn; }
  set fechaCheckIn(v) { this._fechaCheckIn = new Date(v); }

  get fechaCheckOut() { return this._fechaCheckOut; }
  set fechaCheckOut(v) { this._fechaCheckOut = new Date(v); }

  get estado() { return this._estado; }
  set estado(v) { this._estado = v; }

  get consumos() { return this._consumos; }
  set consumos(v) { this._consumos = v; }


  get reserva() { return this._reserva; }
  set reserva(v) { this._reserva = v; }

  get titular() { return this._titular; }
  set titular(v) { this._titular = v; }

  get acompaniantes() { return this._acompaniantes; }
  set acompaniantes(v) { this._acompaniantes = v; }

  //Metodos
  registrarCheckIn(fecha) {
    this._fechaCheckIn = new Date(fecha);
    this._estado = EstadoEstadia.EN_CURSO;
  }

  registrarCheckOut(fecha) {
    this._fechaCheckOut = new Date(fecha);
    this._estado = EstadoEstadia.FINALIZADA;
  }

  agregarConsumos(descripcion, monto) {
    this._consumos.push({ descripcion, monto, fecha: new Date() });
  }

  verConsumos() {
    return this._consumos;
  }
}

export default Estadia;

