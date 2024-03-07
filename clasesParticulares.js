let $opcion1 = document.getElementById("opcion1");
let $opcion2 = document.getElementById("opcion2");
let $opciones = document.querySelectorAll(".opciones input");
let $imagen1 = document.getElementById("imagen1");
let $imagen2 = document.getElementById("imagen2");
let $oficinasTitulo = document.querySelector(".oficinas .encabezado");
let $oficinasGaleriaTexto = document.querySelector(".oficinas .GaleriaTexto");
$oficinasTitulo.style.opacity = "0";
$oficinasGaleriaTexto.style.opacity = "0";

document.addEventListener("DOMContentLoaded", function() {
  // Aquí puedes escribir el código que deseas ejecutar cuando el DOM haya sido completamente cargado
  let $mensajeInicio = document.querySelector(".mensajeInicio h2");
  $mensajeInicio.style.display = "block";
});

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
      else if (entrada.isIntersecting && entrada.target.id === "seccion2") {
        $hijosClases2.forEach((elem) => {
            elem.classList.add("animate__animated");
            elem.classList.add("animate__fadeIn");
        })
      }
      // Verificar si el elemento 1 es intersectado
      else if (!entrada.isIntersecting && entrada.target.id === "seccion1") {
        $hijosClases1.forEach((elem) => {
            elem.classList.remove("animate__animated");
            elem.classList.remove("animate__fadeIn");
        })
        }
      // Verificar si el elemento 2 es intersectado
      else if (!entrada.isIntersecting && entrada.target.id === "seccion2") {
        $hijosClases2.forEach((elem) => {
            elem.classList.remove("animate__animated");
            elem.classList.remove("animate__fadeIn");
        })
      }
      else if (entrada.isIntersecting && entrada.target.classList.contains("encabezado")) {
        entrada.target.classList.add("animate__animated");
        entrada.target.classList.add("animate__fadeIn");
      }
      // Verificar si el elemento 2 es intersectado
      else if (!entrada.isIntersecting && entrada.target.classList.contains("encabezado")) {
            entrada.target.classList.remove("animate__animated");
            entrada.target.classList.remove("animate__fadeIn");
      }
      else if (entrada.isIntersecting && entrada.target.classList.contains("GaleriaTexto")) {
        entrada.target.classList.add("animate__animated");
        entrada.target.classList.add("animate__fadeIn");
      }
      // Verificar si el elemento 2 es intersectado
      else if (!entrada.isIntersecting && entrada.target.classList.contains("GaleriaTexto")) {
            entrada.target.classList.remove("animate__animated");
            entrada.target.classList.remove("animate__fadeIn");
      }
      

    });
  };

const observer = new IntersectionObserver(verificarVisibilidad,{threshold: 0.5});
observer.observe($clases1);
observer.observe($clases2);
observer.observe($oficinasTitulo);
observer.observe($oficinasGaleriaTexto);


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