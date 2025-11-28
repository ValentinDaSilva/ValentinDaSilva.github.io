export class Direccion {
  constructor(calle, numero, piso, departamento, localidad, provincia, codigoPostal, pais) {
    this.calle = calle;
    this.numero = numero;
    this.piso = piso || '';
    this.departamento = departamento || '';
    this.localidad = localidad;
    this.provincia = provincia;
    this.codigoPostal = codigoPostal;
    this.pais = pais;
  }

  // MÉTODOS GET
  getCalle() { return this.calle; }
  getNumero() { return this.numero; }
  getPiso() { return this.piso; }
  getDepartamento() { return this.departamento; }
  getLocalidad() { return this.localidad; }
  getProvincia() { return this.provincia; }
  getCodigoPostal() { return this.codigoPostal; }
  getPais() { return this.pais; }

  // MÉTODOS SET
  setCalle(v) { this.calle = v; }
  setNumero(v) { this.numero = v; }
  setPiso(v) { this.piso = v; }
  setDepartamento(v) { this.departamento = v; }
  setLocalidad(v) { this.localidad = v; }
  setProvincia(v) { this.provincia = v; }
  setCodigoPostal(v) { this.codigoPostal = v; }
  setPais(v) { this.pais = v; }
}

export default Direccion;
