export class Direccion {
  constructor(calle, numero, piso, departamento, localidad, provincia, codigoPostal, pais) {
    this._calle = calle;
    this._numero = numero;
    this._piso = piso || '';
    this._departamento = departamento || '';
    this._localidad = localidad;
    this._provincia = provincia;
    this._codigoPostal = codigoPostal;
    this._pais = pais;
  }

  // MÉTODOS GET
  getCalle() { return this._calle; }
  getNumero() { return this._numero; }
  getPiso() { return this._piso; }
  getDepartamento() { return this._departamento; }
  getLocalidad() { return this._localidad; }
  getProvincia() { return this._provincia; }
  getCodigoPostal() { return this._codigoPostal; }
  getPais() { return this._pais; }

  // MÉTODOS SET
  setCalle(v) { this._calle = v; }
  setNumero(v) { this._numero = v; }
  setPiso(v) { this._piso = v; }
  setDepartamento(v) { this._departamento = v; }
  setLocalidad(v) { this._localidad = v; }
  setProvincia(v) { this._provincia = v; }
  setCodigoPostal(v) { this._codigoPostal = v; }
  setPais(v) { this._pais = v; }
}

export default Direccion;
