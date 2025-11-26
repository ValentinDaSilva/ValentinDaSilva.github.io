
import GestorFactura from "../../Clases/Dominio/GestorFactura.js";
import Factura from "../../Clases/Dominio/Factura.js";
import PersonaFisica from "../../Clases/Dominio/PersonaFisica.js";
import PersonaJuridica from "../../Clases/Dominio/PersonaJuridica.js";
import { EstadoFactura, TipoFactura } from "../../Clases/Dominio/Enums.js";


class GestorGenerarFactura extends GestorFactura {
  constructor() {
    super();
  }

  /**
   * Convierte un huésped al formato estándar requerido
   * @param {Object} huesped - Huésped en cualquier formato (dominio, JSON, etc.)
   * @returns {Object} Huésped en formato estándar
   */
  convertirHuespedAFormatoEstandar(huesped) {
    if (!huesped) return null;
    
    // Obtener dirección - puede venir como objeto direccion o como campos planos
    let direccion = null;
    if (huesped.direccion && typeof huesped.direccion === 'object') {
      // Dirección viene como objeto
      const dir = huesped.direccion;
      direccion = {
        calle: dir.calle || '',
        numero: dir.numero || '',
        piso: dir.piso || '',
        departamento: dir.departamento || '',
        ciudad: dir.ciudad || dir.localidad || '',
        provincia: dir.provincia || '',
        codigoPostal: dir.codigoPostal || '',
        pais: dir.pais || ''
      };
    } else if (huesped.calle || huesped.numeroCalle || huesped.localidad) {
      // Dirección viene en formato plano (campos directos del huésped)
      direccion = {
        calle: huesped.calle || '',
        numero: huesped.numero || huesped.numeroCalle || '',
        piso: huesped.piso || '',
        departamento: huesped.departamento || '',
        ciudad: huesped.ciudad || huesped.localidad || '',
        provincia: huesped.provincia || '',
        codigoPostal: huesped.codigoPostal || '',
        pais: huesped.pais || ''
      };
    } else {
      // Si no hay dirección, crear una vacía
      direccion = {
        calle: '',
        numero: '',
        piso: '',
        departamento: '',
        ciudad: '',
        provincia: '',
        codigoPostal: '',
        pais: ''
      };
    }
    
    return {
      apellido: huesped.apellido || '',
      nombre: huesped.nombre || huesped.nombres || '',
      tipoDocumento: huesped.tipoDocumento || '',
      numeroDocumento: huesped.numeroDocumento || huesped.nroDocumento || huesped.documento || '',
      cuit: huesped.cuit || '',
      email: huesped.email || '',
      ocupacion: huesped.ocupacion || '',
      nacionalidad: huesped.nacionalidad || '',
      direccion: direccion
    };
  }

  
  async procesarFactura(estadia, responsableDePago, horaSalida, tipoFactura = TipoFactura.B) {
    try {
      if (!estadia) {
        throw new Error('No se encontró la estadía. Por favor, intente nuevamente.');
      }
      
      if (!horaSalida) {
        throw new Error('La hora de salida es requerida.');
      }

      if (!responsableDePago) {
        throw new Error('Debe seleccionar un responsable de pago.');
      }
      
      
      const factura = await this.generarJSONFactura(estadia, responsableDePago, horaSalida, tipoFactura);

      return factura;
    } catch (error) {
      console.error('Error al procesar factura:', error);
      throw error;
    }
  }

  
  async generarJSONFactura(estadia, responsableDePago, horaSalida, tipoFactura = TipoFactura.B) {
    if (!estadia) {
      throw new Error('No se puede generar factura sin estadía');
    }
    
    // Validar estructura de estadía
    if (!estadia.reserva) {
      throw new Error('La estadía no tiene una reserva asociada');
    }
    
    if (!estadia.reserva.habitaciones || estadia.reserva.habitaciones.length === 0) {
      throw new Error('La reserva no tiene habitaciones asociadas');
    }
    
    // Crear instancia de Factura temporal para usar sus métodos de cálculo
    const facturaTemporal = new Factura(null, null, null, null, null, null, null, estadia);
    const fechaActual = facturaTemporal.obtenerFechaActual();
    const horaActual = new Date().toTimeString().slice(0, 5);
    
    // Usar métodos de la clase Factura para calcular IVA y total (ahora es async)
    const resultado = await facturaTemporal.calcularDetalle(estadia, horaSalida);
    
    
    let responsable = null;
    
    // Si ya es una instancia de ResponsableDePago (PersonaFisica o PersonaJuridica), usarla directamente
    if (responsableDePago && (responsableDePago instanceof PersonaFisica || responsableDePago instanceof PersonaJuridica)) {
      responsable = responsableDePago;
    } else if (responsableDePago.razonSocial) {
      // Es un tercero (persona jurídica)
      responsable = new PersonaJuridica({
        razonSocial: responsableDePago.razonSocial,
        cuit: responsableDePago.cuit,
        telefono: responsableDePago.telefono,
        direccion: responsableDePago.direccion
      });
    } else {
      // Es un huésped (persona física)
      responsable = new PersonaFisica({
        apellido: responsableDePago.apellido || estadia.titular.apellido,
        nombres: responsableDePago.nombres || estadia.titular.nombres,
        documento: responsableDePago.numeroDocumento || responsableDePago.documento || estadia.titular.numeroDocumento
      });
    }
    
    // Generar JSON con la estructura completa de Factura (sin detalle)
    // Convertir responsable a JSON si es una instancia de ResponsableDePago
    const responsableJSON = (responsable instanceof PersonaFisica || responsable instanceof PersonaJuridica)
      ? responsable.toJSON() 
      : responsable;
    
    // Convertir titular y acompañantes al formato estándar
    const titularEstandar = this.convertirHuespedAFormatoEstandar(estadia.titular);
    const acompaniantesEstandar = (estadia.acompaniantes || []).map(acomp => 
      this.convertirHuespedAFormatoEstandar(acomp)
    ).filter(acomp => acomp !== null);
    
    // Crear estadía con huéspedes en formato estándar
    const estadiaEstandar = {
      ...estadia,
      titular: titularEstandar,
      acompaniantes: acompaniantesEstandar
    };
    
    const factura = {
      id: null, 
      hora: horaActual,
      fecha: fechaActual,
      tipo: tipoFactura,
      estado: EstadoFactura.PENDIENTE,
      responsableDePago: responsableJSON,
      medioDePago: null, 
      estadia: estadiaEstandar, // Estadía con huéspedes en formato estándar
      pagos: [], // Array vacío inicialmente
      total: resultado.total, // Total de la factura
      iva: resultado.iva, // IVA calculado
      horaSalida: horaSalida // Hora de salida para calcular recargos
    };
    
    return factura;
  }

  // Los métodos de cálculo ahora están en la clase Factura
  // Se mantienen aquí métodos auxiliares si son necesarios para el gestor
}


export { GestorGenerarFactura };

const gestorGenerarFactura = new GestorGenerarFactura();
if (typeof window !== 'undefined') {
  window.gestorGenerarFactura = gestorGenerarFactura;
}

