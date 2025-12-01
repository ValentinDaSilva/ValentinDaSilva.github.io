


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


function advertencia(mensaje, boton1, boton2) {
  if (mensaje == undefined) mensaje = "Mensaje de Advertencia";
  if (boton1 == undefined) boton1 = "ACEPTAR ✅";
  if (boton2 == undefined) boton2 = "CANCELAR ❌";
  
  return new Promise((resolve) => {
    const modal = document.getElementById('modal-advertencia');
    const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
    
    if (!modal || !mensajeAdvertencia) {
      console.error('Modal de advertencia no encontrado');
      resolve(null);
      return;
    }
    
    mensajeAdvertencia.innerHTML = mensaje;
    const botonAceptar = document.getElementById("boton-advertencia-aceptar");
    const botonCorregir = document.getElementById("boton-advertencia-corregir");
    
    if (botonAceptar) botonAceptar.textContent = boton1;
    if (botonCorregir) botonCorregir.textContent = boton2;
    
    modal.style.display = "flex";

    const cerrarModal = (botonTexto) => {
      modal.style.display = "none";
      resolve(botonTexto);
    };

    if (botonAceptar) {
      botonAceptar.onclick = () => cerrarModal(boton1);
    }
    if (botonCorregir) {
      botonCorregir.onclick = () => cerrarModal(boton2);
    }
  });
}


function pregunta(mensaje, boton1, boton2, boton3) {
  if (mensaje == undefined) mensaje = "Mensaje de Pregunta";
  if (boton1 == undefined) boton1 = "ACEPTAR ✅";
  if (boton2 == undefined) boton2 = "CANCELAR ❌";
  if (boton3 == undefined) boton3 = "OTRO ➕";
  
  return new Promise((resolve) => {
    const modal = document.getElementById('modal-pregunta');
    const mensajePregunta = document.getElementById('mensaje-pregunta');
    
    if (!modal || !mensajePregunta) {
      console.error('Modal de pregunta no encontrado');
      resolve(null);
      return;
    }
    
    mensajePregunta.textContent = mensaje;
    const preguntaBoton1 = document.getElementById("pregunta-boton-1");
    const preguntaBoton2 = document.getElementById("pregunta-boton-2");
    const preguntaBoton3 = document.getElementById("pregunta-boton-3");
    
    if (preguntaBoton1) preguntaBoton1.textContent = boton1;
    if (preguntaBoton2) preguntaBoton2.textContent = boton2;
    if (preguntaBoton3) preguntaBoton3.textContent = boton3;

    modal.style.display = "flex";

    const cerrarModal = (botonTexto) => {
      modal.style.display = "none";
      resolve(botonTexto);
    };

    if (preguntaBoton1) {
      preguntaBoton1.onclick = () => cerrarModal(boton1);
    }
    if (preguntaBoton2) {
      preguntaBoton2.onclick = () => cerrarModal(boton2);
    }
    if (preguntaBoton3) {
      preguntaBoton3.onclick = () => cerrarModal(boton3);
    }
  });
}
