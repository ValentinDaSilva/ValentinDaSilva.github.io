/* Funciones para manejar modales de login */

/**
 * Muestra un modal de error con un mensaje específico
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarModalError(mensaje) {
    const modalError = document.getElementById('modal-error');
    const mensajeError = document.getElementById('mensaje-error-modal');
    
    if (!modalError || !mensajeError) return;
    
    mensajeError.textContent = mensaje;
    modalError.style.display = 'flex';
}

/**
 * Muestra un modal de éxito
 */
function mostrarModalExito() {
    const modalExito = document.getElementById('modal-exito');
    if (!modalExito) return;
    
    modalExito.style.display = 'flex';
}

/**
 * Cierra el modal de error y limpia los campos del formulario
 */
function cerrarModalError() {
    const modalError = document.getElementById('modal-error');
    if (!modalError) return;
    
    modalError.style.display = 'none';
    limpiarCamposFormulario();
}

/**
 * Cierra el modal de éxito
 */
function cerrarModalExito() {
    const modalExito = document.getElementById('modal-exito');
    if (!modalExito) return;
    
    modalExito.style.display = 'none';
}

/**
 * Inicializa los event listeners para cerrar modales
 */
function inicializarEventListenersModales() {
    // Cerrar modales al hacer clic fuera de ellos
    window.addEventListener('click', function(event) {
        const modales = document.querySelectorAll('.modal');
        modales.forEach(modal => {
            if (event.target === modal) {
                if (modal.id === 'modal-error') {
                    cerrarModalError();
                } else if (modal.id === 'modal-exito') {
                    cerrarModalExito();
                }
            }
        });
    });

    // Cerrar modales con la tecla Escape o Enter
    document.addEventListener('keydown', function(event) {
        // Cerrar con Escape
        if (event.key === 'Escape') {
            const modales = document.querySelectorAll('.modal');
            modales.forEach(modal => {
                if (modal.style.display === 'flex') {
                    if (modal.id === 'modal-error') {
                        cerrarModalError();
                    } else if (modal.id === 'modal-exito') {
                        cerrarModalExito();
                    }
                }
            });
        }
        
        // Cerrar modales con Enter (solo cuando están visibles)
        if (event.key === 'Enter') {
            const modalError = document.getElementById('modal-error');
            const modalExito = document.getElementById('modal-exito');
            
            // Cerrar modal de error con Enter
            if (modalError && modalError.style.display === 'flex') {
                event.preventDefault();
                event.stopPropagation();
                cerrarModalError();
                return;
            }
            
            // Cerrar modal de éxito con Enter (equivale a presionar CONTINUAR)
            if (modalExito && modalExito.style.display === 'flex') {
                event.preventDefault();
                event.stopPropagation();
                redirigirAlMenu();
                return;
            }
        }
    });

    // Configurar el botón OK del modal de error
    const botonErrorOK = document.getElementById('boton-error-ok');
    if (botonErrorOK) {
        botonErrorOK.addEventListener('click', cerrarModalError);
    }

    // Configurar el botón CONTINUAR del modal de éxito
    const botonExitoContinuar = document.getElementById('boton-exito-continuar');
    if (botonExitoContinuar) {
        botonExitoContinuar.addEventListener('click', redirigirAlMenu);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarEventListenersModales);
} else {
    inicializarEventListenersModales();
}

