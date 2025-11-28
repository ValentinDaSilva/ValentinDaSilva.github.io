// [JS/tabla-habitaciones.js]
// ====================================================
//   tabla-habitaciones.js  (Opción B - versión nueva)
// ====================================================

// Aplica colores según la clase asignada a cada celda
function aplicarEstilosCeldas() {
  const celdas = document.querySelectorAll(".tabla-habitaciones td");

  celdas.forEach(celda => {
    celda.style.color = "#000"; // color base seguro

    if (celda.classList.contains("estado-seleccionada")) {
      celda.style.backgroundColor = "yellow";
      return;
    }

    const estado = celda.dataset.estadoOriginal;

    switch (estado) {
      case "libre":
        celda.style.backgroundColor = "#c3e6cb"; // verde suave
        break;

      case "reservada":
        celda.style.backgroundColor = "#ffeeba"; // amarillo suave
        break;

      case "ocupada":
        celda.style.backgroundColor = "#f5c6cb"; // rojo suave
        break;

      case "fuera-servicio":
        celda.style.backgroundColor = "#c6c8ca"; // gris
        break;
    }
  });
}

// ----------------------------------------------------
// Exponer a window
// ----------------------------------------------------
window.aplicarEstilosCeldas = aplicarEstilosCeldas;

// Ejecutar al inicio
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", aplicarEstilosCeldas);
} else {
  aplicarEstilosCeldas();
}
