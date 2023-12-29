import hamburguerMenu from "./JS/menuHamburguesa.js";
import { digitalClock , alarma } from "./JS/reloj.js";
import { moveBall } from "./JS/teclado.js";
import { imprimirFecha, guardarFecha } from "./JS/cuentaRegresiva.js";
import scrollTopButton from "./JS/botonTop.js";
import darkModeFuncion, { eventoDarkMode } from "./JS/darkMode.js";
import offline, { online } from "./JS/conexion.js";
import search from "./JS/search.js";
import smartView from "./JS/video_ingeligente.js";

const d = document;

d.addEventListener("DOMContentLoaded",e => {
    hamburguerMenu(".panel-btn",".panel");
    digitalClock("#reloj", "#activar-reloj", "#desactivar-reloj");
    alarma("#reloj","#activar-alarma","#desactivar-alarma");
    scrollTopButton(".scroll-top-btn");
    darkModeFuncion($btnDarkMode);
    smartView();
})

let stageBox = document.querySelector('.stage');
stageBox.addEventListener('keydown', function(e) {
        moveBall(e,".ball",".stage");
});
//las siguientes dos funciones son para cuando use el jueguito no se me vaya la pagina paara abajo cuando uso la flech para abajo (o para arriba)
stageBox.addEventListener('focus', function() {
    // Acción a realizar cuando el input recibe el foco
    document.body.style.overflow = 'hidden';
    console.log("Tengo el foco");
});

stageBox.addEventListener('blur', function() {
    // Acción a realizar cuando el input recibe el foco
    document.body.style.overflow = 'auto';
    console.log("No tengo el foco");
});

let $botonFecha = d.querySelector("button[id=\"crearFecha\"]");
$botonFecha.addEventListener("click", (e) => {
    imprimirFecha();
    e.preventDefault();
});

let $btnDarkMode = d.querySelector(".button-dark-mode");
$btnDarkMode.addEventListener("click", ()=>{
    eventoDarkMode($btnDarkMode);
})

window.addEventListener("offline", ()=> offline());
window.addEventListener("online", ()=> online());

let $buscador = d.querySelector("input[name=\"buscador\"]");
let $copiaCards = d.querySelectorAll(".card");//copia de los nodos de tarjetas
$buscador.addEventListener("keyup", (e)=>{
    console.log("entre");
    search($buscador,$copiaCards);
})


let listaElementos = [];
let $inputSorteo = d.getElementById("inputSorteo");
let $agregarSorteo = d.getElementById("agregarSorteo");
let $finalizarSorteo = d.getElementById("finalizarSorteo");

$inputSorteo.addEventListener("keyup", (e) => {
    if(e.key == "Enter"){
        listaElementos.push($inputSorteo.value);
        console.log(listaElementos);
        $inputSorteo.value = '';
    }
})

$agregarSorteo.addEventListener("click", () => {
    listaElementos.push($inputSorteo.value);
    console.log(listaElementos);
    $inputSorteo.value = '';
})

$finalizarSorteo.addEventListener("click", () => {
    let longitd = listaElementos.length - 1,
        random = Math.floor(Math.random()*longitd),
        ganador = listaElementos[random];
    //creacion de elementos
    let $parrafo = d.getElementById("parrafo");
    $parrafo.style.fontSize = '30px';
    $parrafo.style.fontFamily = '\'DM Serif Display\', serif';
    $parrafo.innerHTML = `El ganador fue: ${ganador}`;
})

let $flechaIzquierda = d.getElementById("flechaIzq"),
$flechaDerecha = d.getElementById("flechaDer"),
$foto = d.querySelector(".responsive-slider img");

let posicion = 0;
let vectorFotos = [
    "https://source.unsplash.com/200x300/?cats",
    "https://source.unsplash.com/200x300/?dogs",
    "https://source.unsplash.com/200x300/?elephants",
    "https://source.unsplash.com/200x300/?rabbits",
    "https://source.unsplash.com/200x300/?monkeys" 
];

$flechaDerecha.addEventListener("click", ()=>{
    posicion++;
    if(posicion > vectorFotos.length - 1) posicion = 0;
    console.log($foto);
    $foto.src = vectorFotos[posicion];
})

$flechaIzquierda.addEventListener("click", ()=>{
    posicion--;
    if(posicion < 0) posicion = vectorFotos.length - 1;
    console.log($foto);
    $foto.src = vectorFotos[posicion];
})