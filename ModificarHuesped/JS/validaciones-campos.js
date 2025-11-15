/* Validaciones específicas para cada campo del formulario */

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
 * Valida el formato de email
 * @param {string} valor - Email a validar
 * @returns {boolean} - true si es válido
 */
function esEmailValido(valor) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(valor);
}

/**
 * Valida el formato de CUIT (XX-XXXXXXX-X o XX-XXXXXXXX-X)
 * Permite 7 u 8 dígitos en la parte media para DNI de ancianos
 * @param {string} valor - CUIT a validar
 * @returns {boolean} - true si es válido
 */
function esCUITValido(valor) {
    const regex = /^\d{2}-\d{7,8}-\d{1}$/;
    return regex.test(valor);
}

/**
 * Valida que la fecha no sea futura y sea razonable (al menos 18 años atrás)
 * @param {string} fecha - Fecha a validar (formato YYYY-MM-DD)
 * @returns {boolean} - true si es válida
 */
function esFechaValida(fecha) {
    if (!fecha) return false;
    
    const fechaIngresada = new Date(fecha);
    const hoy = new Date();
    const fechaMinima = new Date();
    fechaMinima.setFullYear(hoy.getFullYear() - 120); // No más de 120 años
    
    return fechaIngresada <= hoy && fechaIngresada >= fechaMinima;
}

/**
 * Valida el campo Apellido
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
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

/**
 * Valida el campo Nombres
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
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

/**
 * Valida el campo Número de Documento
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
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

/**
 * Valida el campo CUIT
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarCUIT(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; // CUIT es opcional
    }
    if (!esCUITValido(valor.trim())) {
        return { valido: false, mensaje: 'El CUIT debe tener el formato XX-XXXXXXX-X o XX-XXXXXXXX-X' };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida el campo Fecha de Nacimiento
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarFechaNacimiento(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'La fecha de nacimiento es requerida' };
    }
    if (!esFechaValida(valor)) {
        return { valido: false, mensaje: 'La fecha de nacimiento debe ser válida y no puede ser futura' };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida el campo Característica (código de área)
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
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

/**
 * Valida el campo Número de Teléfono
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
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

/**
 * Valida el campo Email
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarEmail(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: true, mensaje: '' }; // Email es opcional
    }
    if (!esEmailValido(valor.trim())) {
        return { valido: false, mensaje: 'El email debe tener un formato válido (ejemplo@correo.com)' };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida el campo Ocupación
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarOcupacion(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'La ocupación es requerida' };
    }
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: 'La ocupación debe tener al menos 2 caracteres' };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida el campo Código Postal
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
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

/**
 * Valida campos de texto genéricos (calle)
 * @param {string} valor - Valor del campo
 * @param {string} nombreCampo - Nombre del campo para el mensaje
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarCampoTexto(valor, nombreCampo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: `${nombreCampo} es requerido` };
    }
    if (valor.trim().length < 2) {
        return { valido: false, mensaje: `${nombreCampo} debe tener al menos 2 caracteres` };
    }
    return { valido: true, mensaje: '' };
}

/**
 * Valida campos que solo pueden contener letras (localidad, provincia, país, departamento)
 * @param {string} valor - Valor del campo
 * @param {string} nombreCampo - Nombre del campo para el mensaje
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
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

/**
 * Valida el campo Número de Calle
 * @param {string} valor - Valor del campo
 * @returns {Object} - {valido: boolean, mensaje: string}
 */
function validarNumeroCalle(valor) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'El número es requerido' };
    }
    // Permite números con letras opcionales (ej: 123, 123A, 123B)
    const regex = /^[0-9]+[A-Za-z]?$/;
    if (!regex.test(valor.trim())) {
        return { valido: false, mensaje: 'El número debe ser válido (ej: 123 o 123A)' };
    }
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
        case 'celular': // Compatibilidad con el nombre antiguo
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
        case 'numero': // Compatibilidad con el nombre antiguo
            resultado = validarNumeroCalle(valor);
            break;
        case 'localidad':
            resultado = validarCampoSoloLetras(valor, 'La localidad');
            break;
        case 'provincia':
            resultado = validarCampoSoloLetras(valor, 'La provincia');
            break;
        case 'pais':
            resultado = validarCampoSoloLetras(valor, 'El país');
            break;
        case 'departamento':
            if (!valor || valor.trim() === '') {
                resultado = { valido: true, mensaje: '' }; // Departamento es opcional
            } else {
                // Validar que solo contenga letras, sin restricción de longitud mínima
                if (!esSoloLetras(valor.trim())) {
                    resultado = { valido: false, mensaje: 'El departamento solo puede contener letras y espacios' };
                } else {
                    resultado = { valido: true, mensaje: '' };
                }
            }
            break;
        case 'piso':
            // Piso es opcional, no necesita validación específica
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
            // Campos opcionales sin validación específica
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
    const camposAValidar = [
        'apellido',
        'nombres',
        'tipoDocumento',
        'numeroDocumento',
        'cuit',
        'fechaNacimiento',
        'caracteristica',
        'telefonoNumero',
        'celular', // Compatibilidad
        'email',
        'ocupacion',
        'nacionalidad',
        'calle',
        'numeroCalle',
        'numero', // Compatibilidad
        'codigoPostal',
        'localidad',
        'provincia',
        'pais',
        'departamento'
    ];
    
    let todosValidos = true;
    camposAValidar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo && !validarCampo(campoId)) {
            todosValidos = false;
        }
    });
    
    return todosValidos;
}

/**
 * Inicializa los event listeners para validación en tiempo real
 */
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
        'celular', // Compatibilidad
        'email',
        'ocupacion',
        'nacionalidad',
        'calle',
        'numeroCalle',
        'numero', // Compatibilidad
        'codigoPostal',
        'localidad',
        'provincia',
        'pais',
        'departamento'
    ];
    
    // Campos que deben convertirse a mayúsculas
    const camposMayusculas = [
        'apellido',
        'nombres',
        'ocupacion',
        'calle',
        'localidad',
        'provincia',
        'departamento',
        'piso'
    ];
    
    camposAValidar.forEach(campoId => {
        const campo = document.getElementById(campoId);
        if (campo) {
            // Validar cuando el usuario sale del campo
            campo.addEventListener('blur', () => {
                // Convertir a mayúsculas si es un campo de texto que lo requiere
                if (camposMayusculas.includes(campoId)) {
                    campo.value = campo.value.toUpperCase();
                }
                validarCampo(campoId);
            });
            
            // Limpiar errores y convertir a mayúsculas mientras el usuario escribe
            campo.addEventListener('input', () => {
                // Convertir a mayúsculas en tiempo real si es un campo que lo requiere
                if (camposMayusculas.includes(campoId)) {
                    const cursorPosition = campo.selectionStart;
                    campo.value = campo.value.toUpperCase();
                    // Restaurar la posición del cursor
                    campo.setSelectionRange(cursorPosition, cursorPosition);
                }
                
                // Solo limpiar si ya había un error visible
                const mensajeError = campo.parentElement.querySelector('.mensaje-error.mostrar');
                if (mensajeError && campo.value.trim() !== '') {
                    ocultarError(campoId);
                }
            });
        }
    });
    
    // Agregar conversión a mayúsculas para campos que no están en la lista de validación
    // pero que sí necesitan conversión (como 'piso')
    camposMayusculas.forEach(campoId => {
        if (!camposAValidar.includes(campoId)) {
            const campo = document.getElementById(campoId);
            if (campo) {
                campo.addEventListener('blur', () => {
                    campo.value = campo.value.toUpperCase();
                });
                
                campo.addEventListener('input', () => {
                    const cursorPosition = campo.selectionStart;
                    campo.value = campo.value.toUpperCase();
                    campo.setSelectionRange(cursorPosition, cursorPosition);
                });
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionTiempoReal);
} else {
    inicializarValidacionTiempoReal();
}

