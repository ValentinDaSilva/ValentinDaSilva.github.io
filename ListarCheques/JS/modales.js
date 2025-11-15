/* Gestión de modales */

/**
 * Muestra el modal de error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
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

/**
 * Cierra el modal de error
 */
export function cerrarModalError() {
  const modal = document.getElementById('modal-error');
  if (modal) {
    modal.classList.remove('mostrar');
  }
}

/**
 * Muestra el modal de sin resultados
 */
export function mostrarModalSinResultados() {
  const modal = document.getElementById('modal-sin-resultados');
  if (modal) {
    modal.classList.add('mostrar');
  }
}

/**
 * Cierra el modal de sin resultados
 */
export function cerrarModalSinResultados() {
  const modal = document.getElementById('modal-sin-resultados');
  if (modal) {
    modal.classList.remove('mostrar');
  }
}

// Hacer funciones disponibles globalmente para los onclick
window.cerrarModalError = cerrarModalError;
window.cerrarModalSinResultados = cerrarModalSinResultados;

