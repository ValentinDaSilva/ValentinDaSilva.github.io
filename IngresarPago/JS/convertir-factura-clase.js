

import Factura from '../../../Clases/Dominio/Factura.js';
import Pago from '../../../Clases/Dominio/Pago.js';
import { Efectivo, MonedaExtranjera, Cheque, Tarjeta } from '../../../Clases/Dominio/MedioDePago/index.js';


export function convertirFacturaJSONAClase(facturaJSON) {
  
  const factura = new Factura(
    facturaJSON.id,
    facturaJSON.hora,
    facturaJSON.fecha,
    facturaJSON.tipo,
    facturaJSON.estado,
    facturaJSON.responsableDePago,
    facturaJSON.medioDePago,
    facturaJSON.estadia
  );
  
  
  if (facturaJSON.pagos && Array.isArray(facturaJSON.pagos)) {
    facturaJSON.pagos.forEach(pagoJSON => {
      const pago = convertirPagoJSONAClase(pagoJSON);
      if (pago) {
        factura.agregarPago(pago);
      }
    });
  }
  
  return factura;
}


function convertirPagoJSONAClase(pagoJSON) {
  if (!pagoJSON || !pagoJSON.medioDePago) {
    return null;
  }
  
  let medioDePagoInstancia = null;
  const medio = pagoJSON.medioDePago;
  
  if (medio.tipo === 'efectivo') {
    medioDePagoInstancia = new Efectivo(medio.monto || 0);
  } else if (medio.tipo === 'monedaExtranjera') {
    medioDePagoInstancia = new MonedaExtranjera(
      medio.tipoMoneda || '',
      medio.montoExtranjero || 0,
      medio.cotizacion || 0,
      medio.monto || 0
    );
  } else if (medio.tipo === 'cheques' && medio.cheques) {
    medioDePagoInstancia = medio.cheques.map(cheque => 
      new Cheque(
        cheque.numero || '',
        cheque.monto || 0,
        cheque.fechaVencimiento || ''
      )
    );
  } else if (medio.tipo === 'tarjetas' && medio.tarjetas) {
    medioDePagoInstancia = medio.tarjetas.map(tarjeta => 
      new Tarjeta(
        tarjeta.tipo || '',
        tarjeta.numeroTarjeta || '',
        tarjeta.monto || 0
      )
    );
  }
  
  if (!medioDePagoInstancia) {
    return null;
  }
  
  const pago = new Pago(
    pagoJSON.id,
    pagoJSON.fecha,
    pagoJSON.hora,
    pagoJSON.montoTotal || 0,
    medioDePagoInstancia
  );
  
  return pago;
}

