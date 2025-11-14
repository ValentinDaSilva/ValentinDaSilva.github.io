class Pago {
  constructor(id, fecha, hora, montoTotal, medioDePago) {
    this._id = id;
    this._fecha = fecha;
    this._hora = hora;
    this._montoTotal = montoTotal;
    this._medioDePago = medioDePago; // Tipo clase MedioDePago (Efectivo, MonedaExtranjera, Cheque, Tarjeta)
  }

  get id() { return this._id; }
  set id(v) { this._id = v; }

  get fecha() { return this._fecha; }
  set fecha(v) { this._fecha = v; }

  get hora() { return this._hora; }
  set hora(v) { this._hora = v; }

  get montoTotal() { return this._montoTotal; }
  set montoTotal(v) { this._montoTotal = v; }

  get medioDePago() { return this._medioDePago; }
  set medioDePago(v) { this._medioDePago = v; }
}

export default Pago;

