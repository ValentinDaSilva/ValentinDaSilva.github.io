/**
 * ResponsableDePago - Clase base abstracta que representa un responsable de pago de una factura.
 * 
 * Esta es una clase base que debe ser extendida por:
 * - PersonaFisica: Persona física (huésped)
 * - PersonaJuridica: Persona jurídica (tercero)
 */
class ResponsableDePago {
  constructor() {
    if (this.constructor === ResponsableDePago) {
      throw new Error('ResponsableDePago es una clase abstracta y no puede ser instanciada directamente');
    }
  }

  /**
   * Obtiene el nombre completo del responsable
   * Debe ser implementado por las clases hijas
   * @returns {string} Nombre completo del responsable
   */
  obtenerNombreCompleto() {
    throw new Error('El método obtenerNombreCompleto() debe ser implementado por la clase hija');
  }

  /**
   * Convierte el responsable a un objeto JSON
   * Debe ser implementado por las clases hijas
   * @returns {Object} Objeto JSON con los datos del responsable
   */
  toJSON() {
    throw new Error('El método toJSON() debe ser implementado por la clase hija');
  }

  /**
   * Crea una instancia de ResponsableDePago desde un objeto JSON
   * @param {Object} json - Objeto JSON con los datos del responsable
   * @returns {Promise<ResponsableDePago>} Instancia de PersonaFisica o PersonaJuridica
   */
  static async fromJSON(json) {
    if (!json || !json.tipo) {
      throw new Error('El objeto JSON debe tener un campo "tipo"');
    }

    if (json.tipo === 'huesped') {
      const PersonaFisica = (await import('./PersonaFisica.js')).default;
      return new PersonaFisica({
        apellido: json.apellido,
        nombres: json.nombres,
        documento: json.documento
      });
    } else if (json.tipo === 'tercero') {
      const PersonaJuridica = (await import('./PersonaJuridica.js')).default;
      return new PersonaJuridica({
        razonSocial: json.razonSocial,
        cuit: json.cuit,
        telefono: json.telefono,
        direccion: json.direccion
      });
    } else {
      throw new Error('Tipo de responsable no válido');
    }
  }
}

export default ResponsableDePago;
