


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
    
    
    
    let procesadoExitoso = false;
    const nombres = document.getElementById("nombres").value.trim();
    const apellido = document.getElementById("apellido").value.trim();
    
    if (window.gestorHuesped) {
        procesadoExitoso = await window.gestorHuesped.modificarHuespedCompleto(function() {
            mensajeCorrecto(`El huésped<br>${nombres} ${apellido}<br>ha sido modificado correctamente.<br><br>Presione cualquier tecla para continuar...`);
        });
    } else if (window.gestorModificarHuesped) {
        procesadoExitoso = window.gestorModificarHuesped.procesarModificacionHuesped(function() {
            mensajeCorrecto(`El huésped<br>${nombres} ${apellido}<br>ha sido modificado correctamente.<br><br>Presione cualquier tecla para continuar...`);
        });
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
            
            
            const jsonHuespedBorrar = crearJSONHuespedBorrar();
            mostrarJSONModificacionEnPantalla(jsonHuespedBorrar, null, function() {
                mensajeCorrecto(
                    `Los datos del huésped <br> ${nombre} ${apellido}, ${tipoDocumento}: ${numeroDocumento}<br> han sido eliminados del sistema. <br><br> PRESIONE CUALQUIER TECLA PARA CONTINUAR…`
                );
                
                
                window.addEventListener("keydown", function redirigir() {
                    window.location.href = '../BuscarHuesped/buscarHuesped.html';
                }, { once: true });
            }, true);
            
            
            botonEliminar.removeEventListener("click", manejarEliminar);
        }, { once: true });
    }
}


function crearJSONHuespedBorrar() {
    const datosFormulario = {
        apellido: document.getElementById('apellido').value.trim(),
        nombres: document.getElementById('nombres').value.trim(),
        tipoDocumento: document.getElementById('tipoDocumento').value.trim(),
        numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
        cuit: document.getElementById('cuit').value.trim() || '',
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        caracteristica: document.getElementById('caracteristica').value.trim(),
        telefonoNumero: document.getElementById('celular')?.value.trim() || '',
        email: document.getElementById('email').value.trim() || '',
        ocupacion: document.getElementById('ocupacion').value.trim(),
        nacionalidad: document.getElementById('nacionalidad').value.trim(),
        calle: document.getElementById('calle').value.trim(),
        numeroCalle: document.getElementById('numero').value.trim(),
        departamento: document.getElementById('departamento').value.trim() || '',
        piso: document.getElementById('piso').value.trim() || '',
        codigoPostal: document.getElementById('codigoPostal').value.trim(),
        localidad: document.getElementById('localidad').value.trim(),
        provincia: document.getElementById('provincia').value.trim(),
        pais: document.getElementById('pais').value.trim()
    };
    
    return datosFormulario;
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

