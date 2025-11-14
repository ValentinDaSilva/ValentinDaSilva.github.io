class Efectivo {
  constructor(monto) {
    this._monto = monto;
  }

  get monto() { return this._monto; }
  set monto(v) { this._monto = v; }
}

export default Efectivo;

