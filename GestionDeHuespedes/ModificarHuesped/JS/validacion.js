// JS/validacion.js
import GestorHuesped from "/GestionDeHuespedes/GestorHuesped.js";

function verificarCUIT(listaCUITS) {
    if (listaCUITS == undefined) listaCUITS = ["20-12345678-9", "20-34567890-1", "20-98765432-1"];
    const input = document.getElementById("cuit").value.trim();
    if (input !== "") {
        if (listaCUITS.includes(input)) {
            advertencia("¡CUIDADO! El tipo y número de documento ya existen en el sistema", "CORREGIR ✏️ ", "ACEPTAR ✅ ");
            return true;
        }
    }
    return false;
}

async function manejarGuardarFormulario(event) {
    event.preventDefault();

    if (hayModalAbierto && hayModalAbierto()) {
        return;
    }

    const todosLosCamposValidos = validarTodosLosCampos();

    if (!todosLosCamposValidos) {
        mensajeError("Por favor, corrige los errores en los campos marcados antes de continuar");

        const primerError = document.querySelector('.campo-invalido');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerError.focus();
        }
        return;
    }

    if (verificarCUIT()) {
        return;
    }

    try {
        await GestorHuesped.modificarHuesped(window.uiModificarHuesped);
    } catch (e) {
        console.error(e);
        mensajeError("Ocurrió un error al modificar el huésped.");
    }
}

async function manejarBotonBorrar(event) {
    event.preventDefault();

    if (hayModalAbierto && hayModalAbierto()) {
        return;
    }

    try {
        await GestorHuesped.borrarHuesped(window.uiModificarHuesped);
    } catch (e) {
        console.error(e);
        mensajeError("Ocurrió un error al eliminar el huésped.");
    }
}

function manejarBotonCancelar(event) {
    event.preventDefault();
    //window.location.href = '../BuscarHuesped/buscarHuesped.html';
}

function inicializarValidacionFormulario() {
    
}

function hayModalAbierto() {
    const modales = [
        document.getElementById('modalError'),
        document.getElementById('modalCorrecto'),
        document.getElementById('modalAdvertencia'),
        document.getElementById('modalPregunta'),
        document.getElementById('contenedor-json-modificacion')
    ];

    return modales.some(modal => {
        return modal && modal.style.display !== 'none' && modal.style.display !== '';
    });
}

