/* Funciones de utilidad para desarrollo y pruebas */

/**
 * Completa automáticamente todos los campos del formulario con datos de prueba
 * Útil para desarrollo y testing
 */
function completarFormulario() {
    document.getElementById("apellido").value = "González";
    document.getElementById("nombres").value = "María Fernanda";
    document.getElementById("tipoDocumento").value = "DNI";
    document.getElementById("numeroDocumento").value = "12345678";
    document.getElementById("cuit").value = "20-98765432-1";
    document.getElementById("fechaNacimiento").value = "1990-05-15";
    document.getElementById("caracteristica").value = "11";
    document.getElementById("telefonoNumero").value = "5551234";
    document.getElementById("email").value = "maria.gonzalez@example.com";
    document.getElementById("ocupacion").value = "Abogada";
    document.getElementById("nacionalidad").value = "Argentina";
    document.getElementById("calle").value = "Av. Siempre Viva";
    document.getElementById("numeroCalle").value = "742";
    document.getElementById("departamento").value = "A";
    document.getElementById("piso").value = "3";
    document.getElementById("codigoPostal").value = "1001";
    document.getElementById("localidad").value = "Buenos Aires";
    document.getElementById("provincia").value = "Buenos Aires";
    document.getElementById("pais").value = "Argentina";
}

