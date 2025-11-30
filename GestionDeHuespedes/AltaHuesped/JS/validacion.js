// JS/validacion.js
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("altaHuesped");
    if (!form) return;

    form.addEventListener("input", () => {
        // NO validamos nada acá
        // El verdadero validador es el GestorHuesped según el diagrama
        // Esto solo podría agregar clases CSS visuales si querés
    });
});
