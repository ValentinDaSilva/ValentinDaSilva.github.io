


export function validarFormularioFechas() {
  const fechaDesde = document.getElementById('fechaDesde').value;
  const fechaHasta = document.getElementById('fechaHasta').value;
  
  let esValido = true;
  
  
  if (!fechaDesde) {
    mostrarError('fechaDesde', 'La fecha "Desde" es obligatoria');
    esValido = false;
  } else {
    ocultarError('fechaDesde');
  }
  
  
  if (!fechaHasta) {
    mostrarError('fechaHasta', 'La fecha "Hasta" es obligatoria');
    esValido = false;
  } else {
    ocultarError('fechaHasta');
  }
  
  
  if (fechaDesde && fechaHasta && fechaDesde > fechaHasta) {
    mostrarError('fechaHasta', 'La fecha "Hasta" debe ser posterior o igual a la fecha "Desde"');
    esValido = false;
  }
  
  return esValido;
}


export function validarFecha(fecha) {
  if (!fecha) return false;
  
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(fecha)) return false;
  
  const fechaObj = new Date(fecha);
  return fechaObj instanceof Date && !isNaN(fechaObj);
}


function mostrarError(campoId, mensaje) {
  const errorElement = document.getElementById(`${campoId}-error`);
  if (errorElement) {
    errorElement.textContent = mensaje;
    errorElement.classList.add('mostrar');
  }
}


function ocultarError(campoId) {
  const errorElement = document.getElementById(`${campoId}-error`);
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.classList.remove('mostrar');
  }
}

