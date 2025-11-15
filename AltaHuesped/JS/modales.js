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
    
    // Cerrar al hacer clic fuera del modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

/**
 * Muestra un mensaje de advertencia con dos botones
 * @param {string} mensaje - Mensaje de advertencia
 * @param {string} boton1 - Texto del primer botón (ACEPTAR)
 * @param {string} boton2 - Texto del segundo botón (CORREGIR)
 * @param {Function} funcionAceptar - Función a ejecutar al hacer clic en ACEPTAR
 * @param {Function} funcionCorregir - Función a ejecutar al hacer clic en CORREGIR
 */
function advertencia(mensaje, boton1, boton2, funcionAceptar, funcionCorregir) {
    if(mensaje == undefined) mensaje = "Mensaje de Advertencia";
    if(boton1 == undefined) boton1 = "ACEPTAR";
    if(boton2 == undefined) boton2 = "CANCELAR";
    
    const modal = document.getElementById('modalAdvertencia');
    const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
    
    if (!modal || !mensajeAdvertencia) return;
    
    mensajeAdvertencia.textContent = mensaje;
    const botonAceptar = document.getElementById("boton-advertencia-aceptar");
    const botonCorregir = document.getElementById("boton-advertencia-corregir");
    
    // Remover todos los listeners anteriores clonando los botones
    const nuevoBotonAceptar = botonAceptar ? botonAceptar.cloneNode(true) : null;
    const nuevoBotonCorregir = botonCorregir ? botonCorregir.cloneNode(true) : null;
    
    if (nuevoBotonAceptar) nuevoBotonAceptar.textContent = boton1;
    if (nuevoBotonCorregir) nuevoBotonCorregir.textContent = boton2;
    
    if (botonAceptar && botonAceptar.parentNode && nuevoBotonAceptar) {
        botonAceptar.parentNode.replaceChild(nuevoBotonAceptar, botonAceptar);
    }
    if (botonCorregir && botonCorregir.parentNode && nuevoBotonCorregir) {
        botonCorregir.parentNode.replaceChild(nuevoBotonCorregir, botonCorregir);
    }
    
    // Agregar nuevos listeners
    if (typeof funcionAceptar === "function" && nuevoBotonAceptar) {
        nuevoBotonAceptar.addEventListener("click", () => {
            modal.style.display = "none";
            funcionAceptar();
        }, { once: true });
    } else if (nuevoBotonAceptar) {
        nuevoBotonAceptar.addEventListener("click", () => {
            modal.style.display = "none";
        }, { once: true });
    }
    
    if (typeof funcionCorregir === "function" && nuevoBotonCorregir) {
        nuevoBotonCorregir.addEventListener("click", () => {
            modal.style.display = "none";
            funcionCorregir();
        }, { once: true });
    } else if (nuevoBotonCorregir) {
        nuevoBotonCorregir.addEventListener("click", () => {
            modal.style.display = "none";
        }, { once: true });
    }
    
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

/**
 * Verifica si algún modal está abierto/visible
 * @returns {boolean} - true si hay algún modal abierto, false en caso contrario
 */
function hayModalAbierto() {
    const modales = [
        document.getElementById('modalError'),
        document.getElementById('modalCorrecto'),
        document.getElementById('modalAdvertencia'),
        document.getElementById('modalPregunta'),
        document.getElementById('contenedor-json') // También considerar el contenedor JSON como modal
    ];
    
    return modales.some(modal => {
        return modal && modal.style.display !== 'none' && modal.style.display !== '';
    });
}

/**
 * Inicializa el listener para la tecla Enter en los modales
 */
function inicializarEnterModalError() {
    // Listener único para manejar Enter en los modales
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            // Verificar modal de error
            const modalError = document.getElementById('modalError');
            if (modalError && modalError.style.display === 'flex') {
                event.preventDefault();
                event.stopPropagation(); // Prevenir que el evento se propague
                // Simular clic en el botón OK
                const botonOK = document.getElementById('boton-error-ok');
                if (botonOK) {
                    botonOK.click();
                } else {
                    modalError.style.display = 'none';
                }
                return;
            }
            
            // Verificar modal de éxito
            const modalCorrecto = document.getElementById('modalCorrecto');
            if (modalCorrecto && modalCorrecto.style.display === 'flex') {
                event.preventDefault();
                event.stopPropagation(); // Prevenir que el evento se propague
                modalCorrecto.style.display = 'none';
                return;
            }
            
            // Si hay algún modal o contenedor JSON abierto, prevenir el comportamiento por defecto
            // para que no se envíe el formulario
            if (hayModalAbierto()) {
                event.preventDefault();
                event.stopPropagation();
                // Si es el contenedor JSON, no hacer nada más (solo prevenir el submit)
                const contenedorJSON = document.getElementById('contenedor-json');
                if (contenedorJSON && contenedorJSON.style.display !== 'none' && contenedorJSON.style.display !== '') {
                    return; // El contenedor JSON se cierra con su propio botón
                }
                return;
            }
        }
    }, true); // Usar capture phase para interceptar antes que otros listeners
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        inicializarBotonesModal();
        inicializarEnterModalError();
    });
} else {
    inicializarBotonesModal();
    inicializarEnterModalError();
}

