

import { mostrarResultados } from './mostrar-resultados.js';
import { obtenerChequesFiltrados } from './filtrar-cheques.js';
import { obtenerNombreResponsable } from './utilidades.js';


let criterioOrdenamientoActual = 'fecha';


function compararCheques(a, b) {
  switch (criterioOrdenamientoActual) {
    case 'fecha':
      
      const fechaA = a.fechaCobro || a.fechaPago || '';
      const fechaB = b.fechaCobro || b.fechaPago || '';
      return fechaA.localeCompare(fechaB);
      
    case 'monto':
      const montoA = a.importe || 0;
      const montoB = b.importe || 0;
      return montoB - montoA; 
      
    case 'numero':
      const numeroA = a.numeroCheque || '';
      const numeroB = b.numeroCheque || '';
      return numeroA.localeCompare(numeroB);
      
    case 'banco':
      const bancoA = a.banco || '';
      const bancoB = b.banco || '';
      return bancoA.localeCompare(bancoB);
      
    case 'responsable':
      const nombreA = obtenerNombreResponsable(a.responsableDePago);
      const nombreB = obtenerNombreResponsable(b.responsableDePago);
      return nombreA.localeCompare(nombreB);
      
    default:
      return 0;
  }
}


export function ordenarCheques(criterio) {
  criterioOrdenamientoActual = criterio;
  const cheques = [...obtenerChequesFiltrados()];
  
  
  cheques.sort(compararCheques);
  
  
  mostrarResultados(cheques);
}


export function obtenerCriterioOrdenamiento() {
  return criterioOrdenamientoActual;
}

