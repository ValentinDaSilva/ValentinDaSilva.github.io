


function mensajeError(mensaje) {
  const modal = document.getElementById("modal");
  const errorMessage = document.getElementById("error-message");
  
  if (!modal || !errorMessage) {
    console.error('Modal de error no encontrado');
    return;
  }
  
  errorMessage.textContent = mensaje;
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";

  const okButton = document.getElementById("ok-button");
  if (okButton) {
    okButton.addEventListener("click", () => {
      modal.style.display = "none";
    }, { once: true });
  }
}


let preguntaCallbackBoton1 = null;
let preguntaCallbackBoton2 = null;


function pregunta(mensaje, boton1, boton2, callbackBoton1, callbackBoton2) {
  if (mensaje == undefined) mensaje = "Mensaje de Pregunta";
  if (boton1 == undefined) boton1 = "ACEPTAR ✅";
  if (boton2 == undefined) boton2 = "CANCELAR ❌";
  
  const modal = document.getElementById('modalPregunta');
  const errorMessage = document.getElementById('error-messagePregunta');
  
  if (!modal || !errorMessage) {
    console.error('Modal de pregunta no encontrado');
    return;
  }
  
  errorMessage.textContent = mensaje;
  const botonAceptar = document.getElementById("PreguntaBoton1");
  const botonCorregir = document.getElementById("PreguntaBoton2");
  
  
  preguntaCallbackBoton1 = callbackBoton1;
  preguntaCallbackBoton2 = callbackBoton2;
  
  if (botonAceptar && botonCorregir) {
    botonAceptar.textContent = boton1;
    botonCorregir.textContent = boton2;
  }
  
  modal.style.display = "flex";
  modal.style.justifyContent = "center";
  modal.style.alignItems = "center";
}


function manejarClickPreguntaBoton1() {
  const modal = document.getElementById('modalPregunta');
  if (modal) {
    modal.style.display = "none";
  }
  if (typeof preguntaCallbackBoton1 === 'function') {
    preguntaCallbackBoton1();
  }
  
  preguntaCallbackBoton1 = null;
  preguntaCallbackBoton2 = null;
}


function manejarClickPreguntaBoton2() {
  const modal = document.getElementById('modalPregunta');
  if (modal) {
    modal.style.display = "none";
  }
  if (typeof preguntaCallbackBoton2 === 'function') {
    preguntaCallbackBoton2();
  }
  
  preguntaCallbackBoton1 = null;
  preguntaCallbackBoton2 = null;
}

