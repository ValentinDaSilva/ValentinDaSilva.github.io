/* Visualización de resultados */

import { agruparPagosPorTipo, calcularTotalGeneral } from './agrupar-pagos.js';
import { formatearFecha, formatearMonto, obtenerDetalleMedioPago, obtenerNombreResponsable } from './utilidades.js';

/**
 * Muestra los resultados de los pagos agrupados
 * @param {Array} pagos - Array de pagos a mostrar
 */
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
  
  // Agrupar pagos por tipo
  const grupos = agruparPagosPorTipo(pagos);
  
  // Generar HTML
  let html = '';
  
  // Ordenar grupos por nombre de tipo
  const tiposOrdenados = Object.keys(grupos).sort();
  
  tiposOrdenados.forEach(tipo => {
    const grupo = grupos[tipo];
    html += generarHTMLGrupo(grupo);
  });
  
  contenedor.innerHTML = html;
  
  // Calcular y mostrar total general
  const totalGeneral = calcularTotalGeneral(pagos);
  totalGeneralElement.innerHTML = `
    <div>Total General del Período: ${formatearMonto(totalGeneral)}</div>
  `;
  
  // Mostrar contenedor de resultados
  contenedorResultados.style.display = 'block';
}

/**
 * Genera el HTML para un grupo de pagos
 * @param {Object} grupo - Grupo de pagos
 * @returns {string} - HTML del grupo
 */
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
  
  // Los pagos ya vienen ordenados del array principal, así que se mantiene el orden dentro del grupo
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

