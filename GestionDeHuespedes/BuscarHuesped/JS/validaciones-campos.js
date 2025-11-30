


function mostrarError(campoId, mensaje) {
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


function ocultarError(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    const contenedorError = campo.parentElement.querySelector('.mensaje-error');
    if (contenedorError) {
        contenedorError.classList.remove('mostrar');
    }
    campo.classList.remove('campo-invalido');
    campo.classList.add('campo-valido');
}


function esSoloLetras(valor) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    return regex.test(valor);
}


function esSoloNumeros(valor) {
    const regex = /^\d+$/;
    return regex.test(valor);
}


function validarApellido(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; 
    }
    if (valor.trim().length < 1) {
        return { valido: false, mensaje: 'El apellido debe tener al menos 1 carácter' };
    }
    if (!esSoloLetras(valor.trim())) {
        return { valido: false, mensaje: 'El apellido solo puede contener letras y espacios' };
    }
    return { valido: true, mensaje: '' };
}


function validarnombre(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; 
    }
    if (valor.trim().length < 1) {
        return { valido: false, mensaje: 'Los nombre deben tener al menos 1 carácter' };
    }
    if (!esSoloLetras(valor.trim())) {
        return { valido: false, mensaje: 'Los nombre solo pueden contener letras y espacios' };
    }
    return { valido: true, mensaje: '' };
}


function validarNumeroDocumento(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; 
    }
    if (!esSoloNumeros(valor.trim())) {
        return { valido: false, mensaje: 'El número de documento solo puede contener números' };
    }
    
    return { valido: true, mensaje: '' };
}


function validarAlMenosUnCampo() {
    
    return { valido: true, mensaje: '' };
}


function validarCampo(campoId) {
    const campo = document.getElementById(campoId);
    if (!campo) return true;
    
    const valor = campo.value;
    let resultado = { valido: true, mensaje: '' };
    
    switch(campoId) {
        case 'apellido':
            resultado = validarApellido(valor);
            break;
        case 'nombre':
            resultado = validarnombre(valor);
            break;
        case 'numeroDocumento':
            resultado = validarNumeroDocumento(valor);
            break;
        case 'tipoDocumento':
            
            resultado = { valido: true, mensaje: '' };
            break;
        default:
            return true;
    }
    
    if (resultado.valido) {
        ocultarError(campoId);
        return true;
    } else {
        mostrarError(campoId, resultado.mensaje);
        return false;
    }
}


function validarTodosLosCampos() {
    const camposAValidar = ['apellido', 'nombre', 'numeroDocumento'];
    
    let todosValidos = true;
    camposAValidar.forEach(campoId => {
        if (!validarCampo(campoId)) {
            todosValidos = false;
        }
    });
    
    
    
    
    return todosValidos;
}


function inicializarValidacionTiempoReal() {
    const camposAValidar = ['apellido', 'nombre', 'numeroDocumento'];
    
    camposAValidar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            
            campo.addEventListener('blur', () => {
                validarCampo(campoId);
            });
            
            
            campo.addEventListener('input', () => {
                const mensajeError = campo.parentElement.querySelector('.mensaje-error.mostrar');
                if (mensajeError && campo.value.trim() !== '') {
                    ocultarError(campoId);
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

