


function verificarCUIT(listaCUITS) {
    if(listaCUITS == undefined) listaCUITS = ["20-12345678-9", "20-34567890-1", "20-98765432-1"];
    const input = document.getElementById("cuit").value.trim();
    if (input !== "") {
        if(listaCUITS.includes(input)) {
            advertencia(
                "¡CUIDADO! El tipo y número de documento ya existen en el sistema",
                "ACEPTAR ✅",
                "CORREGIR ✏️",
                async function() {
                    
                    const procesadoExitoso = await gestorAltaHuesped.procesarAltaHuesped();
                    
                    if (procesadoExitoso) {
                        
                        const nombre = document.getElementById("nombre").value.trim();
                        const apellido = document.getElementById("apellido").value.trim();
                        pregunta(
                            `El huésped\n${nombre} ${apellido} ha sido\nsatisfactoriamente cargado al\nsistema. ¿Desea cargar otro?\n`,
                            "SI ✅",
                            "NO ❌",
                            function() { 
                                
                                const modalPregunta = document.getElementById('modalPregunta');
                                if (modalPregunta) {
                                    modalPregunta.style.display = 'none';
                                }
                                
                                
                                reiniciarFormulario();
                                
                                
                                mensajeCorrecto("Huésped cargado correctamente. El formulario ha sido reiniciado.");
                            },
                            function() {
                                
                                const modalPregunta = document.getElementById('modalPregunta');
                                if (modalPregunta) {
                                    modalPregunta.style.display = 'none';
                                }
                                
                                
                                window.location.href = '../index.html';
                            }
                        );
                    }
                },
                function() {
                    
                    const campoCuit = document.getElementById("cuit");
                    if (campoCuit) {
                        campoCuit.focus();
                        campoCuit.select();
                    }
                }
            );
            return true;
        }
    }
    return false;
}


function reiniciarFormulario() {
    const formulario = document.getElementById("altaHuesped");
    if (formulario) {
        
        formulario.reset();
        
        
        const mensajesError = document.querySelectorAll('.mensaje-error');
        mensajesError.forEach(mensaje => {
            mensaje.classList.remove('mostrar');
            mensaje.textContent = '';
        });
        
        
        const campos = formulario.querySelectorAll('input, select, textarea');
        campos.forEach(campo => {
            campo.classList.remove('campo-invalido');
            campo.classList.remove('campo-valido');
        });
        
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        
        const primerCampo = formulario.querySelector('input, select');
        if (primerCampo) {
            primerCampo.focus();
        }
    }
}


async function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    
    if (hayModalAbierto()) {
        return;
    }
    
    GestorHuesped.darAltaHuesped();
    
    
    
    // let procesadoExitoso = false;
    // if (window.gestorHuesped) {
    //     procesadoExitoso = await window.gestorHuesped.darAltaHuesped();
    // } else if (window.gestorAltaHuesped) {
    //     procesadoExitoso = await window.gestorAltaHuesped.procesarAltaHuesped();
    // }
    
    // if (procesadoExitoso) {
        
    //     const nombre = document.getElementById("nombre").value.trim();
    //     const apellido = document.getElementById("apellido").value.trim();
    //     pregunta(
    //         `El huésped\n${nombre} ${apellido} ha sido\nsatisfactoriamente cargado al\nsistema. ¿Desea cargar otro?\n`,
    //         "SI ✅",
    //         "NO ❌",
    //         function() { 
                
    //             const modalPregunta = document.getElementById('modalPregunta');
    //             if (modalPregunta) {
    //                 modalPregunta.style.display = 'none';
    //             }
                
                
    //             reiniciarFormulario();
                
                
    //             mensajeCorrecto("Huésped cargado correctamente. El formulario ha sido reiniciado.");
    //         },
    //         function() {
                
    //             const modalPregunta = document.getElementById('modalPregunta');
    //             if (modalPregunta) {
    //                 modalPregunta.style.display = 'none';
    //             }
                
                
    //             window.location.href = '../index.html';
    //         }
    //     );
    // }
}


function prevenirEnterEnFormularioConModal() {
    const formulario = document.getElementById("altaHuesped");
    if (!formulario) return;
    
    
    const campos = formulario.querySelectorAll('input, select, textarea');
    campos.forEach(campo => {
        campo.addEventListener('keydown', function(event) {
            
            if (event.key === 'Enter' && hayModalAbierto()) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });
    });
}


function inicializarValidacionFormulario() {
    const formulario = document.getElementById("altaHuesped");
    if (formulario) {
        formulario.addEventListener("submit", manejarEnvioFormulario);
        
        prevenirEnterEnFormularioConModal();
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionFormulario);
} else {
    inicializarValidacionFormulario();
}

