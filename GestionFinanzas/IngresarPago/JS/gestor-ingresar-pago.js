
import GestorFactura from "../../Clases/Dominio/GestorFactura.js";
import { EstadoFactura } from "../../Clases/Dominio/Enums.js";
import Pago from "../../../Clases/Dominio/Pago.js";
import { Efectivo, MonedaExtranjera, Cheque, Tarjeta } from "../../../Clases/Dominio/MedioDePago/index.js";


class GestorIngresarPago extends GestorFactura {
  constructor() {
    super();
    this._facturas = [];
    this._siguienteIdPago = 1;
  }

  
  async cargarDatos() {
    try {
      await this._cargarFacturas();
      // Los pagos se obtienen de las facturas, no se cargan por separado
    } catch (error) {
      console.error('Error al cargar datos:', error);
      throw error;
    }
  }

  
  async _cargarFacturas() {
    try {
      const respuesta = await fetch('/Datos/facturas.json');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        this._facturas = datos.facturas || [];
        
        // Calcular siguiente ID de pago desde los pagos de las facturas
        let maxIdPago = 0;
        this._facturas.forEach(factura => {
          if (factura.pagos && Array.isArray(factura.pagos)) {
            factura.pagos.forEach(pago => {
              if (pago.id && pago.id > maxIdPago) {
                maxIdPago = pago.id;
              }
            });
          }
        });
        this._siguienteIdPago = maxIdPago + 1;
      } else {
        this._facturas = [];
      }
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      this._facturas = [];
    }
  }

  
  async buscarFacturasPendientes(numeroHabitacion) {
    try {
      await this._cargarFacturas();
      
      return this._facturas.filter(factura => {
        
        const habitacionFactura = factura.estadia?.habitacion?.numero;
        
        const habitacionCoincide = habitacionFactura === parseInt(numeroHabitacion) || 
                                    habitacionFactura === numeroHabitacion;
        
        const estadoNormalizado = (factura.estado || '').toUpperCase().trim();
        const estadoPendiente = estadoNormalizado === 'PENDIENTE';
        
        return habitacionCoincide && estadoPendiente;
      });
    } catch (error) {
      console.error('Error al buscar facturas pendientes:', error);
      throw error;
    }
  }

  
  async procesarPago(factura, datosPago) {
    try {
      if (!factura) {
        throw new Error('No hay una factura seleccionada.');
      }
      
      if (factura.estado === EstadoFactura.PAGADA) {
        throw new Error('No se puede pagar una factura ya pagada.');
      }

      if (!datosPago || !datosPago.medioPago || datosPago.medioPago.length === 0) {
        throw new Error('Debe seleccionar al menos un medio de pago.');
      }

      
      await this._cargarFacturas();
      
      const pagosCreados = [];
      const fechaActual = new Date().toISOString().split('T')[0];
      const horaActual = new Date().toTimeString().slice(0, 5);

      for (const medio of datosPago.medioPago) {
        const detalles = datosPago.detalles[medio] || {};
        const medioNormalizado = medio.toLowerCase();
        
        if (medioNormalizado === 'cheques' && detalles.cheques) {
          for (const cheque of detalles.cheques) {
            const pago = {
              id: this._siguienteIdPago++,
              idFactura: factura.id,
              fecha: fechaActual,
              hora: horaActual,
              medioPago: medio,
              monto: cheque.monto,
              detalles: {
                numero: cheque.numero,
                fechaVencimiento: cheque.fechaVencimiento
              }
            };
            pagosCreados.push(pago);
          }
        } else if (medioNormalizado === 'tarjetas' && detalles.tarjetas) {
          for (const tarjeta of detalles.tarjetas) {
            const pago = {
              id: this._siguienteIdPago++,
              idFactura: factura.id,
              fecha: fechaActual,
              hora: horaActual,
              medioPago: medio,
              monto: tarjeta.monto,
              detalles: {
                tipo: tarjeta.tipo,
                numeroTarjeta: tarjeta.numeroTarjeta
              }
            };
            pagosCreados.push(pago);
          }
        } else {
          
          const pago = {
            id: this._siguienteIdPago++,
            idFactura: factura.id,
            fecha: fechaActual,
            hora: horaActual,
            medioPago: medio,
            monto: detalles.monto || 0,
            detalles: detalles
          };
          pagosCreados.push(pago);
        }
      }

      return pagosCreados;
    } catch (error) {
      console.error('Error al procesar pago:', error);
      throw error;
    }
  }

  
  calcularTotalPagado(idFactura) {
    // Calcular desde los pagos de la factura
    const factura = this._facturas.find(f => f.id === idFactura);
    if (!factura || !factura.pagos) {
      return 0;
    }
    
    return factura.pagos.reduce((total, pago) => {
      const monto = pago.montoTotal || pago.monto || 0;
      return total + monto;
    }, 0);
  }

  
  obtenerFacturaPorId(idFactura) {
    return this._facturas.find(f => f.id === idFactura) || null;
  }
}


export { GestorIngresarPago };

const gestorIngresarPago = new GestorIngresarPago();
if (typeof window !== 'undefined') {
  window.gestorIngresarPago = gestorIngresarPago;
}

