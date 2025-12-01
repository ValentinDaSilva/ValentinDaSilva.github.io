

import { mensajeError } from './modales.js';
import { obtenerFacturasSeleccionadas } from './seleccion-facturas.js';


export function validarDniCuit(dniCuit) {
  if (!dniCuit || dniCuit.trim() === '') {
    mensajeError('Debe ingresar un DNI o CUIT del responsable de pago.');
    return false;
  }
  return true;
}


export function validarFacturasSeleccionadas() {
  const facturasSeleccionadas = obtenerFacturasSeleccionadas();
  
  if (!facturasSeleccionadas || facturasSeleccionadas.length === 0) {
    mensajeError('Debe seleccionar al menos una factura para anular.');
    return false;
  }
  
  return true;
}







