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