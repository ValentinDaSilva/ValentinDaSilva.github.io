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
    this._direccion = direccion; 
    this._condicionIVA = condicionIVA; 
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

  calcularEdad() {
    if (!this._fechaNacimiento) {
      return 0;
    }
    
    const hoy = new Date();
    const fechaNac = new Date(this._fechaNacimiento);
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    // Ajustar si aún no cumplió años este año
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  }

  /**
   * Verifica si el huésped es mayor de edad (18 años o más)
   * @returns {boolean} true si es mayor de edad, false en caso contrario
   */
  verificarMayorEdad() {
    return this.calcularEdad() >= 18;
  }
}

export default Huesped;

