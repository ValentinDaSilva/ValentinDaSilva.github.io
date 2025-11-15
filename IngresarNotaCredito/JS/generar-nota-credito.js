/* Generación de Nota de Crédito */

import { obtenerFacturasSeleccionadasCompletas } from './seleccion-facturas.js';
import { obtenerResponsableActual } from './buscar-responsable.js';
import { esResponsableInscripto } from './datos-responsables.js';

let notaCreditoActual = null;

/**
 * Calcula el IVA (21% del subtotal)
 * @param {number} subtotal - Subtotal sin IVA
 * @returns {number} - Monto de IVA
 */
function calcularIVA(subtotal) {
  return subtotal * 0.21;
}

/**
 * Genera una Nota de Crédito con las facturas seleccionadas
 * @returns {Object|null} - Nota de crédito generada o null
 */
export function generarNotaCredito() {
  const facturas = obtenerFacturasSeleccionadasCompletas();
  const responsable = obtenerResponsableActual();
  
  if (!facturas || facturas.length === 0) {
    return null;
  }
  
  if (!responsable) {
    return null;
  }
  
  // Calcular total (suma de totales de facturas)
  const total = facturas.reduce((acc, factura) => {
    return acc + (factura.detalle?.total || 0);
  }, 0);
  
  // Calcular subtotal e IVA
  // Si el responsable es responsable inscripto, el total incluye IVA
  // Si no, el total ya es el total sin IVA
  const esInscripto = esResponsableInscripto(responsable);
  let subtotal, iva;
  
  if (esInscripto) {
    // El total incluye IVA, calcular subtotal
    subtotal = total / 1.21;
    iva = calcularIVA(subtotal);
  } else {
    // El total no incluye IVA (tipo B)
    subtotal = total;
    iva = 0;
  }
  
  // Determinar tipo de Nota de Crédito
  const tipo = esInscripto ? 'A' : 'B';
  
  // Fecha actual
  const fecha = new Date().toISOString().split('T')[0];
  
  // Crear Nota de Crédito
  notaCreditoActual = {
    idNota: null, // Se asignará al guardar
    fecha: fecha,
    tipo: tipo,
    total: total,
    subtotal: subtotal,
    iva: iva,
    responsable: responsable,
    facturas: facturas
  };
  
  return notaCreditoActual;
}

/**
 * Muestra la Nota de Crédito en pantalla
 * @param {Object} notaCredito - Nota de crédito a mostrar
 */
export function mostrarNotaCreditoEnPantalla(notaCredito) {
  if (!notaCredito) return;
  
  // Mostrar responsable
  const ncResponsableNombre = document.getElementById('ncResponsableNombre');
  if (ncResponsableNombre) {
    if (notaCredito.responsable.tipo === 'tercero') {
      ncResponsableNombre.textContent = notaCredito.responsable.razonSocial || '-';
    } else {
      ncResponsableNombre.textContent = `${notaCredito.responsable.apellido || ''}, ${notaCredito.responsable.nombres || ''}`.trim();
    }
  }
  
  // Mostrar facturas anuladas
  const listaFacturasAnuladas = document.getElementById('listaFacturasAnuladas');
  if (listaFacturasAnuladas) {
    listaFacturasAnuladas.innerHTML = '';
    notaCredito.facturas.forEach(factura => {
      const item = document.createElement('div');
      item.className = 'itemFactura';
      
      const numero = document.createElement('p');
      numero.textContent = `Factura #${factura.id}`;
      
      const total = document.createElement('p');
      const totalFactura = factura.detalle?.total || 0;
      total.textContent = `$${totalFactura.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      
      item.appendChild(numero);
      item.appendChild(total);
      listaFacturasAnuladas.appendChild(item);
    });
  }
  
  // Mostrar subtotal
  const ncSubtotal = document.getElementById('ncSubtotal');
  if (ncSubtotal) {
    ncSubtotal.textContent = `$${notaCredito.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  // Mostrar IVA
  const ncIva = document.getElementById('ncIva');
  const ncIvaSection = document.getElementById('ncIvaSection');
  if (ncIva) {
    ncIva.textContent = `$${notaCredito.iva.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (ncIvaSection) {
    // Mostrar IVA solo si es tipo A
    ncIvaSection.style.display = notaCredito.tipo === 'A' ? 'flex' : 'none';
  }
  
  // Mostrar tipo
  const ncTipo = document.getElementById('ncTipo');
  if (ncTipo) {
    ncTipo.textContent = notaCredito.tipo;
  }
  
  // Mostrar total
  const ncTotal = document.getElementById('ncTotal');
  if (ncTotal) {
    ncTotal.textContent = `$${notaCredito.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * Obtiene la Nota de Crédito actual
 * @returns {Object|null} - Nota de crédito actual
 */
export function obtenerNotaCreditoActual() {
  return notaCreditoActual;
}

/**
 * Limpia la Nota de Crédito actual
 */
export function limpiarNotaCreditoActual() {
  notaCreditoActual = null;
}




