

import { mostrarResultados } from './mostrar-resultados.js';
import { obtenerPagosFiltrados } from './filtrar-pagos.js';
import { obtenerNombreResponsable } from './utilidades.js';


let criterioOrdenamientoActual = 'fecha';


function obtenerTipoMedioPago(medioDePago) {
  if (!medioDePago || !medioDePago.tipo) {
    return 'Desconocido';
  }
  
  const tipo = medioDePago.tipo.toLowerCase();
  
  if (tipo === 'efectivo') return 'Efectivo';
  if (tipo === 'tarjetas') return 'Tarjeta';
  if (tipo === 'cheques') return 'Cheque';
  if (tipo === 'monedaextranjera' || tipo === 'monedaextranjera') return 'Moneda Extranjera';
  
  return 'Desconocido';
}


function compararPagos(a, b) {
  switch (criterioOrdenamientoActual) {
    case 'fecha':
      const fechaA = a.fecha || '';
      const fechaB = b.fecha || '';
      if (fechaA !== fechaB) {
        return fechaA.localeCompare(fechaB);
      }
      
      const horaA = a.hora || '';
      const horaB = b.hora || '';
      return horaA.localeCompare(horaB);
      
    case 'monto':
      const montoA = a.montoTotal || 0;
      const montoB = b.montoTotal || 0;
      return montoB - montoA; 
      
    case 'tipoMedio':
      const tipoA = obtenerTipoMedioPago(a.medioDePago);
      const tipoB = obtenerTipoMedioPago(b.medioDePago);
      return tipoA.localeCompare(tipoB);
      
    case 'responsable':
      const nombreA = obtenerNombreResponsable(a.responsableDePago);
      const nombreB = obtenerNombreResponsable(b.responsableDePago);
      return nombreA.localeCompare(nombreB);
      
    default:
      return 0;
  }
}


export function ordenarPagos(criterio) {
  criterioOrdenamientoActual = criterio;
  const pagos = [...obtenerPagosFiltrados()];
  
  
  pagos.sort(compararPagos);
  
  
  mostrarResultados(pagos);
}


export function obtenerCriterioOrdenamiento() {
  return criterioOrdenamientoActual;
}

