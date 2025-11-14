/* Navegación entre pantallas */

/**
 * Cambia a la pantalla de selección de responsable
 */
function cambiarPantalla() {
  document.querySelector(".container").style.display = "block";
  document.getElementById('generarFactura').classList.add('hidden');
  document.getElementById('resumenFactura').classList.add('hidden');
  document.getElementById('seleccionarResponsable').classList.remove('hidden');
}

/**
 * Vuelve a la pantalla de formulario de factura
 */
function volverFactura() {
  document.getElementById('seleccionarResponsable').classList.add('hidden');
  document.getElementById('generarFactura').classList.remove('hidden');
}

/**
 * Muestra la pantalla de resumen de factura
 */
function facturar() {
  document.querySelector(".container").style.display = "none";
  document.querySelector("#resumenFactura").classList.remove("hidden");
}



