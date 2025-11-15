/* Funciones de utilidad para desarrollo y pruebas */

/**
 * Completa automáticamente todos los campos del formulario con datos de prueba
 * Útil para desarrollo y testing
 * Todos los datos de texto se escriben en mayúsculas
 */
function completarFormulario() {
    document.getElementById("apellido").value = "GONZÁLEZ";
    document.getElementById("nombres").value = "MARÍA FERNANDA";
    document.getElementById("tipoDocumento").value = "DNI";
    document.getElementById("numeroDocumento").value = "12345678";
    document.getElementById("cuit").value = "20-98765432-1";
    document.getElementById("fechaNacimiento").value = "1990-05-15";
    document.getElementById("caracteristica").value = "11";
    const campoCelular = document.getElementById("celular") || document.getElementById("telefonoNumero");
    if (campoCelular) campoCelular.value = "5551234";
    document.getElementById("email").value = "MARIA.GONZALEZ@EXAMPLE.COM";
    document.getElementById("ocupacion").value = "ABOGADA";
    document.getElementById("nacionalidad").value = "Argentina";
    document.getElementById("calle").value = "AV. SIEMPRE VIVA";
    document.getElementById("numero").value = "742";
    document.getElementById("departamento").value = "A";
    document.getElementById("piso").value = "3";
    document.getElementById("codigoPostal").value = "1001";
    document.getElementById("localidad").value = "BUENOS AIRES";
    document.getElementById("provincia").value = "BUENOS AIRES";
    document.getElementById("pais").value = "Argentina";
}

/**
 * Inicializa el atajo de teclado Ctrl+Alt+P para ejecutar completarFormulario()
 */
function inicializarAtajoCompletarFormulario() {
    document.addEventListener('keydown', function(event) {
        // Verificar si se presionó Ctrl+Alt+P
        if (event.altKey && event.key === 'p') {
            event.preventDefault();
            completarFormulario();
        }
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAtajoCompletarFormulario);
} else {
    inicializarAtajoCompletarFormulario();
}



