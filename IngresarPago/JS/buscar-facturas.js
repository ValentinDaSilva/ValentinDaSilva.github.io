

import { obtenerFacturasPendientesPorHabitacion } from './datos-facturas.js';
import { mensajeError } from './modales.js';

let habitacionActual = null;


export function buscarFacturasPendientes(numeroHabitacion) {
  habitacionActual = numeroHabitacion;
  const facturas = obtenerFacturasPendientesPorHabitacion(numeroHabitacion);
  return facturas;
}


export function mostrarFacturasEnTabla(facturas) {
  const tbody = document.getElementById('tbodyFacturas');
  const mensajeSinFacturas = document.getElementById('mensajeSinFacturas');
  const contenedorTabla = document.getElementById('contenedorTablaFacturas');
  
  if (!tbody) return;
  
  
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
  
  
  facturas.forEach(factura => {
    const row = document.createElement('tr');
    row.dataset.facturaId = factura.id;
    
    
    const tdNumero = document.createElement('td');
    tdNumero.textContent = factura.id || '-';
    
    
    const tdFecha = document.createElement('td');
    tdFecha.textContent = factura.fecha || '-';
    
    
    const tdResponsable = document.createElement('td');
    let responsableTexto = '-';
    if (factura.responsableDePago) {
      if (factura.responsableDePago.tipo === 'juridica' || factura.responsableDePago.tipo === 'tercero' || factura.responsableDePago.tipo === 'personaJuridica') {
        responsableTexto = factura.responsableDePago.razonSocial || '-';
      } else {
        responsableTexto = `${factura.responsableDePago.apellido || ''}, ${factura.responsableDePago.nombres || ''}`.trim();
      }
    }
    tdResponsable.textContent = responsableTexto;
    
    
    const tdTotal = document.createElement('td');
    const total = factura.total || 0;
    tdTotal.textContent = `$${total.toFixed(2)}`;
    
    
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


function seleccionarFactura(idFactura) {
  
  if (window.seleccionarFacturaPorId) {
    window.seleccionarFacturaPorId(idFactura);
  }
}


export function obtenerHabitacionActual() {
  return habitacionActual;
}

