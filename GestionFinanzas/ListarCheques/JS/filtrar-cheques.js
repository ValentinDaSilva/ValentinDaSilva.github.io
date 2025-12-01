

import { obtenerFacturas } from './datos-facturas.js';

let chequesFiltrados = [];


function obtenerFechaRelevante(pago) {
  const medioDePago = pago.medioDePago;
  
  
  if (medioDePago && medioDePago.fechaVencimiento) {
    return medioDePago.fechaVencimiento;
  }
  
  
  return pago.fecha;
}


function esCheque(pago) {
  if (!pago || !pago.medioDePago) {
    return false;
  }
  
  const tipo = pago.medioDePago.tipo;
  return tipo && tipo.toLowerCase() === 'cheques';
}


export function filtrarChequesPorFecha(fechaDesde, fechaHasta) {
  const todasLasFacturas = obtenerFacturas();
  chequesFiltrados = [];
  
  todasLasFacturas.forEach(factura => {
    if (factura.pagos && Array.isArray(factura.pagos)) {
      factura.pagos.forEach(pago => {
        
        if (esCheque(pago)) {
          
          const fechaRelevante = obtenerFechaRelevante(pago);
          
          
          if (fechaRelevante >= fechaDesde && fechaRelevante <= fechaHasta) {
            
            const cheque = {
              ...pago,
              responsableDePago: factura.responsableDePago,
              idFactura: factura.id,
              numeroFactura: factura.id,
              fechaPago: pago.fecha,
              fechaCobro: pago.medioDePago.fechaVencimiento || pago.fecha,
              numeroCheque: pago.medioDePago.numero || '-',
              banco: pago.medioDePago.banco || '-',
              titular: pago.medioDePago.titular || '-',
              plaza: pago.medioDePago.plaza || '-',
              tipoCheque: pago.medioDePago.tipoCheque || '-', 
              importe: pago.montoTotal || pago.medioDePago.monto || 0
            };
            
            chequesFiltrados.push(cheque);
          }
        }
      });
    }
  });
  
  return chequesFiltrados;
}


export function obtenerChequesFiltrados() {
  return chequesFiltrados;
}

