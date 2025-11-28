class Direccion {
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

  get calle() { return this._calle; }
  set calle(v) { this._calle = v; }

  get numero() { return this._numero; }
  set numero(v) { this._numero = v; }

  get piso() { return this._piso; }
  set piso(v) { this._piso = v; }

  get departamento() { return this._departamento; }
  set departamento(v) { this._departamento = v; }

  get localidad() { return this._localidad; }
  set localidad(v) { this._localidad = v; }

  get ciudad() { return this._localidad; }
  set ciudad(v) { this._localidad = v; }

  get provincia() { return this._provincia; }
  set provincia(v) { this._provincia = v; }

  get codigoPostal() { return this._codigoPostal; }
  set codigoPostal(v) { this._codigoPostal = v; }

  get pais() { return this._pais; }
  set pais(v) { this._pais = v; }
}

export default Direccion;

