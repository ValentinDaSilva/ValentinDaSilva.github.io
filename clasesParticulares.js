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

$hijosClases1.forEach((elem) => {
    elem.style.opacity = "0"
})

$hijosClases2.forEach((elem) => {
    elem.style.opacity = "0"
})

const verificarVisibilidad = (entradas) => {
    entradas.forEach(entrada => {
      // Verificar si el elemento 1 es intersectado
      if (entrada.isIntersecting && entrada.target.id === "seccion1") {
        $hijosClases1.forEach((elem) => {
            elem.classList.add("animate__animated");
            elem.classList.add("animate__fadeIn");
        })
        }
      // Verificar si el elemento 2 es intersectado
      if (entrada.isIntersecting && entrada.target.id === "seccion2") {
        $hijosClases2.forEach((elem) => {
            elem.classList.add("animate__animated");
            elem.classList.add("animate__fadeIn");
        })
      }
    });
    entradas.forEach(entrada => {
      // Verificar si el elemento 1 es intersectado
      if (!entrada.isIntersecting && entrada.target.id === "seccion1") {
        $hijosClases1.forEach((elem) => {
            elem.classList.remove("animate__animated");
            elem.classList.remove("animate__fadeIn");
        })
        }
      // Verificar si el elemento 2 es intersectado
      if (!entrada.isIntersecting && entrada.target.id === "seccion2") {
        $hijosClases2.forEach((elem) => {
            elem.classList.remove("animate__animated");
            elem.classList.remove("animate__fadeIn");
        })
      }
    });
  };

const observer = new IntersectionObserver(verificarVisibilidad,{threshold: 0.5});
observer.observe($clases1);
observer.observe($clases2);

let $opcion1 = document.getElementById("opcion1");
let $opcion2 = document.getElementById("opcion2");
let $imagen1 = document.getElementById("imagen1");
let $imagen2 = document.getElementById("imagen2");

$opciones.forEach((elem)=>{
  elem.addEventListener("click",()=>{
    if(elem.id == "opcion1"){
      $imagen1.style.display = "block";
      $imagen2.style.display = "none";
    }
    else if(elem.id == "opcion2"){
      $imagen2.style.display = "block";
      $imagen1.style.display = "none";
    }
  })
})