/* Funciones para manejar modales de error, éxito y advertencia */

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mensajeError(mensaje) {
  const modal = document.getElementById('modal-error');
  const mensajeError = document.getElementById('mensaje-error');
  
  if (!modal || !mensajeError) {
    console.error('Modal de error no encontrado');
    return;
  }
  
  mensajeError.textContent = mensaje;
  modal.style.display = "flex";
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

  const botonOk = document.getElementById('boton-ok');
  if (botonOk) {
    botonOk.onclick = function() {
      modal.style.display = "none";
    };
  }
}

/**
 * Muestra un mensaje de éxito
 * @param {string} mensaje - Mensaje de éxito a mostrar
 */
function mensajeCorrecto(mensaje) {
  if (mensaje == undefined) mensaje = "Acción ejecutada con éxito";
  
  const modal = document.getElementById('modal-correcto');
  const mensajeCorrecto = document.getElementById('mensaje-correcto');
  
  if (!modal || !mensajeCorrecto) {
    console.error('Modal de correcto no encontrado');
    return;
  }
  
  mensajeCorrecto.innerHTML = mensaje;
  modal.style.display = "flex";
  
  window.onkeydown = function() {
    modal.style.display = "none";
  };
}

/**
 * Muestra un mensaje de advertencia
 * @param {string} mensaje - Mensaje de advertencia a mostrar
 */
function mensajeAdvertencia(mensaje) {
  const modal = document.getElementById('modal-advertencia');
  const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
  
  if (!modal || !mensajeAdvertencia) {
    console.error('Modal de advertencia no encontrado');
    return;
  }
  
  mensajeAdvertencia.textContent = mensaje;
  modal.style.display = "flex";
}

