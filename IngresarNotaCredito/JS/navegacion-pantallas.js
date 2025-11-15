


export function mostrarPantallaBuscarResponsable() {
  const container = document.querySelector('.container');
  const buscarResponsable = document.getElementById('buscarResponsable');
  const listaFacturas = document.getElementById('listaFacturas');
  const resumenNotaCredito = document.getElementById('resumenNotaCredito');
  
  
  if (container) container.style.display = 'block';
  
  if (buscarResponsable) buscarResponsable.classList.remove('hidden');
  if (listaFacturas) listaFacturas.classList.add('hidden');
  if (resumenNotaCredito) resumenNotaCredito.classList.add('hidden');
}


export function mostrarPantallaListaFacturas() {
  const container = document.querySelector('.container');
  const buscarResponsable = document.getElementById('buscarResponsable');
  const listaFacturas = document.getElementById('listaFacturas');
  const resumenNotaCredito = document.getElementById('resumenNotaCredito');
  
  
  if (container) container.style.display = 'block';
  
  if (buscarResponsable) buscarResponsable.classList.add('hidden');
  if (listaFacturas) listaFacturas.classList.remove('hidden');
  if (resumenNotaCredito) resumenNotaCredito.classList.add('hidden');
}


export function mostrarPantallaResumenNotaCredito() {
  const container = document.querySelector('.container');
  const buscarResponsable = document.getElementById('buscarResponsable');
  const listaFacturas = document.getElementById('listaFacturas');
  const resumenNotaCredito = document.getElementById('resumenNotaCredito');
  
  
  if (container) container.style.display = 'none';
  
  if (buscarResponsable) buscarResponsable.classList.add('hidden');
  if (listaFacturas) listaFacturas.classList.add('hidden');
  if (resumenNotaCredito) resumenNotaCredito.classList.remove('hidden');
}


