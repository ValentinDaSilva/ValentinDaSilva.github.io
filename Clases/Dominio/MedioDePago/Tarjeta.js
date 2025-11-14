class Tarjeta {
  constructor(tipo, numeroTarjeta, monto) {
    this._tipo = tipo; // VISA, MASTERCARD, AMEX, CABAL, NARANJA
    this._numeroTarjeta = numeroTarjeta;
    this._monto = monto;
  }

  get tipo() { return this._tipo; }
  set tipo(v) { this._tipo = v; }

  get numeroTarjeta() { return this._numeroTarjeta; }
  set numeroTarjeta(v) { this._numeroTarjeta = v; }

  get monto() { return this._monto; }
  set monto(v) { this._monto = v; }
}

export default Tarjeta;

