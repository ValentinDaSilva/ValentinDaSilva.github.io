


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


function mensajeCorrecto(mensaje) {
  if (mensaje == undefined) mensaje = "Acción ejecutada con éxito";
  
  const modal = document.getElementById('modal-correcto');
  const mensajeCorrectoElement = document.getElementById('mensaje-correcto');
  
  if (!modal) {
    console.error('Modal de correcto no encontrado');
    return;
  }
  
  if (!mensajeCorrectoElement) {
    console.error('Elemento mensaje-correcto no encontrado');
    return;
  }
  
  mensajeCorrectoElement.innerHTML = mensaje;
  modal.style.display = "flex";
  
  
  modal.style.zIndex = "9999";
  
  window.onkeydown = function() {
    modal.style.display = "none";
  };
}


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

