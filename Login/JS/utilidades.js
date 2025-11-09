/* Funciones de utilidad para el login */

/**
 * Limpia todos los campos del formulario de login
 */
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
    
    // Limpiar mensajes de error
    ocultarErrorCampo('campo-nombre-usuario');
    ocultarErrorCampo('campo-contraseña');
}

/**
 * Guarda la URL anterior en sessionStorage para redirigir después del login
 * También guarda la última página visitada (para el botón volver)
 */
function guardarUrlAnterior() {
    // Guardar la URL completa incluyendo pathname, search y hash
    const urlCompleta = window.location.pathname + window.location.search + window.location.hash;
    sessionStorage.setItem('urlAnterior', urlCompleta);
    // También guardar como última página visitada
    sessionStorage.setItem('ultimaPaginaVisitada', urlCompleta);
    console.log('URL anterior guardada:', urlCompleta);
}

/**
 * Obtiene la URL anterior guardada
 * @returns {string|null} - URL anterior o null si no existe
 */
function obtenerUrlAnterior() {
    return sessionStorage.getItem('urlAnterior');
}

/**
 * Elimina la URL anterior guardada
 */
function eliminarUrlAnterior() {
    sessionStorage.removeItem('urlAnterior');
}

/**
 * Redirige al menú principal después de un login exitoso
 * Si hay una URL anterior guardada, redirige allí. Si no, va al index.
 */
function redirigirAlMenu() {
    // Verificar si hay una URL anterior guardada
    const urlAnterior = obtenerUrlAnterior();
    
    if (urlAnterior) {
        // Guardar la URL anterior en otra clave para el botón volver
        // No la eliminamos aquí porque el botón volver la necesita
        sessionStorage.setItem('urlAntesDelLogin', urlAnterior);
        console.log('Redirigiendo a URL anterior:', urlAnterior);
        window.location.href = urlAnterior;
        // No eliminamos urlAnterior todavía, se eliminará cuando se use en volver
    } else {
        // Si no hay URL anterior, ir al index
        window.location.href = '../index.html';
    }
}

/**
 * Muestra un mensaje temporal (para funciones en desarrollo)
 * @param {string} mensaje - Mensaje a mostrar
 */
function mostrarMensaje(mensaje) {
    alert(mensaje);
}

/**
 * Configura la navegación con Shift+Tab para retroceder entre campos
 */
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

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarNavegacionTeclado);
} else {
    inicializarNavegacionTeclado();
}

