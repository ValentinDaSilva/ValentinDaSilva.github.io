

import { obtenerFacturaPorId } from './datos-facturas.js';
import { mensajeError } from './modales.js';
import { mostrarPantallaPago } from './navegacion-pantallas.js';
import { convertirFacturaJSONAClase } from './convertir-factura-clase.js';

let facturaActual = null;


export function seleccionarFacturaPorId(idFactura) {
  const facturaJSON = obtenerFacturaPorId(idFactura);
  
  if (!facturaJSON) {
    mensajeError("No se encontró la factura seleccionada.");
    return;
  }
  
  if (facturaJSON.estado === 'Pagada') {
    mensajeError("No se puede pagar una factura ya pagada.");
    return;
  }
  
  // Convertir a clase Factura
  const factura = convertirFacturaJSONAClase(facturaJSON);
  facturaActual = factura;
  
  mostrarDatosFactura(facturaJSON);
  mostrarPagosRealizados(factura);
  
  
  mostrarPantallaPago();
}


function mostrarDatosFactura(factura) {
  
  const numeroElement = document.getElementById('facturaNumero');
  if (numeroElement) {
    numeroElement.textContent = factura.id || '-';
  }
  
  
  const responsableElement = document.getElementById('facturaResponsable');
  if (responsableElement) {
    let responsableTexto = '-';
    if (factura.responsableDePago) {
      if (factura.responsableDePago.tipo === 'juridica' || factura.responsableDePago.tipo === 'tercero' || factura.responsableDePago.tipo === 'personaJuridica') {
        responsableTexto = factura.responsableDePago.razonSocial || '-';
      } else {
        responsableTexto = `${factura.responsableDePago.apellido || ''}, ${factura.responsableDePago.nombre || ''}`.trim();
      }
    }
    responsableElement.textContent = responsableTexto;
  }
  
  
  const totalElement = document.getElementById('facturaTotal');
  if (totalElement) {
    const total = factura.total || 0;
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
  
  
  // Actualizar resumen con la instancia de clase
  actualizarResumenPago(facturaActual);
}


export function actualizarResumenPago(factura) {
  // Si se pasa un ID, obtener la factura actual
  if (typeof factura === 'number') {
    factura = facturaActual;
  }
  
  if (!factura) return;
  
  // Obtener total de la factura JSON si es necesario
  let total = 0;
  if (factura.total !== undefined) {
    total = factura.total || 0;
  } else if (factura.getTotal !== undefined) {
    // getTotal es un getter, no un método
    total = factura.getTotal || 0;
  }
  
  // Calcular total pagado desde los pagos de la clase Factura
  // getPagos es un getter, no un método, así que se accede sin paréntesis
  const pagos = (factura.getPagos !== undefined) ? factura.getPagos : (factura.pagos || []);
  const pagado = pagos.reduce((sum, pago) => {
    const monto = pago.montoTotal || pago.monto || 0;
    return sum + monto;
  }, 0);
  
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
  
  
  const botonFinalizar = document.getElementById('boton-finalizar');
  if (botonFinalizar) {
    if (deuda <= 0) {
      botonFinalizar.classList.remove('hidden');
    } else {
      botonFinalizar.classList.add('hidden');
    }
  }
}


export function mostrarPagosRealizados(factura) {
  const tbody = document.getElementById('tbodyPagos');
  if (!tbody) return;
  
  // Si se pasa un ID, obtener la factura actual
  if (typeof factura === 'number') {
    factura = facturaActual;
  }
  
  if (!factura) {
    tbody.innerHTML = '';
    return;
  }
  
  // Obtener pagos de la instancia de Factura
  // getPagos es un getter, no un método, así que se accede sin paréntesis
  const pagos = (factura.getPagos !== undefined) ? factura.getPagos : (factura.pagos || []);
  
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
  
  
  pagos.forEach(pago => {
    const row = document.createElement('tr');
    
    // Obtener fecha y hora del pago
    // En la clase Pago, los getters son fecha y hora directamente, no getFecha/getHora
    const fecha = pago.fecha || (pago._fecha || '-');
    const hora = pago.hora || (pago._hora || '');
    const tdFecha = document.createElement('td');
    tdFecha.textContent = `${fecha} ${hora}`;
    
    // Obtener medio de pago
    // En la clase Pago, el getter es medioDePago directamente, no getMedioDePago
    const medioDePago = pago.medioDePago || pago._medioDePago || null;
    const tdMedio = document.createElement('td');
    let nombreMedio = 'Desconocido';
    
    if (medioDePago) {
      const nombreClase = medioDePago.constructor.name;
      const nombreMedios = {
        'Efectivo': 'Efectivo',
        'MonedaExtranjera': 'Moneda Extranjera',
        'Cheque': 'Cheques',
        'Tarjeta': 'Tarjetas'
      };
      nombreMedio = nombreMedios[nombreClase] || nombreClase;
    } else if (pago.medioPago) {
      const nombreMedios = {
        'efectivo': 'Efectivo',
        'monedaExtranjera': 'Moneda Extranjera',
        'cheques': 'Cheques',
        'tarjetas': 'Tarjetas'
      };
      nombreMedio = nombreMedios[pago.medioPago] || pago.medioPago;
    }
    tdMedio.textContent = nombreMedio;
    
    // Obtener monto
    // En la clase Pago, el getter es montoTotal directamente, no getMontoTotal
    const monto = pago.montoTotal || pago._montoTotal || (pago.monto || 0);
    const tdMonto = document.createElement('td');
    tdMonto.textContent = `$${monto.toFixed(2)}`;
    
    row.appendChild(tdFecha);
    row.appendChild(tdMedio);
    row.appendChild(tdMonto);
    
    tbody.appendChild(row);
  });
}


export function obtenerFacturaActual() {
  return facturaActual;
}

export function establecerFacturaActual(factura) {
  facturaActual = factura;
}

export function limpiarFacturaActual() {
  facturaActual = null;
}


window.seleccionarFacturaPorId = seleccionarFacturaPorId;

