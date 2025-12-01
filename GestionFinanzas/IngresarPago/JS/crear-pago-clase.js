

import Pago from '../../../Clases/Dominio/Pago.js';
import { Efectivo, MonedaExtranjera, Cheque, Tarjeta } from '../../../Clases/Dominio/MedioDePago/index.js';

let siguienteIdPago = 1;


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
      
      if (detalles.cheques && detalles.cheques.length > 0) {
        const cheque = detalles.cheques[0]; 
        medioDePagoInstancia = new Cheque(
          cheque.numero || '',
          cheque.monto || 0,
          cheque.fechaVencimiento || ''
        );
      }
      break;
    
    case 'tarjetas':
      
      if (detalles.tarjetas && detalles.tarjetas.length > 0) {
        const tarjeta = detalles.tarjetas[0]; 
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


export function obtenerSiguienteIdPago() {
  return siguienteIdPago;
}


export function establecerSiguienteIdPago(id) {
  siguienteIdPago = id;
}

