

import { obtenerFacturasNoAnuladasPorResponsable } from './datos-facturas.js';
import { obtenerResponsableActual } from './buscar-responsable.js';

let facturasActuales = [];


export function buscarFacturasNoAnuladas(dniCuit) {
  facturasActuales = obtenerFacturasNoAnuladasPorResponsable(dniCuit);
  return facturasActuales;
}


export function mostrarFacturasEnTabla(facturas, responsable) {
  const tbody = document.getElementById('tbodyFacturas');
  const mensajeSinFacturas = document.getElementById('mensajeSinFacturas');
  const contenedorTabla = document.getElementById('contenedorTablaFacturas');
  const responsableNombre = document.getElementById('responsableNombre');
  
  if (!tbody) return;
  
  
  if (responsableNombre && responsable) {
    if (responsable.tipo === 'tercero') {
      responsableNombre.textContent = responsable.razonSocial || '-';
    } else {
      responsableNombre.textContent = `${responsable.apellido || ''}, ${responsable.nombres || ''}`.trim();
    }
  }
  
  
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
    
    
    const tdCheckbox = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.dataset.facturaId = factura.id;
    tdCheckbox.appendChild(checkbox);
    
    
    const tdNumero = document.createElement('td');
    tdNumero.textContent = factura.id || '-';
    
    
    const tdFecha = document.createElement('td');
    tdFecha.textContent = factura.fecha || '-';
    
    
    const tdTotal = document.createElement('td');
    const total = factura.detalle?.total || 0;
    tdTotal.textContent = `$${total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    
    
    const tdEstado = document.createElement('td');
    tdEstado.textContent = factura.estado || '-';
    
    
    const tdTipo = document.createElement('td');
    tdTipo.textContent = factura.tipo || '-';
    
    row.appendChild(tdCheckbox);
    row.appendChild(tdNumero);
    row.appendChild(tdFecha);
    row.appendChild(tdTotal);
    row.appendChild(tdEstado);
    row.appendChild(tdTipo);
    
    tbody.appendChild(row);
  });
}


export function obtenerFacturasActuales() {
  return facturasActuales;
}




