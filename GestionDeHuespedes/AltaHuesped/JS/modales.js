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

function pregunta(mensaje, textoSi, textoNo, onSi, onNo) {
    const modal = document.getElementById("modalPregunta");
    const mensajeEl = document.getElementById("mensaje-pregunta");
    const btn1 = document.getElementById("boton-pregunta-1");
    const btn2 = document.getElementById("boton-pregunta-2");

    mensajeEl.textContent = mensaje;

    btn1.textContent = textoSi;
    btn2.textContent = textoNo;

    btn1.onclick = () => {
        modal.style.display = "none";
        onSi && onSi();
    };

    btn2.onclick = () => {
        modal.style.display = "none";
        onNo && onNo();
    };

    modal.style.display = "flex";
}

function mensajeCorrecto(mensaje) {
    const modal = document.getElementById("modalCorrecto");
    const mensajeEl = document.getElementById("mensaje-correcto");

    mensajeEl.textContent = mensaje;
    modal.style.display = "flex";

    setTimeout(() => modal.style.display = "none", 2000);
}

function hayModalAbierto() {
    const modales = document.querySelectorAll(".modal");

    for (const modal of modales) {
        const estilo = getComputedStyle(modal);

        // Si el modal está visible (flex o block)
        if (estilo.display !== "none") {
            return true;
        }
    }

    return false;
}

window.hayModalAbierto = hayModalAbierto;
window.advertencia = advertencia;
window.pregunta = pregunta;
window.mensajeCorrecto = mensajeCorrecto;
