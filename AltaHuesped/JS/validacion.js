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
 * Limpia/resetea todos los campos del formulario
 */
function reiniciarFormulario() {
    const formulario = document.getElementById("altaHuesped");
    if (formulario) {
        // Resetear el formulario (limpia todos los campos)
        formulario.reset();
        
        // Limpiar cualquier mensaje de error visible
        const mensajesError = document.querySelectorAll('.mensaje-error');
        mensajesError.forEach(mensaje => {
            mensaje.classList.remove('mostrar');
            mensaje.textContent = '';
        });
        
        // Remover clases de validación
        const campos = formulario.querySelectorAll('input, select, textarea');
        campos.forEach(campo => {
            campo.classList.remove('campo-invalido');
            campo.classList.remove('campo-valido');
        });
        
        // Cerrar el contenedor JSON si está abierto
        const contenedorJSON = document.getElementById('contenedor-json');
        if (contenedorJSON) {
            contenedorJSON.style.display = 'none';
        }
        
        // Hacer scroll al inicio del formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Enfocar el primer campo del formulario
        const primerCampo = formulario.querySelector('input, select');
        if (primerCampo) {
            primerCampo.focus();
        }
    }
}

/**
 * Maneja el evento de envío del formulario
 * @param {Event} event - Evento del formulario
 */
function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    // Verificar si hay algún modal abierto - si es así, no procesar el formulario
    if (hayModalAbierto()) {
        return;
    }
    
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
    
    // Si todo está bien, procesar el alta usando el gestor de huéspedes
    // El gestor creará los objetos de dominio y DTO, y mostrará el JSON
    const procesadoExitoso = gestorAltaHuesped.procesarAltaHuesped();
    
    if (procesadoExitoso) {
        // Mostrar pregunta de confirmación después de mostrar el JSON
        const nombres = document.getElementById("nombres").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        pregunta(
            `El huésped\n${nombres} ${apellido} ha sido\nsatisfactoriamente cargado al\nsistema. ¿Desea cargar otro?\n`,
            "SI ✅",
            "NO ❌",
            function() { 
                // Cerrar el contenedor JSON si está abierto
                const contenedorJSON = document.getElementById('contenedor-json');
                if (contenedorJSON) {
                    contenedorJSON.style.display = 'none';
                }
                
                // Cerrar el modal de pregunta
                const modalPregunta = document.getElementById('modalPregunta');
                if (modalPregunta) {
                    modalPregunta.style.display = 'none';
                }
                
                // Reiniciar el formulario (limpiar todos los campos)
                reiniciarFormulario();
                
                // Mostrar mensaje de éxito
                mensajeCorrecto("Huésped cargado correctamente. El formulario ha sido reiniciado.");
            },
            function() {
                // Cerrar el contenedor JSON si está abierto
                const contenedorJSON = document.getElementById('contenedor-json');
                if (contenedorJSON) {
                    contenedorJSON.style.display = 'none';
                }
                
                // Cerrar el modal de pregunta
                const modalPregunta = document.getElementById('modalPregunta');
                if (modalPregunta) {
                    modalPregunta.style.display = 'none';
                }
                
                // Volver a la pantalla principal
                window.location.href = '../index.html';
            }
        );
    }
}

/**
 * Previene el envío del formulario cuando se presiona Enter en un campo si hay un modal abierto
 */
function prevenirEnterEnFormularioConModal() {
    const formulario = document.getElementById("altaHuesped");
    if (!formulario) return;
    
    // Agregar listener a todos los campos del formulario
    const campos = formulario.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        campo.addEventListener('keydown', function(event) {
            // Si se presiona Enter y hay un modal abierto, prevenir el comportamiento por defecto
            if (event.key === 'Enter' && hayModalAbierto()) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });
    });
}

/**
 * Inicializa el event listener del formulario
 */
function inicializarValidacionFormulario() {
    const formulario = document.getElementById("altaHuesped");
    if (formulario) {
        formulario.addEventListener("submit", manejarEnvioFormulario);
        // Prevenir Enter en campos del formulario cuando hay modales abiertos
        prevenirEnterEnFormularioConModal();
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionFormulario);
} else {
    inicializarValidacionFormulario();
}

