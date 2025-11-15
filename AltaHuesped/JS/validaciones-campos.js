


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


function esEmailValido(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
}


function esCUITValido(valor) {
    const regex = /^\d{2}-\d{7,8}-\d{1}$/;
    return regex.test(valor);
}


function esFechaValida(fecha) {
    if (!fecha) return false;
    
    const fechaIngresada = new Date(fecha);
    const hoy = new Date();
    const fechaMinima = new Date();
    fechaMinima.setFullYear(hoy.getFullYear() - 120); 
    
    return fechaIngresada <= hoy && fechaIngresada >= fechaMinima;
}


function validarApellido(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El apellido es requerido' };
    }
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: 'El apellido debe tener al menos 2 caracteres' };
    }
    if (!esSoloLetras(valor.trim())) {
        return { valido: false, mensaje: 'El apellido solo puede contener letras y espacios' };
    }
    return { valido: true, mensaje: '' };
}


function validarNombres(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'Los nombres son requeridos' };
    }
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: 'Los nombres deben tener al menos 2 caracteres' };
    }
    if (!esSoloLetras(valor.trim())) {
        return { valido: false, mensaje: 'Los nombres solo pueden contener letras y espacios' };
    }
    return { valido: true, mensaje: '' };
}


function validarNumeroDocumento(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El número de documento es requerido' };
    }
    if (!esSoloNumeros(valor.trim())) {
        return { valido: false, mensaje: 'El número de documento solo puede contener números' };
    }
    if (valor.trim().length < 7 || valor.trim().length > 9) {
        return { valido: false, mensaje: 'El número de documento debe tener entre 7 y 9 dígitos' };
    }
    return { valido: true, mensaje: '' };
}


function validarCUIT(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; 
    }
    if (!esCUITValido(valor.trim())) {
        return { valido: false, mensaje: 'El CUIT debe tener el formato XX-XXXXXXX-X' };
    }
    return { valido: true, mensaje: '' };
}


function validarFechaNacimiento(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'La fecha de nacimiento es requerida' };
    }
    if (!esFechaValida(valor)) {
        return { valido: false, mensaje: 'La fecha de nacimiento debe ser válida y no puede ser futura' };
    }
    return { valido: true, mensaje: '' };
}


function validarCaracteristica(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El código de área es requerido' };
    }
    if (!esSoloNumeros(valor.trim())) {
        return { valido: false, mensaje: 'El código de área solo puede contener números' };
    }
    if (valor.trim().length < 2 || valor.trim().length > 4) {
        return { valido: false, mensaje: 'El código de área debe tener entre 2 y 4 dígitos' };
    }
    return { valido: true, mensaje: '' };
}


function validarTelefonoNumero(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El número de teléfono es requerido' };
    }
    if (!esSoloNumeros(valor.trim())) {
        return { valido: false, mensaje: 'El número de teléfono solo puede contener números' };
    }
    if (valor.trim().length < 6 || valor.trim().length > 8) {
        return { valido: false, mensaje: 'El número de teléfono debe tener entre 6 y 8 dígitos' };
    }
    return { valido: true, mensaje: '' };
}


function validarEmail(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; 
    }
    if (!esEmailValido(valor.trim())) {
        return { valido: false, mensaje: 'El email debe tener un formato válido (ejemplo@correo.com)' };
    }
    return { valido: true, mensaje: '' };
}


function validarOcupacion(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'La ocupación es requerida' };
    }
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: 'La ocupación debe tener al menos 2 caracteres' };
    }
    return { valido: true, mensaje: '' };
}


function validarCodigoPostal(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El código postal es requerido' };
    }
    if (!esSoloNumeros(valor.trim())) {
        return { valido: false, mensaje: 'El código postal solo puede contener números' };
    }
    if (valor.trim().length < 4 || valor.trim().length > 8) {
        return { valido: false, mensaje: 'El código postal debe tener entre 4 y 8 dígitos' };
    }
    return { valido: true, mensaje: '' };
}


function validarCampoTexto(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `${nombreCampo} es requerido` };
    }
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: `${nombreCampo} debe tener al menos 2 caracteres` };
    }
    return { valido: true, mensaje: '' };
}


function validarCampoSoloLetras(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `${nombreCampo} es requerido` };
    }
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: `${nombreCampo} debe tener al menos 2 caracteres` };
    }
    if (!esSoloLetras(valor.trim())) {
        return { valido: false, mensaje: `${nombreCampo} solo puede contener letras y espacios` };
    }
    return { valido: true, mensaje: '' };
}


function validarNumeroCalle(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El número es requerido' };
    }
    
    if (!esSoloNumeros(valor.trim())) {
        return { valido: false, mensaje: 'El número solo puede contener números' };
    }
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
        case 'nombres':
            resultado = validarNombres(valor);
            break;
        case 'numeroDocumento':
            resultado = validarNumeroDocumento(valor);
            break;
        case 'cuit':
            resultado = validarCUIT(valor);
            break;
        case 'fechaNacimiento':
            resultado = validarFechaNacimiento(valor);
            break;
        case 'caracteristica':
            resultado = validarCaracteristica(valor);
            break;
        case 'telefonoNumero':
            resultado = validarTelefonoNumero(valor);
            break;
        case 'email':
            resultado = validarEmail(valor);
            break;
        case 'ocupacion':
            resultado = validarOcupacion(valor);
            break;
        case 'codigoPostal':
            resultado = validarCodigoPostal(valor);
            break;
        case 'calle':
            resultado = validarCampoTexto(valor, 'La calle');
            break;
        case 'numeroCalle':
            resultado = validarNumeroCalle(valor);
            break;
        case 'localidad':
            resultado = validarCampoSoloLetras(valor, 'La localidad');
            break;
        case 'provincia':
            resultado = validarCampoSoloLetras(valor, 'La provincia');
            break;
        case 'pais':
            if (!valor || valor === '') {
                resultado = { valido: false, mensaje: 'Debe seleccionar un país' };
            } else {
                resultado = { valido: true, mensaje: '' };
            }
            break;
        case 'departamento':
            if (!valor || valor.trim() === '') {
                resultado = { valido: true, mensaje: '' }; 
            } else {
                
                if (!esSoloLetras(valor.trim())) {
                    resultado = { valido: false, mensaje: 'El departamento solo puede contener letras y espacios' };
                } else {
                    resultado = { valido: true, mensaje: '' };
                }
            }
            break;
        case 'piso':
            
            resultado = { valido: true, mensaje: '' };
            break;
        case 'tipoDocumento':
            if (!valor || valor === '') {
                resultado = { valido: false, mensaje: 'Debe seleccionar un tipo de documento' };
            }
            break;
        case 'nacionalidad':
            if (!valor || valor === '') {
                resultado = { valido: false, mensaje: 'Debe seleccionar una nacionalidad' };
            }
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
    const camposAValidar = [
        'apellido',
        'nombres',
        'tipoDocumento',
        'numeroDocumento',
        'cuit',
        'fechaNacimiento',
        'caracteristica',
        'telefonoNumero',
        'email',
        'ocupacion',
        'nacionalidad',
        'calle',
        'numeroCalle',
        'codigoPostal',
        'localidad',
        'provincia',
        'pais',
        'departamento'
    ];
    
    let todosValidos = true;
    camposAValidar.forEach(campoId => {
        if (!validarCampo(campoId)) {
            todosValidos = false;
        }
    });
    
    return todosValidos;
}


function inicializarValidacionTiempoReal() {
    const camposAValidar = [
        'apellido',
        'nombres',
        'tipoDocumento',
        'numeroDocumento',
        'cuit',
        'fechaNacimiento',
        'caracteristica',
        'telefonoNumero',
        'email',
        'ocupacion',
        'nacionalidad',
        'calle',
        'numeroCalle',
        'codigoPostal',
        'localidad',
        'provincia',
        'pais',
        'departamento'
    ];
    
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

