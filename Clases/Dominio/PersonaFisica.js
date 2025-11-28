import ResponsableDePago from './ResponsableDePago.js';

/**
 * PersonaFisica - Clase que representa un responsable de pago que es una persona física (huésped).
 * 
 * Hereda de ResponsableDePago.
 */
class PersonaFisica extends ResponsableDePago {
  
  constructor(datos) {
    super();
    
    if (!datos.apellido || !datos.nombre || !datos.documento) {
      throw new Error('Para una PersonaFisica se requieren: apellido, nombre y documento');
    }

    this._apellido = datos.apellido;
    this._nombre = datos.nombre;
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

  get nombre() {
    return this._nombre;
  }

  set nombre(v) {
    if (!v || v.trim() === '') {
      throw new Error('Los nombre no pueden estar vacíos');
    }
    this._nombre = v;
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
   * @returns {string} Nombre completo en formato "apellido, nombre"
   */
  obtenerNombreCompleto() {
    return `${this._apellido || ''}, ${this._nombre || ''}`.trim();
  }

  /**
   * Convierte la persona física a un objeto JSON
   * @returns {Object} Objeto JSON con los datos de la persona física
   */
  toJSON() {
    return {
      tipo: 'huesped',
      apellido: this._apellido,
      nombre: this._nombre,
      documento: this._documento
    };
  }
}

export default PersonaFisica;

