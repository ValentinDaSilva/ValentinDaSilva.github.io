


export function mostrarModalError(mensaje) {
  const modal = document.getElementById('modal-error');
  const mensajeElement = document.getElementById('mensaje-error');
  
  if (mensajeElement) {
    mensajeElement.textContent = mensaje;
  }
  
  if (modal) {
    modal.classList.add('mostrar');
  }
}


export function cerrarModalError() {
  const modal = document.getElementById('modal-error');
  if (modal) {
    modal.classList.remove('mostrar');
  }
}


export function mostrarModalSinResultados() {
  const modal = document.getElementById('modal-sin-resultados');
  if (modal) {
    modal.classList.add('mostrar');
  }
}


export function cerrarModalSinResultados() {
  const modal = document.getElementById('modal-sin-resultados');
  if (modal) {
    modal.classList.remove('mostrar');
  }
}


window.cerrarModalError = cerrarModalError;
window.cerrarModalSinResultados = cerrarModalSinResultados;

