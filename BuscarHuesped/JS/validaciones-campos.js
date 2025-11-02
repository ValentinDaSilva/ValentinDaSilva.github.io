/* Validaciones específicas para cada campo del formulario de búsqueda */

/**
 * Muestra un mensaje de error debajo de un campo
 * @param {string} campoId - ID del campo
 * @param {string} mensaje - Mensaje de error a mostrar
 */
function mostrarError(campoId, mensaje) {
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

/**
 * Valida que el campo contenga solo letras, espacios y acentos
 * @param {string} valor - Valor a validar
 * @returns {boolean} - true si es válido
 */
function esSoloLetras(valor) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;
    return regex.test(valor);
}

/**
 * Valida que el campo contenga solo números
 * @param {string} valor - Valor a validar
 * @returns {boolean} - true si es válido
 */
function esSoloNumeros(valor) {
    const regex = /^\d+$/;
    return regex.test(valor);
}

/**
 * Valida el campo Apellido (opcional, pero si tiene valor debe ser válido)
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarApellido(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; // Apellido es opcional en búsqueda
    }
    if (valor.trim().length < 1) {
        return { valido: false, mensaje: 'El apellido debe tener al menos 1 carácter' };
    }
    if (!esSoloLetras(valor.trim())) {
        return { valido: false, mensaje: 'El apellido solo puede contener letras y espacios' };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida el campo Nombres (opcional, pero si tiene valor debe ser válido)
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarNombres(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; // Nombres es opcional en búsqueda
    }
    if (valor.trim().length < 1) {
        return { valido: false, mensaje: 'Los nombres deben tener al menos 1 carácter' };
    }
    if (!esSoloLetras(valor.trim())) {
        return { valido: false, mensaje: 'Los nombres solo pueden contener letras y espacios' };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida el campo Número de Documento (opcional, pero si tiene valor debe ser válido)
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarNumeroDocumento(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; // Número de documento es opcional en búsqueda
    }
    if (!esSoloNumeros(valor.trim())) {
        return { valido: false, mensaje: 'El número de documento solo puede contener números' };
    }
    // En búsqueda no hay mínimo de caracteres, solo debe contener números
    return { valido: true, mensaje: '' };
}

/**
 * Valida que al menos un campo de búsqueda tenga valor
 * Ahora permite todos los campos vacíos (mostrará todos los huéspedes)
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarAlMenosUnCampo() {
    // Permitir todos los campos vacíos para mostrar todos los huéspedes
    return { valido: true, mensaje: '' };
}

/**
 * Valida un campo específico según su ID
 * @param {string} campoId - ID del campo a validar
 * @returns {boolean} - true si es válido
 */
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
        case 'tipoDocumento':
            // Tipo de documento es opcional, no necesita validación específica
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

/**
 * Valida todos los campos del formulario
 * @returns {boolean} - true si todos los campos son válidos
 */
function validarTodosLosCampos() {
    const camposAValidar = ['apellido', 'nombres', 'numeroDocumento'];
    
    let todosValidos = true;
    camposAValidar.forEach(campoId => {
        if (!validarCampo(campoId)) {
            todosValidos = false;
        }
    });
    
    // Ya no validamos que al menos un campo tenga valor
    // Permitimos todos los campos vacíos para mostrar todos los huéspedes
    
    return todosValidos;
}

/**
 * Inicializa los event listeners para validación en tiempo real
 */
function inicializarValidacionTiempoReal() {
    const camposAValidar = ['apellido', 'nombres', 'numeroDocumento'];
    
    camposAValidar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            // Validar cuando el usuario sale del campo
            campo.addEventListener('blur', () => {
                validarCampo(campoId);
            });
            
            // Limpiar errores mientras el usuario escribe
            campo.addEventListener('input', () => {
                const mensajeError = campo.parentElement.querySelector('.mensaje-error.mostrar');
                if (mensajeError && campo.value.trim() !== '') {
                    ocultarError(campoId);
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

