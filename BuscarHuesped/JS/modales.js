// JS/modales.js

function advertencia(mensaje, textoAceptar, textoCancelar, onAceptar, onCancelar) {
    const modal = document.getElementById("modalAdvertencia");
    const mensajeEl = document.getElementById("mensaje-advertencia");
    const btnAceptar = document.getElementById("boton-advertencia-aceptar");
    const btnCancelar = document.getElementById("boton-advertencia-corregir");

    mensajeEl.textContent = mensaje;
    btnAceptar.textContent = textoAceptar;
    btnCancelar.textContent = textoCancelar;

    btnAceptar.onclick = () => {
        modal.style.display = "none";
        onAceptar && onAceptar();
    };

    btnCancelar.onclick = () => {
        modal.style.display = "none";
        onCancelar && onCancelar();
    };

    modal.style.display = "flex";
}

// ⭐ NUEVO – Reemplaza confirm()
function pregunta(mensaje, texto1, texto2, on1, on2) {
    const modal = document.getElementById("modalPregunta");
    const mensajeEl = document.getElementById("mensaje-pregunta");
    const btn1 = document.getElementById("boton-pregunta-1");
    const btn2 = document.getElementById("boton-pregunta-2");

    mensajeEl.textContent = mensaje;
    btn1.textContent = texto1;
    btn2.textContent = texto2;

    btn1.onclick = () => {
        modal.style.display = "none";
        on1 && on1();
    };

    btn2.onclick = () => {
        modal.style.display = "none";
        on2 && on2();
    };

    modal.style.display = "flex";
}

// Mensajes rápidos tipo “EXITO”
function mensajeCorrecto(mensaje) {
    const modal = document.getElementById("modalCorrecto");
    const mensajeEl = document.getElementById("mensaje-correcto");

    mensajeEl.textContent = mensaje;
    modal.style.display = "flex";

    setTimeout(() => modal.style.display = "none", 2000);
}

window.advertencia = advertencia;
window.pregunta = pregunta;
window.mensajeCorrecto = mensajeCorrecto;
