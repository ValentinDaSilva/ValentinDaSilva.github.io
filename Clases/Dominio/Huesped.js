import Persona from "./Persona.js";
import Direccion from "./Direccion.js";

class Huesped extends Persona {
  constructor(nombre, apellido, tipoDocumento, nroDocumento, fechaNacimiento, ocupacion, nacionalidad, cuit, email, direccion = null, condicionIVA = null) {
    super(nombre, apellido);
    this._tipoDocumento = tipoDocumento;
    this._nroDocumento = nroDocumento;
    this._fechaNacimiento = new Date(fechaNacimiento);
    this._ocupacion = ocupacion;
    this._nacionalidad = nacionalidad;
    this._cuit = cuit || '';
    this._email = email || '';
    this._direccion = direccion; // Objeto Direccion (opcional, puede ser null)
    this._condicionIVA = condicionIVA; // Opcional, puede ser null
  }

  get tipoDocumento() { return this._tipoDocumento; }
  set tipoDocumento(v) { this._tipoDocumento = v; }

  get nroDocumento() { return this._nroDocumento; }
  set nroDocumento(v) { this._nroDocumento = v; }

  get fechaNacimiento() { return this._fechaNacimiento; }
  set fechaNacimiento(v) { this._fechaNacimiento = new Date(v); }

  get ocupacion() { return this._ocupacion; }
  set ocupacion(v) { this._ocupacion = v; }

  get nacionalidad() { return this._nacionalidad; }
  set nacionalidad(v) { this._nacionalidad = v; }

  get cuit() { return this._cuit; }
  set cuit(v) { this._cuit = v; }

  get email() { return this._email; }
  set email(v) { this._email = v; }

  get direccion() { return this._direccion; }
  set direccion(v) { this._direccion = v; }

  get condicionIVA() { return this._condicionIVA; }
  set condicionIVA(v) { this._condicionIVA = v; }

  verificarMayorEdad() {
    const hoy = new Date();
    const edad = hoy.getFullYear() - this._fechaNacimiento.getFullYear();
    return edad >= 18;
  }
}

export default Huesped;

