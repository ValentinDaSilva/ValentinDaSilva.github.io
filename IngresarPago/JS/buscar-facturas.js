/* Búsqueda y visualización de facturas */

import { obtenerFacturasPendientesPorHabitacion } from './datos-facturas.js';
import { mensajeError } from './modales.js';

let habitacionActual = null;

/**
 * Busca las facturas pendientes para una habitación
 * @param {number} numeroHabitacion - Número de habitación
 * @returns {Array} - Array de facturas pendientes
 */
export function buscarFacturasPendientes(numeroHabitacion) {
  habitacionActual = numeroHabitacion;
  const facturas = obtenerFacturasPendientesPorHabitacion(numeroHabitacion);
  return facturas;
}

/**
 * Muestra las facturas pendientes en la tabla
 * @param {Array} facturas - Array de facturas pendientes
 */
export function mostrarFacturasEnTabla(facturas) {
  const tbody = document.getElementById('tbodyFacturas');
  const mensajeSinFacturas = document.getElementById('mensajeSinFacturas');
  const contenedorTabla = document.getElementById('contenedorTablaFacturas');
  
  if (!tbody) return;
  
  // Limpiar tabla
  tbody.innerHTML = '';
  
  if (facturas.length === 0) {
    if (mensajeSinFacturas) {
      mensajeSinFacturas.classList.remove('hidden');
    }
    if (contenedorTabla) {
      contenedorTabla.style.display = 'none';
    }
    return;
  }
  
  if (mensajeSinFacturas) {
    mensajeSinFacturas.classList.add('hidden');
  }
  if (contenedorTabla) {
    contenedorTabla.style.display = 'block';
  }
  
  // Llenar tabla
  facturas.forEach(factura => {
    const row = document.createElement('tr');
    row.dataset.facturaId = factura.id;
    
    // Número de factura
    const tdNumero = document.createElement('td');
    tdNumero.textContent = factura.id || '-';
    
    // Fecha
    const tdFecha = document.createElement('td');
    tdFecha.textContent = factura.fecha || '-';
    
    // Responsable
    const tdResponsable = document.createElement('td');
    let responsableTexto = '-';
    if (factura.responsableDePago) {
      if (factura.responsableDePago.tipo === 'tercero') {
        responsableTexto = factura.responsableDePago.razonSocial || '-';
      } else {
        responsableTexto = `${factura.responsableDePago.apellido || ''}, ${factura.responsableDePago.nombres || ''}`.trim();
      }
    }
    tdResponsable.textContent = responsableTexto;
    
    // Total
    const tdTotal = document.createElement('td');
    const total = factura.detalle?.total || 0;
    tdTotal.textContent = `$${total.toFixed(2)}`;
    
    // Botón seleccionar
    const tdSeleccionar = document.createElement('td');
    const botonSeleccionar = document.createElement('button');
    botonSeleccionar.textContent = 'Seleccionar';
    botonSeleccionar.type = 'button';
    botonSeleccionar.addEventListener('click', (e) => {
      e.stopPropagation();
      seleccionarFactura(factura.id);
    });
    tdSeleccionar.appendChild(botonSeleccionar);
    
    row.appendChild(tdNumero);
    row.appendChild(tdFecha);
    row.appendChild(tdResponsable);
    row.appendChild(tdTotal);
    row.appendChild(tdSeleccionar);
    
    tbody.appendChild(row);
  });
}

/**
 * Selecciona una factura
 * @param {number} idFactura - ID de la factura
 */
function seleccionarFactura(idFactura) {
  // Esta función será manejada por seleccion-factura.js
  if (window.seleccionarFacturaPorId) {
    window.seleccionarFacturaPorId(idFactura);
  }
}

/**
 * Obtiene la habitación actual
 * @returns {number|null} - Número de habitación actual
 */
export function obtenerHabitacionActual() {
  return habitacionActual;
}

