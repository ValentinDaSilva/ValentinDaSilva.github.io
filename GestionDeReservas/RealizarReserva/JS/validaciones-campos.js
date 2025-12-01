
// [JS/validaciones-campos.js]



function validarFecha(campoFecha, nombreCampo) {
  if (!campoFecha.value) {
    mensajeError(`Por favor, ingrese una fecha válida en "${nombreCampo}".`);
    campoFecha.focus();
    return false;
  }
  return true;
}


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


function validarFormularioBusqueda() {
  const checkinInput = document.getElementById('fecha-desde');
  const checkoutInput = document.getElementById('fecha-hasta');

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


function inicializarValidacionesCampos() {
  const checkinInput = document.getElementById('fecha-desde');
  const checkoutInput = document.getElementById('fecha-hasta');

  if (!checkinInput || !checkoutInput) {
    console.error('Campos de fecha no encontrados');
    return;
  }

  [checkinInput, checkoutInput].forEach(input => {
    input.addEventListener('blur', function(event) {
      event.preventDefault();
      if (!event.target.value) {
        const fieldName = event.target.id === 'fecha-desde' ? 'Desde fecha' : 'Hasta fecha';
        mensajeError(`Por favor, ingrese una fecha válida en "${fieldName}".`);
        event.target.focus();
      }
    });
  });
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarValidacionesCampos);
} else {
  inicializarValidacionesCampos();
}