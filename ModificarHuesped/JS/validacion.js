/* Funciones de validación del formulario de modificación */

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
 * Maneja el evento de envío del formulario (Guardar)
 * @param {Event} event - Evento del formulario
 */
function manejarGuardarFormulario(event) {
    event.preventDefault();
    
    // Verificar si hay algún modal abierto - si es así, no procesar el formulario
    if (hayModalAbierto && hayModalAbierto()) {
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
    
    // Si todo está bien, procesar la modificación usando el gestor de huéspedes
    // El gestor creará los objetos de dominio y DTO, y mostrará el JSON
    if (window.gestorModificarHuesped) {
        const procesadoExitoso = window.gestorModificarHuesped.procesarModificacionHuesped();
        
        if (procesadoExitoso) {
            // Mostrar mensaje de éxito después de mostrar el JSON
            const nombres = document.getElementById("nombres").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            mensajeCorrecto(`El huésped<br>${nombres} ${apellido}<br>ha sido modificado correctamente.<br><br>Presione cualquier tecla para continuar...`);
        }
    } else {
        // Fallback si el gestor no está disponible
        const nombres = document.getElementById("nombres").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        mensajeCorrecto(`El huésped<br>${nombres} ${apellido}<br>ha sido modificado correctamente.<br><br>Presione cualquier tecla para continuar...`);
    }
}

/**
 * Maneja el evento de clic en el botón Borrar
 * @param {Event} event - Evento del botón
 */
function manejarBotonBorrar(event) {
    event.preventDefault();
    
    const nombre = document.getElementById("nombres").value.trim();
    const tipoDocumento = document.getElementById("tipoDocumento").value.trim();
    const numeroDocumento = document.getElementById("numeroDocumento").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    
    advertencia(
        `Los datos del huésped <br> ${nombre} ${apellido}, ${tipoDocumento}: ${numeroDocumento} <br> serán eliminados del sistema`,
        "Cancelar",
        "Eliminar"
    );
    
    // Configurar el botón de eliminar cuando se muestre la advertencia
    const botonEliminar = document.getElementById("boton-advertencia-corregir");
    if (botonEliminar) {
        botonEliminar.addEventListener("click", function manejarEliminar() {
            const nombre = document.getElementById("nombres").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            const tipoDocumento = document.getElementById("tipoDocumento").value.trim();
            const numeroDocumento = document.getElementById("numeroDocumento").value.trim();
            
            mensajeCorrecto(
                `Los datos del huésped <br> ${nombre} ${apellido}, ${tipoDocumento}: ${numeroDocumento}<br> han sido eliminados del sistema. <br><br> PRESIONE CUALQUIER TECLA PARA CONTINUAR…`
            );
            
            // Redirigir a buscarHuesped después de presionar cualquier tecla
            window.addEventListener("keydown", function redirigir() {
                window.location.href = '../BuscarHuesped/buscarHuesped.html';
            }, { once: true });
            
            // Remover el listener para evitar múltiples ejecuciones
            botonEliminar.removeEventListener("click", manejarEliminar);
        }, { once: true });
    }
}

/**
 * Maneja el evento de clic en el botón Cancelar
 * @param {Event} event - Evento del botón
 */
function manejarBotonCancelar(event) {
    event.preventDefault();
    window.location.href = '../BuscarHuesped/buscarHuesped.html';
}

/**
 * Inicializa los event listeners del formulario
 */
function inicializarValidacionFormulario() {
    const formulario = document.getElementById("formularioModificarHuesped");
    if (formulario) {
        formulario.addEventListener("submit", manejarGuardarFormulario);
    }
    
    const botonBorrar = document.querySelector(".boton-borrar");
    if (botonBorrar) {
        botonBorrar.addEventListener("click", manejarBotonBorrar);
    }
    
    const botonCancelar = document.querySelector(".boton-cancelar");
    if (botonCancelar) {
        botonCancelar.addEventListener("click", manejarBotonCancelar);
    }
}

/**
 * Verifica si algún modal está abierto/visible
 * @returns {boolean} - true si hay algún modal abierto, false en caso contrario
 */
function hayModalAbierto() {
    const modales = [
        document.getElementById('modalError'),
        document.getElementById('modalCorrecto'),
        document.getElementById('modalAdvertencia'),
        document.getElementById('modalPregunta'),
        document.getElementById('contenedor-json-modificacion') // También considerar el contenedor JSON como modal
    ];
    
    return modales.some(modal => {
        return modal && modal.style.display !== 'none' && modal.style.display !== '';
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionFormulario);
} else {
    inicializarValidacionFormulario();
}

