

import { extraerTodosLosPagos } from './datos-facturas.js';

let pagosFiltrados = [];


export function filtrarPagosPorFecha(fechaDesde, fechaHasta) {
  const todosLosPagos = extraerTodosLosPagos();
  
  pagosFiltrados = todosLosPagos.filter(pago => {
    const fechaPago = pago.fecha;
    
    
    return fechaPago >= fechaDesde && fechaPago <= fechaHasta;
  });
  
  return pagosFiltrados;
}


export function obtenerPagosFiltrados() {
  return pagosFiltrados;
}

