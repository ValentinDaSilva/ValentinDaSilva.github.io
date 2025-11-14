class Cheque {
  constructor(numero, monto, fechaVencimiento) {
    this._numero = numero;
    this._monto = monto;
    this._fechaVencimiento = fechaVencimiento;
  }

  get numero() { return this._numero; }
  set numero(v) { this._numero = v; }

  get monto() { return this._monto; }
  set monto(v) { this._monto = v; }

  get fechaVencimiento() { return this._fechaVencimiento; }
  set fechaVencimiento(v) { this._fechaVencimiento = v; }
}

export default Cheque;

