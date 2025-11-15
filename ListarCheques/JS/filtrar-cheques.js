/* Filtrado de cheques por rango de fechas */

import { obtenerFacturas } from './datos-facturas.js';

let chequesFiltrados = [];

/**
 * Obtiene la fecha relevante del cheque para filtrar
 * Prioriza fechaVencimiento (fecha de cobro), si no existe usa fecha del pago
 * @param {Object} pago - Objeto de pago
 * @returns {string} - Fecha relevante (YYYY-MM-DD)
 */
function obtenerFechaRelevante(pago) {
  const medioDePago = pago.medioDePago;
  
  // Si tiene fechaVencimiento (fecha de cobro), usarla
  if (medioDePago && medioDePago.fechaVencimiento) {
    return medioDePago.fechaVencimiento;
  }
  
  // Si no, usar la fecha del pago
  return pago.fecha;
}

/**
 * Verifica si un pago es un cheque
 * @param {Object} pago - Objeto de pago
 * @returns {boolean} - true si es cheque
 */
function esCheque(pago) {
  if (!pago || !pago.medioDePago) {
    return false;
  }
  
  const tipo = pago.medioDePago.tipo;
  return tipo && tipo.toLowerCase() === 'cheques';
}

/**
 * Filtra los cheques por rango de fechas
 * @param {string} fechaDesde - Fecha de inicio (YYYY-MM-DD)
 * @param {string} fechaHasta - Fecha de fin (YYYY-MM-DD)
 * @returns {Array} - Array de cheques filtrados con información adicional
 */
export function filtrarChequesPorFecha(fechaDesde, fechaHasta) {
  const todasLasFacturas = obtenerFacturas();
  chequesFiltrados = [];
  
  todasLasFacturas.forEach(factura => {
    if (factura.pagos && Array.isArray(factura.pagos)) {
      factura.pagos.forEach(pago => {
        // Verificar si es un cheque
        if (esCheque(pago)) {
          // Obtener fecha relevante para filtrar
          const fechaRelevante = obtenerFechaRelevante(pago);
          
          // Filtrar por rango de fechas (inclusive)
          if (fechaRelevante >= fechaDesde && fechaRelevante <= fechaHasta) {
            // Agregar información adicional del cheque
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
              tipoCheque: pago.medioDePago.tipoCheque || '-', // propio o terceros
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

/**
 * Obtiene los cheques filtrados actuales
 * @returns {Array} - Array de cheques filtrados
 */
export function obtenerChequesFiltrados() {
  return chequesFiltrados;
}

