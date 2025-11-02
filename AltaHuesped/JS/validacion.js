/* Funciones de validación del formulario */

/**
 * Verifica si un CUIT ya existe en el sistema
 * @param {Array} listaCUITS - Lista de CUITS existentes
 * @returns {boolean} - true si el CUIT existe, false en caso contrario
 */
function verificarCUIT(listaCUITS) {
    if(listaCUITS == undefined) listaCUITS = ["20-12345678-9", "20-34567890-1", "20-98765432-1"];
    const input = document.getElementById("cuit").value.trim();
    if (input !== "") {
        if(listaCUITS.includes(input)) {
            advertencia("¡CUIDADO! El tipo y número de documento ya existen en el sistema","CORREGIR ✏️ ","ACEPTAR ✅ ");
            return true;
        }
    }
    return false;
}

/**
 * Maneja el evento de envío del formulario
 * @param {Event} event - Evento del formulario
 */
function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    // Validar todos los campos usando las funciones de validación específicas
    const todosLosCamposValidos = validarTodosLosCampos();
    
    if (!todosLosCamposValidos) {
        mensajeError("Por favor, corrige los errores en los campos marcados antes de continuar");
        // Hacer scroll al primer campo con error
        const primerError = document.querySelector('.campo-invalido');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerError.focus();
        }
        return;
    }
    
    // Verificar CUIT duplicado
    if(verificarCUIT()) {
        return;
    }
    
    // Si todo está bien, mostrar pregunta de confirmación
    const nombres = document.getElementById("nombres").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    pregunta(
        `El huésped\n${nombres} ${apellido} ha sido\nsatisfactoriamente cargado al\nsistema. ¿Desea cargar otro?\n`,
        "SI ✅",
        "NO ❌",
        function() { mensajeCorrecto("Huésped cargado correctamente <br> <br>Presione cualquier tecla para continuar..."); },
        undefined
    );
}

/**
 * Inicializa el event listener del formulario
 */
function inicializarValidacionFormulario() {
    const formulario = document.getElementById("altaHuesped");
    if (formulario) {
        formulario.addEventListener("submit", manejarEnvioFormulario);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionFormulario);
} else {
    inicializarValidacionFormulario();
}

