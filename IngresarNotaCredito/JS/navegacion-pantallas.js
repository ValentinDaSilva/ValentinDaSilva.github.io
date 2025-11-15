/* Navegación entre pantallas */

/**
 * Muestra la pantalla de búsqueda de responsable
 */
export function mostrarPantallaBuscarResponsable() {
  const container = document.querySelector('.container');
  const buscarResponsable = document.getElementById('buscarResponsable');
  const listaFacturas = document.getElementById('listaFacturas');
  const resumenNotaCredito = document.getElementById('resumenNotaCredito');
  
  // Mostrar el container
  if (container) container.style.display = 'block';
  
  if (buscarResponsable) buscarResponsable.classList.remove('hidden');
  if (listaFacturas) listaFacturas.classList.add('hidden');
  if (resumenNotaCredito) resumenNotaCredito.classList.add('hidden');
}

/**
 * Muestra la pantalla de lista de facturas
 */
export function mostrarPantallaListaFacturas() {
  const container = document.querySelector('.container');
  const buscarResponsable = document.getElementById('buscarResponsable');
  const listaFacturas = document.getElementById('listaFacturas');
  const resumenNotaCredito = document.getElementById('resumenNotaCredito');
  
  // Asegurar que el container esté visible
  if (container) container.style.display = 'block';
  
  if (buscarResponsable) buscarResponsable.classList.add('hidden');
  if (listaFacturas) listaFacturas.classList.remove('hidden');
  if (resumenNotaCredito) resumenNotaCredito.classList.add('hidden');
}

/**
 * Muestra la pantalla de resumen de Nota de Crédito
 */
export function mostrarPantallaResumenNotaCredito() {
  const container = document.querySelector('.container');
  const buscarResponsable = document.getElementById('buscarResponsable');
  const listaFacturas = document.getElementById('listaFacturas');
  const resumenNotaCredito = document.getElementById('resumenNotaCredito');
  
  // Ocultar el container completo
  if (container) container.style.display = 'none';
  
  if (buscarResponsable) buscarResponsable.classList.add('hidden');
  if (listaFacturas) listaFacturas.classList.add('hidden');
  if (resumenNotaCredito) resumenNotaCredito.classList.remove('hidden');
}


