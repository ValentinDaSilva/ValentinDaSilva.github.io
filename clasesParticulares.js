function abrirWhatsApp() {
    window.open("https://api.whatsapp.com/send?phone=3425986867", "_blank");
}

function abrirMateria(seccion){
    window.location.href = `materias.html#${seccion}`;
}

const $clases1 = document.querySelector("#seccion1");
const $hijosClases1 = $clases1.querySelectorAll("div");
const $clases2 = document.querySelector("#seccion2");
const $hijosClases2 = $clases2.querySelectorAll("div");

function verificarVisibilidad(entrada){
    let entry1 = entrada[0];
       
}

const observer = new IntersectionObserver(verificarVisibilidad,{});
observer.observe($clases1);
observer.observe($clases2);
