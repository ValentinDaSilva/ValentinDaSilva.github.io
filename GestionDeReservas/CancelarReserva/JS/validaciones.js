


function convertirAMayusculas(input) {
  input.value = input.value.toUpperCase();
}


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


function limpiarErrores() {
  document.querySelectorAll('.mensaje-error').forEach(el => {
    el.style.display = 'none';
  });
  document.querySelectorAll('.campo-input').forEach(input => {
    input.classList.remove('campo-error');
  });
}


function validarApellido() {
  const apellido = document.getElementById('apellido').value.trim();
  
  if (!apellido) {
    mostrarErrorCampo('apellido', 'El campo apellido no puede estar vacío');
    return false;
  }
  
  return true;
}


function validarFormularioBusqueda() {
  limpiarErrores();
  return validarApellido();
}

