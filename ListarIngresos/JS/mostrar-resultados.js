

import { agruparPagosPorTipo, calcularTotalGeneral } from './agrupar-pagos.js';
import { formatearFecha, formatearMonto, obtenerDetalleMedioPago, obtenerNombreResponsable } from './utilidades.js';


export function mostrarResultados(pagos) {
  const contenedor = document.getElementById('contenido-resultados');
  const contenedorResultados = document.getElementById('contenedor-resultados');
  const totalGeneralElement = document.getElementById('total-general');
  
  if (pagos.length === 0) {
    contenedor.innerHTML = '<div class="mensaje-sin-resultados">No hay pagos para mostrar</div>';
    contenedorResultados.style.display = 'block';
    totalGeneralElement.innerHTML = '';
    return;
  }
  
  
  const grupos = agruparPagosPorTipo(pagos);
  
  
  let html = '';
  
  
  const tiposOrdenados = Object.keys(grupos).sort();
  
  tiposOrdenados.forEach(tipo => {
    const grupo = grupos[tipo];
    html += generarHTMLGrupo(grupo);
  });
  
  contenedor.innerHTML = html;
  
  
  const totalGeneral = calcularTotalGeneral(pagos);
  totalGeneralElement.innerHTML = `
    <div>Total General del Período: ${formatearMonto(totalGeneral)}</div>
  `;
  
  
  contenedorResultados.style.display = 'block';
}


function generarHTMLGrupo(grupo) {
  let html = `
    <div class="grupo-medio-pago">
      <div class="header-grupo">
        <div class="titulo-grupo">${grupo.tipo}</div>
        <div class="total-grupo">Total: ${formatearMonto(grupo.total)}</div>
      </div>
      <table class="tabla-pagos">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Monto</th>
            <th>Responsable de Pago</th>
            <th>Detalles del Medio de Pago</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  
  grupo.pagos.forEach(pago => {
    const detalleMedio = obtenerDetalleMedioPago(pago.medioDePago);
    const nombreResponsable = obtenerNombreResponsable(pago.responsableDePago);
    
    html += `
      <tr>
        <td>${formatearFecha(pago.fecha)}</td>
        <td>${pago.hora || '-'}</td>
        <td>${formatearMonto(pago.montoTotal)}</td>
        <td>${nombreResponsable}</td>
        <td>${detalleMedio}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </div>
  `;
  
  return html;
}

