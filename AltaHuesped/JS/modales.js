/* Funciones para manejar modales */

/**
 * Muestra un mensaje de éxito
 * @param {string} mensaje - Mensaje a mostrar
 */
function mensajeCorrecto(mensaje) {
    if (mensaje == undefined) mensaje = "Acción ejecutada con éxito";
    
    const modal = document.getElementById('modalCorrecto');
    const mensajeExito = document.getElementById('mensaje-correcto');
    
    if (!modal || !mensajeExito) return;
    
    mensajeExito.innerHTML = mensaje;
    
    modal.style.display = "flex";
    window.onkeydown = function() {
        modal.style.display = "none";
    };
}

/**
 * Muestra un mensaje de error
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mensajeError(mensaje) {
    const modal = document.getElementById('modalError');
    const mensajeErrorElement = document.getElementById('mensaje-error');
    
    if (!modal || !mensajeErrorElement) return;
    
    mensajeErrorElement.textContent = mensaje;
    
    modal.style.display = "flex";
    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

/**
 * Muestra un mensaje de advertencia con dos botones
 * @param {string} mensaje - Mensaje de advertencia
 * @param {string} boton1 - Texto del primer botón
 * @param {string} boton2 - Texto del segundo botón
 */
function advertencia(mensaje, boton1, boton2) {
    if(mensaje == undefined) mensaje = "Mensaje de Advertencia";
    if(boton1 == undefined) boton1 = "ACEPTAR";
    if(boton2 == undefined) boton2 = "CANCELAR";
    
    const modal = document.getElementById('modalAdvertencia');
    const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
    
    if (!modal || !mensajeAdvertencia) return;
    
    mensajeAdvertencia.textContent = mensaje;
    const botonAceptar = document.getElementById("boton-advertencia-aceptar");
    const botonCorregir = document.getElementById("boton-advertencia-corregir");
    
    if (botonAceptar) botonAceptar.textContent = boton1;
    if (botonCorregir) botonCorregir.textContent = boton2;
    modal.style.display = "flex";
}

/**
 * Muestra un mensaje de pregunta con dos botones y funciones callback
 * @param {string} mensaje - Mensaje de pregunta
 * @param {string} boton1 - Texto del primer botón
 * @param {string} boton2 - Texto del segundo botón
 * @param {Function} funcionBoton1 - Función a ejecutar al hacer clic en botón1
 * @param {Function} funcionBoton2 - Función a ejecutar al hacer clic en botón2
 */
function pregunta(mensaje, boton1, boton2, funcionBoton1, funcionBoton2) {
    if (mensaje == undefined) mensaje = "Mensaje de Pregunta";
    if (boton1 == undefined) boton1 = "ACEPTAR";
    if (boton2 == undefined) boton2 = "CANCELAR";
    
    const modal = document.getElementById('modalPregunta');
    const mensajePregunta = document.getElementById('mensaje-pregunta');
    
    if (!modal || !mensajePregunta) return;
    
    mensajePregunta.textContent = mensaje;
    const btn1 = document.getElementById("boton-pregunta-1");
    const btn2 = document.getElementById("boton-pregunta-2");
    
    if (btn1) btn1.textContent = boton1;
    if (btn2) btn2.textContent = boton2;
    modal.style.display = "flex";

    if (typeof funcionBoton1 === "function" && btn1) {
        btn1.addEventListener("click", () => {
            funcionBoton1();
        }, { once: true });
    }

    if (typeof funcionBoton2 === "function" && btn2) {
        btn2.addEventListener("click", () => {
            funcionBoton2();
        }, { once: true });
    }
}

/**
 * Inicializa los event listeners de los botones de cierre de modales
 */
function inicializarBotonesModal() {
    let botones = document.querySelectorAll(".boton-general");
    botones.forEach(boton => {
        boton.addEventListener("click", function() {
            document.querySelectorAll(".modal").forEach(modal => {
                modal.style.display = "none";
            });
        });
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBotonesModal);
} else {
    inicializarBotonesModal();
}

