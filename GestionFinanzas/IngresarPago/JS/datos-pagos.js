
import { obtenerFacturaPorId } from './datos-facturas.js';
import { convertirFacturaJSONAClase } from './convertir-factura-clase.js';
import { obtenerFacturaActual } from './seleccion-factura.js';


// Los pagos se obtienen de las facturas, no de un JSON separado


export function obtenerPagosPorFactura(idFactura) {
  // Obtener pagos desde la factura actual o desde el JSON de facturas
  let factura = obtenerFacturaActual();
  
  // Si tenemos la factura actual y coincide con el ID
  if (factura) {
    // getId es un getter, no un método
    const facturaId = (factura.getId !== undefined) ? factura.getId : factura.id;
    if (facturaId === idFactura) {
      // Obtener pagos de la instancia de clase
      // getPagos es un getter, no un método, así que se accede sin paréntesis
      const pagos = (factura.getPagos !== undefined) ? factura.getPagos : (factura.pagos || []);
      return pagos;
    }
  }
  
  // Si no coincide, buscar en el JSON y convertir
  const facturaJSON = obtenerFacturaPorId(idFactura);
  if (facturaJSON) {
    const facturaClase = convertirFacturaJSONAClase(facturaJSON);
    // getPagos es un getter, no un método, así que se accede sin paréntesis
    const pagos = (facturaClase.getPagos !== undefined) ? facturaClase.getPagos : (facturaClase.pagos || []);
    return pagos;
  }
  
  return [];
}


export function calcularTotalPagado(idFactura) {
  // Calcular desde los pagos de la factura
  const pagos = obtenerPagosPorFactura(idFactura);
  return pagos.reduce((total, pago) => {
    // En la clase Pago, el getter es montoTotal directamente, no getMontoTotal
    const monto = pago.montoTotal || pago._montoTotal || (pago.monto || 0);
    return total + monto;
  }, 0);
}


// Esta función ya no se usa, los pagos se agregan directamente a la factura
// Se mantiene por compatibilidad pero solo retorna el pago sin guardarlo en un JSON separado
export async function crearPago(datosPago) {
  console.warn('crearPago() está deprecado. Los pagos deben agregarse directamente a la factura usando factura.agregarPago()');
  
  // Retornar un objeto simple para compatibilidad
  return {
    id: datosPago.id || null,
    idFactura: datosPago.idFactura,
    fecha: datosPago.fecha || new Date().toISOString().split('T')[0],
    hora: datosPago.hora || new Date().toTimeString().slice(0, 5),
    medioPago: datosPago.medioPago,
    monto: datosPago.monto,
    detalles: datosPago.detalles || {}
  };
}


// Esta función ya no se usa, se mantiene por compatibilidad
export async function guardarPagos() {
  console.warn('guardarPagos() está deprecado. Los pagos se guardan como parte de las facturas.');
}

