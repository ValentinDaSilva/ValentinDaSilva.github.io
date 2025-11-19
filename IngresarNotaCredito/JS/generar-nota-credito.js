

import { obtenerFacturasSeleccionadasCompletas } from './seleccion-facturas.js';
import { obtenerResponsableActual } from './buscar-responsable.js';
import { esResponsableInscripto } from './datos-responsables.js';

let notaCreditoActual = null;


function calcularIVA(subtotal) {
  return subtotal * 0.21;
}


export function generarNotaCredito() {
  const facturas = obtenerFacturasSeleccionadasCompletas();
  const responsable = obtenerResponsableActual();
  
  if (!facturas || facturas.length === 0) {
    return null;
  }
  
  if (!responsable) {
    return null;
  }
  
  
  const total = facturas.reduce((acc, factura) => {
    return acc + (factura.detalle?.total || 0);
  }, 0);
  
  
  
  
  const esInscripto = esResponsableInscripto(responsable);
  let subtotal, iva;
  
  if (esInscripto) {
    
    subtotal = total / 1.21;
    iva = calcularIVA(subtotal);
  } else {
    
    subtotal = total;
    iva = 0;
  }
  
  
  const tipo = esInscripto ? 'A' : 'B';
  
  
  const fecha = new Date().toISOString().split('T')[0];
  
  
  notaCreditoActual = {
    idNota: null, 
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


export function mostrarNotaCreditoEnPantalla(notaCredito) {
  if (!notaCredito) return;
  
  
  const ncResponsableNombre = document.getElementById('ncResponsableNombre');
  if (ncResponsableNombre) {
    if (notaCredito.responsable.tipo === 'tercero') {
      ncResponsableNombre.textContent = notaCredito.responsable.razonSocial || '-';
    } else {
      ncResponsableNombre.textContent = `${notaCredito.responsable.apellido || ''}, ${notaCredito.responsable.nombres || ''}`.trim();
    }
  }
  
  
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
  
  
  const ncSubtotal = document.getElementById('ncSubtotal');
  if (ncSubtotal) {
    ncSubtotal.textContent = `$${notaCredito.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  
  const ncIva = document.getElementById('ncIva');
  const ncIvaSection = document.getElementById('ncIvaSection');
  if (ncIva) {
    ncIva.textContent = `$${notaCredito.iva.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (ncIvaSection) {
    
    ncIvaSection.style.display = notaCredito.tipo === 'A' ? 'flex' : 'none';
  }
  
  
  const ncTipo = document.getElementById('ncTipo');
  if (ncTipo) {
    ncTipo.textContent = notaCredito.tipo;
  }
  
  
  const ncTotal = document.getElementById('ncTotal');
  if (ncTotal) {
    ncTotal.textContent = `$${notaCredito.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}


export function obtenerNotaCreditoActual() {
  return notaCreditoActual;
}


export function limpiarNotaCreditoActual() {
  notaCreditoActual = null;
}


if (typeof window !== 'undefined') {
  window.mostrarNotaCreditoEnPantalla = mostrarNotaCreditoEnPantalla;
  window.obtenerNotaCreditoActual = obtenerNotaCreditoActual;
  window.limpiarNotaCreditoActual = limpiarNotaCreditoActual;
}




