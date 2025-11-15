

import { obtenerFacturasActuales } from './buscar-facturas.js';
import { obtenerFacturas } from './datos-facturas.js';

let facturasSeleccionadas = [];


export function obtenerFacturasSeleccionadas() {
  const checkboxes = document.querySelectorAll('#tablaFacturas input[type="checkbox"]:checked');
  const idsSeleccionados = Array.from(checkboxes).map(cb => parseInt(cb.dataset.facturaId));
  
  
  const todasLasFacturas = obtenerFacturas();
  facturasSeleccionadas = idsSeleccionados
    .map(id => todasLasFacturas.find(f => f.id === id))
    .filter(f => f !== undefined);
  
  return facturasSeleccionadas;
}


export function obtenerFacturasSeleccionadasCompletas() {
  return facturasSeleccionadas;
}


export function limpiarSeleccionFacturas() {
  facturasSeleccionadas = [];
  const checkboxes = document.querySelectorAll('#tablaFacturas input[type="checkbox"]');
  checkboxes.forEach(cb => cb.checked = false);
}




