


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
  try {
    console.log('facturar() - Ejecutando...');
    const container = document.querySelector(".container");
    const resumenFactura = document.querySelector("#resumenFactura");
    
    if (container) {
      container.style.display = "none";
      console.log('Container ocultado');
    } else {
      console.warn('No se encontró el elemento .container');
    }
    
    if (resumenFactura) {
      resumenFactura.classList.remove("hidden");
      console.log('Resumen de factura mostrado');
    } else {
      console.warn('No se encontró el elemento #resumenFactura');
    }
    
    console.log('facturar() - Completado');
  } catch (error) {
    console.error('Error en facturar():', error);
    throw error;
  }
}


if (typeof window !== 'undefined') {
  window.facturar = facturar;
}






