class MonedaExtranjera {
  constructor(tipoMoneda, montoExtranjero, cotizacion, monto) {
    this._tipoMoneda = tipoMoneda; 
    this._montoExtranjero = montoExtranjero;
    this._cotizacion = cotizacion;
    this._monto = monto; 
  }

  get tipoMoneda() { return this._tipoMoneda; }
  set tipoMoneda(v) { this._tipoMoneda = v; }

  get montoExtranjero() { return this._montoExtranjero; }
  set montoExtranjero(v) { this._montoExtranjero = v; }

  get cotizacion() { return this._cotizacion; }
  set cotizacion(v) { this._cotizacion = v; }

  get monto() { return this._monto; }
  set monto(v) { this._monto = v; }
}

export default MonedaExtranjera;

