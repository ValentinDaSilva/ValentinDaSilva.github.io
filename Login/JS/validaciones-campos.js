


function mostrarErrorCampo(campoId, mensaje) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    
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


function validarNombreUsuario(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El nombre es requerido' };
    }
    
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: 'El nombre debe tener al menos 2 caracteres' };
    }
    
    return { valido: true, mensaje: '' };
}


function validarContraseña(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'La contraseña es requerida' };
    }
    
    return { valido: true, mensaje: '' };
}


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


function limpiarMensajesError() {
    document.querySelectorAll('.mensaje-error').forEach(el => {
        el.classList.remove('mostrar');
        el.textContent = '';
    });
    
    document.querySelectorAll('.campo-invalido').forEach(el => {
        el.classList.remove('campo-invalido');
    });
}


function inicializarValidacionTiempoReal() {
    const camposAValidar = [
        'campo-nombre-usuario',
        'campo-contraseña'
    ];
    
    camposAValidar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            
            campo.addEventListener('blur', () => {
                validarCampoLogin(campoId);
            });
            
            
            campo.addEventListener('input', () => {
                const mensajeError = campo.parentElement.querySelector('.mensaje-error.mostrar');
                if (mensajeError && campo.value.trim() !== '') {
                    ocultarErrorCampo(campoId);
                }
            });
        }
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionTiempoReal);
} else {
    inicializarValidacionTiempoReal();
}

