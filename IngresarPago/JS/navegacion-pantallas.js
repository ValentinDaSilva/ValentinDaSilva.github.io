/* Navegación entre pantallas */

/**
 * Muestra la pantalla de ingreso de habitación
 */
export function mostrarPantallaInicial() {
  const pantallaInicial = document.getElementById('ingresoHabitacion');
  const pantallaFacturas = document.getElementById('listaFacturas');
  const pantallaPago = document.getElementById('detallePago');
  
  if (pantallaInicial) pantallaInicial.classList.remove('hidden');
  if (pantallaFacturas) pantallaFacturas.classList.add('hidden');
  if (pantallaPago) pantallaPago.classList.add('hidden');
  
  // Limpiar formulario
  const form = document.getElementById('habitacionForm');
  if (form) form.reset();
}

/**
 * Muestra la pantalla de lista de facturas
 */
export function mostrarPantallaFacturas() {
  const pantallaInicial = document.getElementById('ingresoHabitacion');
  const pantallaFacturas = document.getElementById('listaFacturas');
  const pantallaPago = document.getElementById('detallePago');
  
  if (pantallaInicial) pantallaInicial.classList.add('hidden');
  if (pantallaFacturas) pantallaFacturas.classList.remove('hidden');
  if (pantallaPago) pantallaPago.classList.add('hidden');
}

/**
 * Muestra la pantalla de pago
 */
export function mostrarPantallaPago() {
  const pantallaInicial = document.getElementById('ingresoHabitacion');
  const pantallaFacturas = document.getElementById('listaFacturas');
  const pantallaPago = document.getElementById('detallePago');
  
  if (pantallaInicial) pantallaInicial.classList.add('hidden');
  if (pantallaFacturas) pantallaFacturas.classList.add('hidden');
  if (pantallaPago) pantallaPago.classList.remove('hidden');
}

