


function cambiarPantalla() {
  document.querySelector(".container").style.display = "block";
  document.getElementById('generarFactura').classList.add('hidden');
  document.getElementById('resumenFactura').classList.add('hidden');
  document.getElementById('seleccionarResponsable').classList.remove('hidden');
}


function volverFactura() {
  document.getElementById('seleccionarResponsable').classList.add('hidden');
  document.getElementById('generarFactura').classList.remove('hidden');
}


function facturar() {
  document.querySelector(".container").style.display = "none";
  document.querySelector("#resumenFactura").classList.remove("hidden");
}






