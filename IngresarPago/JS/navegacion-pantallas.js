


export function mostrarPantallaInicial() {
  const pantallaInicial = document.getElementById('ingresoHabitacion');
  const pantallaFacturas = document.getElementById('listaFacturas');
  const pantallaPago = document.getElementById('detallePago');
  
  if (pantallaInicial) pantallaInicial.classList.remove('hidden');
  if (pantallaFacturas) pantallaFacturas.classList.add('hidden');
  if (pantallaPago) pantallaPago.classList.add('hidden');
  
  
  const form = document.getElementById('habitacionForm');
  if (form) form.reset();
}


export function mostrarPantallaFacturas() {
  const pantallaInicial = document.getElementById('ingresoHabitacion');
  const pantallaFacturas = document.getElementById('listaFacturas');
  const pantallaPago = document.getElementById('detallePago');
  
  if (pantallaInicial) pantallaInicial.classList.add('hidden');
  if (pantallaFacturas) pantallaFacturas.classList.remove('hidden');
  if (pantallaPago) pantallaPago.classList.add('hidden');
}


export function mostrarPantallaPago() {
  const pantallaInicial = document.getElementById('ingresoHabitacion');
  const pantallaFacturas = document.getElementById('listaFacturas');
  const pantallaPago = document.getElementById('detallePago');
  
  if (pantallaInicial) pantallaInicial.classList.add('hidden');
  if (pantallaFacturas) pantallaFacturas.classList.add('hidden');
  if (pantallaPago) pantallaPago.classList.remove('hidden');
}

