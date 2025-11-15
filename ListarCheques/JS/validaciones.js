/* Validaciones de formulario */

/**
 * Valida el formulario de fechas
 * @returns {boolean} - true si es válido, false en caso contrario
 */
export function validarFormularioFechas() {
  const fechaDesde = document.getElementById('fechaDesde').value;
  const fechaHasta = document.getElementById('fechaHasta').value;
  
  let esValido = true;
  
  // Validar fecha desde
  if (!fechaDesde) {
    mostrarError('fechaDesde', 'La fecha "Desde" es obligatoria');
    esValido = false;
  } else {
    ocultarError('fechaDesde');
  }
  
  // Validar fecha hasta
  if (!fechaHasta) {
    mostrarError('fechaHasta', 'La fecha "Hasta" es obligatoria');
    esValido = false;
  } else {
    ocultarError('fechaHasta');
  }
  
  // Validar que fecha desde sea anterior o igual a fecha hasta
  if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
    mostrarError('fechaHasta', 'La fecha "Hasta" debe ser posterior o igual a la fecha "Desde"');
    esValido = false;
  }
  
  return esValido;
}

/**
 * Valida que una fecha sea válida
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {boolean} - true si es válida
 */
export function validarFecha(fecha) {
  if (!fecha) return false;
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;
  
  const fechaObj = new Date(fecha);
  return fechaObj instanceof Date && !isNaN(fechaObj);
}

/**
 * Muestra un mensaje de error en un campo
 * @param {string} campoId - ID del campo
 * @param {string} mensaje - Mensaje de error
 */
function mostrarError(campoId, mensaje) {
  const errorElement = document.getElementById(`${campoId}-error`);
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.classList.add('mostrar');
  }
}

/**
 * Oculta el mensaje de error de un campo
 * @param {string} campoId - ID del campo
 */
function ocultarError(campoId) {
  const errorElement = document.getElementById(`${campoId}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('mostrar');
  }
}

