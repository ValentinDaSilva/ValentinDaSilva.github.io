/* Selección y visualización de factura */

import { obtenerFacturaPorId } from './datos-facturas.js';
import { obtenerPagosPorFactura, calcularTotalPagado } from './datos-pagos.js';
import { mensajeError } from './modales.js';
import { mostrarPantallaPago } from './navegacion-pantallas.js';

let facturaActual = null;

/**
 * Selecciona una factura por su ID
 * @param {number} idFactura - ID de la factura
 */
export function seleccionarFacturaPorId(idFactura) {
  const factura = obtenerFacturaPorId(idFactura);
  
  if (!factura) {
    mensajeError("No se encontró la factura seleccionada.");
    return;
  }
  
  if (factura.estado === 'Pagada') {
    mensajeError("No se puede pagar una factura ya pagada.");
    return;
  }
  
  facturaActual = factura;
  mostrarDatosFactura(factura);
  mostrarPagosRealizados(idFactura);
  
  // Cambiar a pantalla de pago
  mostrarPantallaPago();
}

/**
 * Muestra los datos de la factura en la pantalla
 * @param {Object} factura - Factura a mostrar
 */
function mostrarDatosFactura(factura) {
  // Número
  const numeroElement = document.getElementById('facturaNumero');
  if (numeroElement) {
    numeroElement.textContent = factura.id || '-';
  }
  
  // Responsable
  const responsableElement = document.getElementById('facturaResponsable');
  if (responsableElement) {
    let responsableTexto = '-';
    if (factura.responsableDePago) {
      if (factura.responsableDePago.tipo === 'tercero') {
        responsableTexto = factura.responsableDePago.razonSocial || '-';
      } else {
        responsableTexto = `${factura.responsableDePago.apellido || ''}, ${factura.responsableDePago.nombres || ''}`.trim();
      }
    }
    responsableElement.textContent = responsableTexto;
  }
  
  // Total
  const totalElement = document.getElementById('facturaTotal');
  if (totalElement) {
    const total = factura.detalle?.total || 0;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
  
  // Actualizar pagado y deuda
  actualizarResumenPago(factura.id);
}

/**
 * Actualiza el resumen de pago (pagado, deuda, vuelto)
 * @param {number} idFactura - ID de la factura
 */
export function actualizarResumenPago(idFactura) {
  const factura = obtenerFacturaPorId(idFactura);
  if (!factura) return;
  
  const total = factura.detalle?.total || 0;
  const pagado = calcularTotalPagado(idFactura);
  const deuda = Math.max(0, total - pagado);
  const vuelto = Math.max(0, pagado - total);
  
  const pagadoElement = document.getElementById('facturaPagado');
  if (pagadoElement) {
    pagadoElement.textContent = `$${pagado.toFixed(2)}`;
  }
  
  const deudaElement = document.getElementById('facturaDeuda');
  if (deudaElement) {
    deudaElement.textContent = `$${deuda.toFixed(2)}`;
  }
  
  const vueltoElement = document.getElementById('facturaVuelto');
  if (vueltoElement) {
    vueltoElement.textContent = `$${vuelto.toFixed(2)}`;
  }
  
  // Mostrar/ocultar botón finalizar si la factura está pagada
  const botonFinalizar = document.getElementById('boton-finalizar');
  if (botonFinalizar) {
    if (deuda <= 0) {
      botonFinalizar.classList.remove('hidden');
    } else {
      botonFinalizar.classList.add('hidden');
    }
  }
}

/**
 * Muestra los pagos realizados en la tabla
 * @param {number} idFactura - ID de la factura
 */
export function mostrarPagosRealizados(idFactura) {
  const tbody = document.getElementById('tbodyPagos');
  if (!tbody) return;
  
  const pagos = obtenerPagosPorFactura(idFactura);
  
  // Limpiar tabla
  tbody.innerHTML = '';
  
  if (pagos.length === 0) {
    const row = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.textContent = 'No hay pagos registrados';
    td.style.textAlign = 'center';
    td.style.color = '#666';
    row.appendChild(td);
    tbody.appendChild(row);
    return;
  }
  
  // Llenar tabla
  pagos.forEach(pago => {
    const row = document.createElement('tr');
    
    // Fecha
    const tdFecha = document.createElement('td');
    tdFecha.textContent = `${pago.fecha || '-'} ${pago.hora || ''}`;
    
    // Medio
    const tdMedio = document.createElement('td');
    const nombresMedios = {
      'efectivo': 'Efectivo',
      'monedaExtranjera': 'Moneda Extranjera',
      'cheques': 'Cheques',
      'tarjetas': 'Tarjetas'
    };
    tdMedio.textContent = nombresMedios[pago.medioPago] || pago.medioPago;
    
    // Monto
    const tdMonto = document.createElement('td');
    tdMonto.textContent = `$${(pago.monto || 0).toFixed(2)}`;
    
    row.appendChild(tdFecha);
    row.appendChild(tdMedio);
    row.appendChild(tdMonto);
    
    tbody.appendChild(row);
  });
}

/**
 * Obtiene la factura actual
 * @returns {Object|null} - Factura actual
 */
export function obtenerFacturaActual() {
  return facturaActual;
}

/**
 * Limpia la factura actual
 */
export function limpiarFacturaActual() {
  facturaActual = null;
}

// Exportar función para uso global
window.seleccionarFacturaPorId = seleccionarFacturaPorId;

