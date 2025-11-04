/* Validaciones de campos del formulario de búsqueda */

/**
 * Valida que una fecha no esté vacía
 * @param {HTMLInputElement} campoFecha - Campo de fecha a validar
 * @param {string} nombreCampo - Nombre del campo para el mensaje de error
 * @returns {boolean} - true si es válido, false si no
 */
function validarFecha(campoFecha, nombreCampo) {
  if (!campoFecha.value) {
    mensajeError(`Por favor, ingrese una fecha válida en "${nombreCampo}".`);
    campoFecha.focus();
    return false;
  }
  return true;
}

/**
 * Valida que la fecha de salida sea posterior a la fecha de entrada
 * @param {HTMLInputElement} checkinInput - Campo de fecha de entrada
 * @param {HTMLInputElement} checkoutInput - Campo de fecha de salida
 * @returns {boolean} - true si es válido, false si no
 */
function validarRangoFechas(checkinInput, checkoutInput) {
  if (new Date(checkinInput.value) >= new Date(checkoutInput.value)) {
    mensajeError('La fecha de salida debe ser posterior a la fecha de entrada.');
    checkinInput.value = '';
    checkoutInput.value = '';
    checkinInput.focus();
    return false;
  }
  return true;
}

/**
 * Valida todos los campos del formulario de búsqueda
 * @returns {boolean} - true si todos los campos son válidos
 */
function validarFormularioBusqueda() {
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  if (!validarFecha(checkinInput, 'Desde fecha')) {
    return false;
  }

  if (!validarFecha(checkoutInput, 'Hasta fecha')) {
    return false;
  }

  if (!validarRangoFechas(checkinInput, checkoutInput)) {
    return false;
  }

  return true;
}

/**
 * Inicializa los event listeners de validación en los campos de fecha
 */
function inicializarValidacionesCampos() {
  const checkinInput = document.getElementById('checkin');
  const checkoutInput = document.getElementById('checkout');

  if (!checkinInput || !checkoutInput) {
    console.error('Campos de fecha no encontrados');
    return;
  }

  [checkinInput, checkoutInput].forEach(input => {
    input.addEventListener('blur', function(event) {
      event.preventDefault();
      if (!event.target.value) {
        const fieldName = event.target.id === 'checkin' ? 'Desde fecha' : 'Hasta fecha';
        mensajeError(`Por favor, ingrese una fecha válida en "${fieldName}".`);
        event.target.focus();
      }
    });
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarValidacionesCampos);
} else {
  inicializarValidacionesCampos();
}

