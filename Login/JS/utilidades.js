


function limpiarCamposFormulario() {
    const campoNombreUsuario = document.getElementById('campo-nombre-usuario');
    const campoContraseña = document.getElementById('campo-contraseña');
    
    if (campoNombreUsuario) {
        campoNombreUsuario.value = '';
        campoNombreUsuario.focus();
    }
    
    if (campoContraseña) {
        campoContraseña.value = '';
    }
    
    
    ocultarErrorCampo('campo-nombre-usuario');
    ocultarErrorCampo('campo-contraseña');
}


function guardarUrlAnterior() {
    
    const urlCompleta = window.location.pathname + window.location.search + window.location.hash;
    sessionStorage.setItem('urlAnterior', urlCompleta);
    
    sessionStorage.setItem('ultimaPaginaVisitada', urlCompleta);
    console.log('URL anterior guardada:', urlCompleta);
}


function obtenerUrlAnterior() {
    return sessionStorage.getItem('urlAnterior');
}


function eliminarUrlAnterior() {
    sessionStorage.removeItem('urlAnterior');
}


function redirigirAlMenu() {
    
    const urlAnterior = obtenerUrlAnterior();
    
    if (urlAnterior) {
        
        
        sessionStorage.setItem('urlAntesDelLogin', urlAnterior);
        console.log('Redirigiendo a URL anterior:', urlAnterior);
        window.location.href = urlAnterior;
        
    } else {
        
        window.location.href = '../index.html';
    }
}


function mostrarMensaje(mensaje) {
    alert(mensaje);
}


function inicializarNavegacionTeclado() {
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.key === 'Tab') {
            event.preventDefault();
            const inputs = document.querySelectorAll('input');
            const activeElement = document.activeElement;
            let currentIndex = -1;
            
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i] === activeElement) {
                    currentIndex = i;
                    break;
                }
            }
            
            if (currentIndex > 0) {
                inputs[currentIndex - 1].focus();
            } else {
                inputs[inputs.length - 1].focus();
            }
        }
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarNavegacionTeclado);
} else {
    inicializarNavegacionTeclado();
}

