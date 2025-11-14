/* Creación de instancias de clases de dominio para pagos */

import Pago from '../../../Clases/Dominio/Pago.js';
import { Efectivo, MonedaExtranjera, Cheque, Tarjeta } from '../../../Clases/Dominio/MedioDePago/index.js';

let siguienteIdPago = 1;

/**
 * Crea una instancia de Pago con el medio de pago correspondiente
 * @param {Object} datosPago - Datos del pago
 * @returns {Pago} - Instancia de Pago
 */
export function crearInstanciaPago(datosPago) {
  const fecha = datosPago.fecha || new Date().toISOString().split('T')[0];
  const hora = datosPago.hora || new Date().toTimeString().slice(0, 5);
  const medioNormalizado = datosPago.medioPago.toLowerCase();
  const detalles = datosPago.detalles || {};
  
  let medioDePagoInstancia = null;
  
  switch (medioNormalizado) {
    case 'efectivo':
      medioDePagoInstancia = new Efectivo(detalles.monto || 0);
      break;
    
    case 'monedaextranjera':
      medioDePagoInstancia = new MonedaExtranjera(
        detalles.tipoMoneda || '',
        detalles.montoExtranjero || 0,
        detalles.cotizacion || 0,
        detalles.monto || 0
      );
      break;
    
    case 'cheques':
      // Para cheques, crear una instancia de Cheque (se crea un pago por cada cheque)
      if (detalles.cheques && detalles.cheques.length > 0) {
        const cheque = detalles.cheques[0]; // Tomar el primer cheque
        medioDePagoInstancia = new Cheque(
          cheque.numero || '',
          cheque.monto || 0,
          cheque.fechaVencimiento || ''
        );
      }
      break;
    
    case 'tarjetas':
      // Para tarjetas, crear una instancia de Tarjeta (se crea un pago por cada tarjeta)
      if (detalles.tarjetas && detalles.tarjetas.length > 0) {
        const tarjeta = detalles.tarjetas[0]; // Tomar la primera tarjeta
        medioDePagoInstancia = new Tarjeta(
          tarjeta.tipo || '',
          tarjeta.numeroTarjeta || '',
          tarjeta.monto || 0
        );
      }
      break;
  }
  
  const pago = new Pago(
    siguienteIdPago++,
    fecha,
    hora,
    datosPago.monto || 0,
    medioDePagoInstancia
  );
  
  return pago;
}

/**
 * Obtiene el siguiente ID de pago
 * @returns {number}
 */
export function obtenerSiguienteIdPago() {
  return siguienteIdPago;
}

/**
 * Establece el siguiente ID de pago (útil para inicializar desde BD)
 * @param {number} id
 */
export function establecerSiguienteIdPago(id) {
  siguienteIdPago = id;
}

