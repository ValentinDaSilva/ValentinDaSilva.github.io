

import { formatearFecha, formatearMonto, obtenerNombreResponsable } from './utilidades.js';


export function calcularTotalGeneral(cheques) {
  return cheques.reduce((total, cheque) => {
    return total + (cheque.importe || 0);
  }, 0);
}


export function mostrarResultados(cheques) {
  const contenedor = document.getElementById('contenido-resultados');
  const contenedorResultados = document.getElementById('contenedor-resultados');
  const totalGeneralElement = document.getElementById('total-general');
  
  if (cheques.length === 0) {
    contenedor.innerHTML = '<div class="mensaje-sin-resultados">No hay cheques para mostrar</div>';
    contenedorResultados.style.display = 'block';
    totalGeneralElement.innerHTML = '';
    return;
  }
  
  
  let html = `
    <table class="tabla-cheques">
      <thead>
        <tr>
          <th>Número de Cheque</th>
          <th>Banco</th>
          <th>Titular</th>
          <th>Importe</th>
          <th>Fecha de Cobro</th>
          <th>Fecha de Pago</th>
          <th>Responsable de Pago</th>
          <th>Número de Factura</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  cheques.forEach(cheque => {
    const nombreResponsable = obtenerNombreResponsable(cheque.responsableDePago);
    
    html += `
      <tr>
        <td>${cheque.numeroCheque || '-'}</td>
        <td>${cheque.banco || '-'}</td>
        <td>${cheque.titular || '-'}</td>
        <td>${formatearMonto(cheque.importe)}</td>
        <td>${formatearFecha(cheque.fechaCobro)}</td>
        <td>${formatearFecha(cheque.fechaPago)}</td>
        <td>${nombreResponsable}</td>
        <td>${cheque.numeroFactura || '-'}</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  contenedor.innerHTML = html;
  
  
  const totalGeneral = calcularTotalGeneral(cheques);
  totalGeneralElement.innerHTML = `
    <div>Total General de Cheques: ${formatearMonto(totalGeneral)}</div>
  `;
  
  
  contenedorResultados.style.display = 'block';
}

