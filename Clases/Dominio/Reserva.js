import EstadoReserva from "./EstadoReserva.js";

class Reserva {
  constructor(id, fechaInicio, fechaFin, titular, estado = EstadoReserva.PENDIENTE) {
    this._id = id;
    this._fechaInicio = new Date(fechaInicio);
    this._fechaFin = new Date(fechaFin);
    this._titular = titular;
    this._estado = estado;
    this._habitaciones = [];
  }

  get id() { return this._id; }
  set id(v) { this._id = v; }

  get fechaInicio() { return this._fechaInicio; }
  set fechaInicio(v) { this._fechaInicio = new Date(v); }

  get fechaFin() { return this._fechaFin; }
  set fechaFin(v) { this._fechaFin = new Date(v); }

  get titular() { return this._titular; }
  set titular(v) { this._titular = v; }

  get estado() { return this._estado; }
  set estado(v) { this._estado = v; }

  get habitaciones() { return this._habitaciones; }
  set habitaciones(v) { this._habitaciones = v; }
}

export default Reserva;

