


function mensajeCorrecto(mensaje, accionBoton) {
    if (mensaje == undefined) mensaje = "Acción ejecutada con éxito";
    
    const modal = document.getElementById('modalCorrecto');
    const mensajeExito = document.getElementById('mensaje-correcto');
    
    if (!modal || !mensajeExito) return;
    
    mensajeExito.innerHTML = mensaje;
    
    modal.style.display = "flex";
    
       
    document.addEventListener("keydown", (e) => {
        e.preventDefault();
        if(modal.style.display === "flex"){
            console.log("Tecla presionada en modal correcto:", e.key);
            modal.style.display = "none";
            accionBoton();
        }
    });
}

function mensajeError(mensaje, accionBoton) {
    console.log("Mostrando mensaje de error:", mensaje);
    const modal = document.getElementById('modalError');
    const mensajeErrorElement = document.getElementById('mensaje-error');
    const botonOk = document.getElementById("boton-error-ok");

    if (!modal || !mensajeErrorElement || !botonOk) return;

    mensajeErrorElement.textContent = mensaje;
    modal.style.display = "flex";

    botonOk.onclick = (e) => {
        e.stopPropagation();  
        if (typeof accionBoton === "function") {
            accionBoton();
        }

        modal.style.display = "none";
    };
}

function advertencia(mensaje, boton1, boton2) {
    if(mensaje == undefined) mensaje = "Mensaje de Advertencia";
    if(boton1 == undefined) boton1 = "ACEPTAR";
    if(boton2 == undefined) boton2 = "CANCELAR";
    
    const modal = document.getElementById('modalAdvertencia');
    const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
    
    if (!modal || !mensajeAdvertencia) return;
    
    mensajeAdvertencia.innerHTML = mensaje;
    const botonAceptar = document.getElementById("boton-advertencia-aceptar");
    const botonCorregir = document.getElementById("boton-advertencia-corregir");
    
    if (botonAceptar) botonAceptar.textContent = boton1;
    if (botonCorregir) botonCorregir.textContent = boton2;
    modal.style.display = "flex";
}


function pregunta(mensaje, boton1, boton2, funcionBoton1, funcionBoton2) {
    if (mensaje == undefined) mensaje = "Mensaje de Pregunta";
    if (boton1 == undefined) boton1 = "ACEPTAR";
    if (boton2 == undefined) boton2 = "CANCELAR";
    
    const modal = document.getElementById('modalPregunta');
    const mensajePregunta = document.getElementById('mensaje-pregunta');
    
    if (!modal || !mensajePregunta) return;
    
    mensajePregunta.textContent = mensaje;
    const btn1 = document.getElementById("boton-pregunta-1");
    const btn2 = document.getElementById("boton-pregunta-2");
    
    if (btn1) btn1.textContent = boton1;
    if (btn2) btn2.textContent = boton2;
    modal.style.display = "flex";

    if (typeof funcionBoton1 === "function" && btn1) {
        btn1.addEventListener("click", () => {
            funcionBoton1();
        }, { once: true });
    }

    if (typeof funcionBoton2 === "function" && btn2) {
        btn2.addEventListener("click", () => {
            funcionBoton2();
        }, { once: true });
    }
}


function inicializarBotonesModal() {
    let botones = document.querySelectorAll(".boton-general");
    botones.forEach(boton => {
        boton.addEventListener("click", function() {
            document.querySelectorAll(".modal").forEach(modal => {
                modal.style.display = "none";
            });
        });
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBotonesModal);
} else {
    inicializarBotonesModal();
}

