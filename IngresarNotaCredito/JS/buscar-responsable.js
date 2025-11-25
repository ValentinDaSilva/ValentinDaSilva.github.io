

import { buscarResponsablePorDniCuit } from './datos-responsables.js';
import { mensajeError } from './modales.js';

let responsableActual = null;


export async function buscarResponsable(dniCuit) {
  if (!dniCuit || dniCuit.trim() === '') {
    mensajeError('Debe ingresar un DNI o CUIT del responsable de pago.');
    return null;
  }
  
  try {
    const responsable = await buscarResponsablePorDniCuit(dniCuit.trim());
    
    if (!responsable) {
      mensajeError('No se encontró un responsable de pago con el DNI o CUIT ingresado.');
      return null;
    }
    
    responsableActual = responsable;
    return responsable;
  } catch (error) {
    console.error('Error al buscar responsable:', error);
    mensajeError('Error al buscar el responsable de pago. Por favor, intente nuevamente.');
    return null;
  }
}


export function obtenerResponsableActual() {
  return responsableActual;
}


export function limpiarResponsableActual() {
  responsableActual = null;
}







