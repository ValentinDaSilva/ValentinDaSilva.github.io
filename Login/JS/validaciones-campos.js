/* Validaciones específicas para campos del formulario de login */

/**
 * Muestra un mensaje de error debajo de un campo
 * @param {string} campoId - ID del campo
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarErrorCampo(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    // Buscar o crear el contenedor de error
    let contenedorError = campo.parentElement.querySelector('.mensaje-error');
    if (!contenedorError) {
        contenedorError = document.createElement('div');
        contenedorError.className = 'mensaje-error';
        campo.parentElement.appendChild(contenedorError);
    }
    
    contenedorError.textContent = mensaje;
    contenedorError.classList.add('mostrar');
    campo.classList.remove('campo-valido');
    campo.classList.add('campo-invalido');
}

/**
 * Oculta el mensaje de error de un campo
 * @param {string} campoId - ID del campo
 */
function ocultarErrorCampo(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    const contenedorError = campo.parentElement.querySelector('.mensaje-error');
    if (contenedorError) {
        contenedorError.classList.remove('mostrar');
        contenedorError.textContent = '';
    }
    campo.classList.remove('campo-invalido');
}

/**
 * Valida el campo nombre de usuario
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarNombreUsuario(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El nombre es requerido' };
    }
    
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
    }
    
    return { valido: true, mensaje: '' };
}

/**
 * Valida el campo contraseña
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarContraseña(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'La contraseña es requerida' };
    }
    
    return { valido: true, mensaje: '' };
}

/**
 * Valida un campo específico según su ID
 * @param {string} campoId - ID del campo a validar
 * @returns {boolean} - true si es válido
 */
function validarCampoLogin(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return true;
    
    const valor = campo.value;
    let resultado = { valido: true, mensaje: '' };
    
    switch(campoId) {
        case 'campo-nombre-usuario':
            resultado = validarNombreUsuario(valor);
            break;
        case 'campo-contraseña':
            resultado = validarContraseña(valor);
            break;
        default:
            return true;
    }
    
    if (resultado.valido) {
        ocultarErrorCampo(campoId);
        return true;
    } else {
        mostrarErrorCampo(campoId, resultado.mensaje);
        return false;
    }
}

/**
 * Valida todos los campos del formulario de login
 * @returns {boolean} - true si todos los campos son válidos
 */
function validarTodosLosCamposLogin() {
    const camposAValidar = [
        'campo-nombre-usuario',
        'campo-contraseña'
    ];
    
    let todosValidos = true;
    camposAValidar.forEach(campoId => {
        if (!validarCampoLogin(campoId)) {
            todosValidos = false;
        }
    });
    
    return todosValidos;
}

/**
 * Limpia todos los mensajes de error
 */
function limpiarMensajesError() {
    document.querySelectorAll('.mensaje-error').forEach(el => {
        el.classList.remove('mostrar');
        el.textContent = '';
    });
    
    document.querySelectorAll('.campo-invalido').forEach(el => {
        el.classList.remove('campo-invalido');
    });
}

/**
 * Inicializa los event listeners para validación en tiempo real
 */
function inicializarValidacionTiempoReal() {
    const camposAValidar = [
        'campo-nombre-usuario',
        'campo-contraseña'
    ];
    
    camposAValidar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            // Validar cuando el usuario sale del campo
            campo.addEventListener('blur', () => {
                validarCampoLogin(campoId);
            });
            
            // Limpiar errores mientras el usuario escribe
            campo.addEventListener('input', () => {
                const mensajeError = campo.parentElement.querySelector('.mensaje-error.mostrar');
                if (mensajeError && campo.value.trim() !== '') {
                    ocultarErrorCampo(campoId);
                }
            });
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionTiempoReal);
} else {
    inicializarValidacionTiempoReal();
}

