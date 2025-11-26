import ResponsableDePago from './ResponsableDePago.js';

/**
 * PersonaFisica - Clase que representa un responsable de pago que es una persona física (huésped).
 * 
 * Hereda de ResponsableDePago.
 */
class PersonaFisica extends ResponsableDePago {
  
  constructor(datos) {
    super();
    
    if (!datos.apellido || !datos.nombres || !datos.documento) {
      throw new Error('Para una PersonaFisica se requieren: apellido, nombres y documento');
    }

    this._apellido = datos.apellido;
    this._nombres = datos.nombres;
    this._documento = datos.documento;
  }

  // Getters y Setters
  get apellido() {
    return this._apellido;
  }

  set apellido(v) {
    if (!v || v.trim() === '') {
      throw new Error('El apellido no puede estar vacío');
    }
    this._apellido = v;
  }

  get nombres() {
    return this._nombres;
  }

  set nombres(v) {
    if (!v || v.trim() === '') {
      throw new Error('Los nombres no pueden estar vacíos');
    }
    this._nombres = v;
  }

  get documento() {
    return this._documento;
  }

  set documento(v) {
    if (!v || v.trim() === '') {
      throw new Error('El documento no puede estar vacío');
    }
    this._documento = v;
  }

  /**
   * Obtiene el nombre completo de la persona física
   * @returns {string} Nombre completo en formato "apellido, nombres"
   */
  obtenerNombreCompleto() {
    return `${this._apellido || ''}, ${this._nombres || ''}`.trim();
  }

  /**
   * Convierte la persona física a un objeto JSON
   * @returns {Object} Objeto JSON con los datos de la persona física
   */
  toJSON() {
    return {
      tipo: 'huesped',
      apellido: this._apellido,
      nombres: this._nombres,
      documento: this._documento
    };
  }
}

export default PersonaFisica;

