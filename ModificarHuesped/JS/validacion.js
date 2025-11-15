


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


function manejarGuardarFormulario(event) {
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
    
    
    if(verificarCUIT()) {
        return;
    }
    
    
    
    if (window.gestorModificarHuesped) {
        const procesadoExitoso = window.gestorModificarHuesped.procesarModificacionHuesped();
        
        if (procesadoExitoso) {
            
            const nombres = document.getElementById("nombres").value.trim();
            const apellido = document.getElementById("apellido").value.trim();
            mensajeCorrecto(`El huésped<br>${nombres} ${apellido}<br>ha sido modificado correctamente.<br><br>Presione cualquier tecla para continuar...`);
        }
    } else {
        
        const nombres = document.getElementById("nombres").value.trim();
        const apellido = document.getElementById("apellido").value.trim();
        mensajeCorrecto(`El huésped<br>${nombres} ${apellido}<br>ha sido modificado correctamente.<br><br>Presione cualquier tecla para continuar...`);
    }
}


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
            
            
            window.addEventListener("keydown", function redirigir() {
                window.location.href = '../BuscarHuesped/buscarHuesped.html';
            }, { once: true });
            
            
            botonEliminar.removeEventListener("click", manejarEliminar);
        }, { once: true });
    }
}


function manejarBotonCancelar(event) {
    event.preventDefault();
    window.location.href = '../BuscarHuesped/buscarHuesped.html';
}


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


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionFormulario);
} else {
    inicializarValidacionFormulario();
}

