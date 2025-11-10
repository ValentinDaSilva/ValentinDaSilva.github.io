/* Validaciones de campos del formulario */

/**
 * Convierte el texto del input a mayúsculas automáticamente
 * @param {HTMLInputElement} input - Campo de entrada a convertir
 */
function convertirAMayusculas(input) {
  input.value = input.value.toUpperCase();
}

/**
 * Muestra un error en un campo específico
 * @param {string} campoId - ID del campo
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorCampo(campoId, mensaje) {
  const input = document.getElementById(campoId);
  const errorDiv = document.getElementById(campoId + '-error');
  
  if (input && errorDiv) {
    input.classList.add('campo-error');
    errorDiv.textContent = mensaje;
    errorDiv.style.display = 'block';
    input.focus();
  }
}

/**
 * Limpia todos los errores de los campos
 */
function limpiarErrores() {
  document.querySelectorAll('.mensaje-error').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.campo-input').forEach(input => {
    input.classList.remove('campo-error');
  });
}

/**
 * Valida que el campo apellido no esté vacío
 * @returns {boolean} - true si es válido, false si no
 */
function validarApellido() {
  const apellido = document.getElementById('apellido').value.trim();
  
  if (!apellido) {
    mostrarErrorCampo('apellido', 'El campo apellido no puede estar vacío');
    return false;
  }
  
  return true;
}

/**
 * Valida el formulario de búsqueda
 * @returns {boolean} - true si es válido, false si no
 */
function validarFormularioBusqueda() {
  limpiarErrores();
  return validarApellido();
}

