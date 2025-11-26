import ResponsableDePago from './ResponsableDePago.js';
import Direccion from './Direccion.js';

/**
 * PersonaJuridica - Clase que representa un responsable de pago que es una persona jurídica (tercero).
 * 
 * Hereda de ResponsableDePago.
 * 
 */
class PersonaJuridica extends ResponsableDePago {
  /**
   * Constructor para PersonaJuridica
   * @param {Object} datos - Datos de la persona jurídica
   * @param {string} datos.razonSocial - Razón social (requerido)
   * @param {string} datos.cuit - CUIT (requerido)
   * @param {string} datos.telefono - Teléfono (requerido)
   * @param {Direccion|Object} datos.direccion - Dirección (requerido)
   */
  constructor(datos) {
    super();
    
    if (!datos.razonSocial || !datos.cuit || !datos.telefono || !datos.direccion) {
      throw new Error('Para una PersonaJuridica se requieren: razonSocial, cuit, telefono y direccion');
    }

    this._razonSocial = datos.razonSocial;
    this._cuit = datos.cuit;
    this._telefono = datos.telefono;
    
    // Convertir direccion a instancia de Direccion si es necesario
    if (datos.direccion instanceof Direccion) {
      this._direccion = datos.direccion;
    } else {
      // Crear instancia de Direccion desde objeto
      this._direccion = new Direccion(
        datos.direccion.calle,
        datos.direccion.numero,
        datos.direccion.piso,
        datos.direccion.departamento,
        datos.direccion.localidad,
        datos.direccion.provincia,
        datos.direccion.codigoPostal,
        datos.direccion.pais
      );
    }
  }

  // Getters y Setters
  get razonSocial() {
    return this._razonSocial;
  }

  set razonSocial(v) {
    if (!v || v.trim() === '') {
      throw new Error('La razón social no puede estar vacía');
    }
    this._razonSocial = v;
  }

  get cuit() {
    return this._cuit;
  }

  set cuit(v) {
    if (!v || v.trim() === '') {
      throw new Error('El CUIT no puede estar vacío');
    }
    this._cuit = v;
  }

  get telefono() {
    return this._telefono;
  }

  set telefono(v) {
    if (!v || v.trim() === '') {
      throw new Error('El teléfono no puede estar vacío');
    }
    this._telefono = v;
  }

  get direccion() {
    return this._direccion;
  }

  set direccion(v) {
    if (!v) {
      throw new Error('La dirección es requerida');
    }
    if (v instanceof Direccion) {
      this._direccion = v;
    } else {
      this._direccion = new Direccion(
        v.calle,
        v.numero,
        v.piso,
        v.departamento,
        v.localidad,
        v.provincia,
        v.codigoPostal,
        v.pais
      );
    }
  }

  /**
   * Obtiene el nombre completo de la persona jurídica (razón social)
   * @returns {string} Razón social
   */
  obtenerNombreCompleto() {
    return this._razonSocial || '';
  }

  /**
   * Convierte la persona jurídica a un objeto JSON
   * @returns {Object} Objeto JSON con los datos de la persona jurídica
   */
  toJSON() {
    return {
      tipo: 'tercero',
      razonSocial: this._razonSocial,
      cuit: this._cuit,
      telefono: this._telefono,
      direccion: this._direccion ? {
        calle: this._direccion.calle,
        numero: this._direccion.numero,
        piso: this._direccion.piso,
        departamento: this._direccion.departamento,
        localidad: this._direccion.localidad,
        provincia: this._direccion.provincia,
        codigoPostal: this._direccion.codigoPostal,
        pais: this._direccion.pais
      } : null
    };
  }
}

export default PersonaJuridica;

