/* Lógica de selección de responsable de pago */

/**
 * Inicializa la selección de responsable en la tabla
 */
function inicializarSeleccionResponsable() {
  // Agregar event listeners a las filas actuales
  // Usar event delegation para evitar problemas con listeners duplicados
  const tbody = document.querySelector("#seleccionarResponsable tbody");
  if (!tbody) {
    return;
  }
  
  // Remover el listener anterior si existe
  if (tbody._clickHandler) {
    tbody.removeEventListener("click", tbody._clickHandler);
  }
  
  // Crear nuevo handler
  tbody._clickHandler = function(event) {
    const row = event.target.closest("tr");
    if (!row || row.parentNode !== tbody) {
      return;
    }
    
    const edad = parseInt(row.children[2].textContent, 10);
    if (edad >= 18) {
      if (row.style.backgroundColor === "yellow") {
        row.style.backgroundColor = "white";
      } else {
        document.querySelectorAll("#seleccionarResponsable tbody tr").forEach(r => r.style.backgroundColor = "white");
        row.style.backgroundColor = "yellow";
      }
    } else {
      mensajeError("El responsable de pago debe ser mayor de edad.");
    }
  };
  
  // Agregar el listener al tbody (event delegation)
  tbody.addEventListener("click", tbody._clickHandler);
}

/**
 * Obtiene el responsable seleccionado de la tabla
 * @returns {HTMLElement|null} - La fila seleccionada o null si no hay ninguna seleccionada
 */
function obtenerResponsableSeleccionado() {
  return Array.from(document.querySelectorAll("#seleccionarResponsable tbody tr"))
    .find(row => row.style.backgroundColor === "yellow");
}

/**
 * Valida si hay un responsable seleccionado o un CUIT ingresado
 * @returns {boolean} - true si hay un responsable o CUIT, false en caso contrario
 */
function validarResponsable() {
  const cuit = document.getElementById("cuit").value.trim();
  const selectedRow = obtenerResponsableSeleccionado();
  
  return selectedRow !== undefined || cuit !== "";
}

