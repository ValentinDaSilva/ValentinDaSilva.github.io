
import GestorFactura from "../../Clases/Dominio/GestorFactura.js";
import Factura from "../../Clases/Dominio/Factura.js";
import { EstadoFactura, TipoFactura } from "../../Clases/Dominio/Enums.js";


class GestorGenerarFactura extends GestorFactura {
  constructor() {
    super();
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
    
    // Usar métodos de la clase Factura para calcular el detalle (ahora es async)
    const detalle = await facturaTemporal.calcularDetalle(estadia, horaSalida);
    
    
    let responsable = null;
    if (responsableDePago.razonSocial) {
      
      responsable = {
        tipo: 'tercero',
        razonSocial: responsableDePago.razonSocial,
        cuit: responsableDePago.cuit,
        telefono: responsableDePago.telefono,
        direccion: responsableDePago.direccion
      };
    } else {
      
      responsable = {
        tipo: 'huesped',
        apellido: responsableDePago.apellido || estadia.titular.apellido,
        nombres: responsableDePago.nombres || estadia.titular.nombres,
        documento: responsableDePago.numeroDocumento || estadia.titular.numeroDocumento,
        cuit: responsableDePago.cuit || estadia.titular.cuit
      };
    }
    
    const habitacion = estadia.reserva.habitaciones[0];
    
    
    const factura = {
      id: null, 
      hora: horaActual,
      fecha: fechaActual,
      horaSalida: horaSalida,
      tipo: tipoFactura,
      estado: EstadoFactura.PENDIENTE,
      responsableDePago: responsable,
      medioDePago: null, 
      estadia: {
        id: estadia.id,
        fechaCheckIn: estadia.fechaCheckIn,
        fechaCheckOut: estadia.fechaCheckOut || fechaActual,
        habitacion: habitacion,
        titular: estadia.titular,
        acompaniantes: estadia.acompaniantes || []
      },
      detalle: detalle
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

