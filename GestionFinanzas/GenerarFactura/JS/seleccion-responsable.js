


function inicializarSeleccionResponsable() {
  
  
  const tbody = document.querySelector("#seleccionarResponsable tbody");
  if (!tbody) {
    return;
  }
  
  
  if (tbody._clickHandler) {
    tbody.removeEventListener("click", tbody._clickHandler);
  }
  
  
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
  
  
  tbody.addEventListener("click", tbody._clickHandler);
}


function obtenerResponsableSeleccionado() {
  return Array.from(document.querySelectorAll("#seleccionarResponsable tbody tr"))
    .find(row => row.style.backgroundColor === "yellow");
}


function validarResponsable() {
  const cuit = document.getElementById("cuit").value.trim();
  const selectedRow = obtenerResponsableSeleccionado();
  
  return selectedRow !== undefined || cuit !== "";
}

