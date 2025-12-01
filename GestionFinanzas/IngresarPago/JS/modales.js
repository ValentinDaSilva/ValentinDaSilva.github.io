


export function mensajeError(mensaje) {
  const modal = document.getElementById("modal");
  const errorMessage = document.getElementById("error-message");
  
  if (!modal || !errorMessage) {
    console.error('Modal de error no encontrado');
    return;
  }
  
  errorMessage.textContent = mensaje;
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  const okButton = document.getElementById("ok-button");
  if (okButton) {
    okButton.addEventListener("click", () => {
      modal.style.display = "none";
    }, { once: true });
  }
}


export function mensajeExito(mensaje, callback) {
  const modal = document.getElementById("modalExito");
  const exitoMessage = document.getElementById("exito-message");
  
  if (!modal || !exitoMessage) {
    console.error('Modal de éxito no encontrado');
    return;
  }
  
  exitoMessage.textContent = mensaje;
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  const okButton = document.getElementById("ok-exito-button");
  if (okButton) {
    okButton.addEventListener("click", () => {
      modal.style.display = "none";
      if (typeof callback === 'function') {
        callback();
      }
    }, { once: true });
  }
}

