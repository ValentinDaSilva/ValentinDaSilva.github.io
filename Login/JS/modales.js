


function mostrarModalError(mensaje) {
    const modalError = document.getElementById('modal-error');
    const mensajeError = document.getElementById('mensaje-error-modal');
    
    if (!modalError || !mensajeError) return;
    
    mensajeError.textContent = mensaje;
    modalError.style.display = 'flex';
}


function mostrarModalExito() {
    const modalExito = document.getElementById('modal-exito');
    if (!modalExito) return;
    
    modalExito.style.display = 'flex';
}


function cerrarModalError() {
    const modalError = document.getElementById('modal-error');
    if (!modalError) return;
    
    modalError.style.display = 'none';
    limpiarCamposFormulario();
}


function cerrarModalExito() {
    const modalExito = document.getElementById('modal-exito');
    if (!modalExito) return;
    
    modalExito.style.display = 'none';
}


function inicializarEventListenersModales() {
    
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

    
    document.addEventListener('keydown', function(event) {
        
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
        
        
        if (event.key === 'Enter') {
            const modalError = document.getElementById('modal-error');
            const modalExito = document.getElementById('modal-exito');
            
            
            if (modalError && modalError.style.display === 'flex') {
                event.preventDefault();
                event.stopPropagation();
                cerrarModalError();
                return;
            }
            
            
            if (modalExito && modalExito.style.display === 'flex') {
                event.preventDefault();
                event.stopPropagation();
                redirigirAlMenu();
                return;
            }
        }
    });

    
    const botonErrorOK = document.getElementById('boton-error-ok');
    if (botonErrorOK) {
        botonErrorOK.addEventListener('click', cerrarModalError);
    }

    
    const botonExitoContinuar = document.getElementById('boton-exito-continuar');
    if (botonExitoContinuar) {
        botonExitoContinuar.addEventListener('click', redirigirAlMenu);
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarEventListenersModales);
} else {
    inicializarEventListenersModales();
}

