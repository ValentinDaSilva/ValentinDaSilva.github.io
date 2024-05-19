var url = "https://script.google.com/macros/s/AKfycbxcWoNo01tZYHKx-VhR0JNQDuLmJ6OlUj_HxAPiQIKqS55hqkif6AlbjLR7_ZnYMw/exec"; 
var urlR = "https://script.google.com/macros/s/AKfycbxZUbx1km6Sd1ZijwSD91xPNuj6gSMl3CAJRkTm3IBElrEu5q-5P19Xu5PFOX5kkbw/exec";
let $siguiente = document.querySelector(".siguiente");
let $botones = document.querySelectorAll(".caja");
let numeroDeHoja = 0;
var SemanaUno,DiasSemanaUno;

class Persona {
  constructor(nombre, contrasenia, correo) {
    this.nombre = nombre;
    this.contrasenia = contrasenia;
    this.correo = correo;
  }

  obtenerNombre() {
    return this.nombre;
  }

  obtenerContrasenia() {
    return this.contrasenia;
  }

  obtenerCorreo() {
    return this.correo;
  }

  establecerHorarios(horarios){
    this.horarios = horarios;
  }
}


async function ponerDias(arg2){
  let arg1 = "obtenerDias",
      urlInterno = url + "?arg1=" + arg1 + "&arg2=" + arg2;
  let $tabla = document.getElementById('tablaHorarios');
    const $filas = $tabla.rows;
    const $tituloTabla = document.querySelector("th");
  try {
    const response = await fetch(urlInterno);
    if (!response.ok) {
      throw new Error('La solicitud fall�.');
    }
    const data = await response.json();
    if(arg2 == 0) DiasSemanaUno = data;
    let $celda;
    for (let i = 0; i < 6; i++) {
      if(i == 0) $tituloTabla.innerHTML = "Horarios " + data[0] + "<br>(Puedes hacer click para seleccionar o deseleccionar un horario)";
      $celda = $filas[1].cells[i+1];
      $celda.innerHTML = data[i+1];
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function modificarCelda(fila,columna){
    let $tabla = document.getElementById('tablaHorarios');
    const $filas = $tabla.rows;
    
    const $celda = $filas[fila].cells[columna];
    $celda.style.backgroundColor = 'inherit';
}

function cambiarColorMatriz() {
  // Obtener todas las celdas de la matriz
  var celdas = document.querySelectorAll("table tr td");
  
  // Iterar sobre todas las celdas
  celdas.forEach(function(celda) {
    // Obtener el �ndice de fila y columna de la celda actual
    var fila = celda.parentNode.rowIndex;
    var columna = celda.cellIndex;

    // Verificar si la celda est� dentro del rango [2,1] y [31,6]
    if ((fila >= 2 && fila <= 31) && (columna >= 1 && columna <= 6) && !celda.classList.contains('inmovible')) {
      // Cambiar el color de fondo de la celda
      celda.style.backgroundColor = "white"; // Cambia el color como desees
    }
  });

}

(async function () {
  let arg1 = 0,
      urlInterno = url + "?arg1=" + arg1;
    try {
      const response = await fetch(urlInterno);
      if (!response.ok) {
        throw new Error('La solicitud fallida.');
      }
      const data = await response.json();
      SemanaUno = data;
      data.forEach(objeto => {
        modificarCelda(objeto.fila, objeto.columna);
      });
      await ponerDias(0);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      document.querySelector("table").style.display = "table";
      document.getElementById("loader").style.display = "none";
      $siguiente.style.display = "flex";
      $botones.forEach(elem=>elem.style.display = "flex")
    }
})()

async function siguiente () {
      let arg1 = 1,
        urlInterno = url + "?arg1=" + arg1;
    numeroDeHoja++;
    document.querySelector("table").style.display = "none";
    cambiarColorMatriz();
    let $tituloTable = document.querySelector("th");
    $tituloTable.innerHTML =  'Horarios Mayo Semana ' + (arg1+1) + '<br>(Los que estan en celeste son disponibles)';
    document.getElementById("loader").style.display = "block";
    $siguiente.style.display = "none";
    $botones.forEach(elem=>elem.style.display = "none")
      try {
        const response = await fetch(urlInterno);
        if (!response.ok) {
          throw new Error('La solicitud fall�.');
        }
        const data = await response.json();
        data.forEach(objeto => {
          modificarCelda(objeto.fila, objeto.columna);
        });
        await ponerDias(1); // Espera a que ponerDias(1) termine antes de continuar
      } catch (error) {
        console.error("Error:", error);
      } finally {
        // Ocultar loader cuando la solicitud Fetch se complete (ya sea exitosa o con error)
        document.querySelector("table").style.display = "table";
        document.getElementById("loader").style.display = "none";
        $siguiente.id = "anterior";
        document.querySelector(".siguiente p").style.order = "2";
        document.querySelector(".siguiente svg").style.order = "1";
        document.querySelector(".siguiente svg image").setAttribute("href", "assets/fotos/FlechaHaciaIzquierda.svg");
        document.querySelector(".siguiente svg").style.marginLeft = "0";
        document.querySelector(".siguiente svg").style.marginRight = "1vw";
        document.querySelector(".siguiente p").innerHTML = "Volver atras"
        $siguiente.style.display = "flex";
        $botones.forEach(elem=>elem.style.display = "flex")
      }
    }

function anterior () {
  numeroDeHoja--;
  let $tabla = document.querySelector("table");
  $tabla.style.display = "none";
  $siguiente.style.display = "none";
  $botones.forEach(elem=>elem.style.display = "none");
  cambiarColorMatriz();
    SemanaUno.forEach(objeto => {
      modificarCelda(objeto.fila, objeto.columna);
    });
    //poner bien los dias
    const $filas = $tabla.rows;
    let $celda;
    const $tituloTabla = document.querySelector("th");
    for (let i = 0; i < 6; i++) {
      if(i == 0) $tituloTabla.innerHTML = "Horarios " + DiasSemanaUno[0] + "<br>(Puedes hacer click para seleccionar o deseleccionar un horario)";
      $celda = $filas[1].cells[i+1];
      $celda.innerHTML = DiasSemanaUno[i+1];
    }
    document.getElementById("loader").style.display = "none";
    $siguiente.id = "siguiente";
    document.querySelector(".siguiente p").style.order = "1";
    document.querySelector(".siguiente svg").style.order = "2";
    document.querySelector(".siguiente svg image").setAttribute("href", "assets/fotos/FlechaHaciaDerecha.svg");
    document.querySelector(".siguiente svg").style.marginLeft = "1vw";
    document.querySelector(".siguiente svg").style.marginRight = "0";
    document.querySelector(".siguiente p").innerHTML = "Semana siguiente";
    $tabla.style.display = "table";
    $siguiente.style.display = "flex";
    $botones.forEach(elem=>elem.style.display = "flex")
}

$siguiente.addEventListener("click", ()=> {
  if($siguiente.id == "siguiente") siguiente();
  else anterior();
})
var Alumno;
document.addEventListener("DOMContentLoaded",()=>{
  if(sessionStorage.getItem('persona') !== null){
    let Aux = JSON.parse(sessionStorage.getItem('persona'));
    Alumno = new Persona(Aux.nombre,Aux.contrasenia,Aux.correo);
    document.getElementById("IniciarSesion").innerHTML = `Hola, ${Alumno.obtenerNombre()}`; 
 }
 seleccionarHorarios();
})

function eliminarEspaciosAdelante(cadena) {
  return cadena.replace(/^\s+/, "");
}

let $BotonInisioSesion = document.getElementById("IniciarSesion");
$BotonInisioSesion.addEventListener("click",()=>{
  console.log(eliminarEspaciosAdelante($BotonInisioSesion.innerHTML));
  if($BotonInisioSesion.innerHTML.includes("Iniciar")){
    Swal.fire({
      title: "Que desea hacer?",
      showClass: {
        popup: `
          animate__animated
          animate__fadeInUp
          animate__faster
        `
      },
      hideClass: {
        popup: `
          animate__animated
          animate__fadeOutDown
          animate__faster
        `
      },
      showDenyButton: true,
        confirmButtonText: "Iniciar Sesion",
        denyButtonText: `Registrarme`
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "./IniciarSesion/IniciarSesion.html"
      } else if (result.isDenied) {
        window.location.href = "./Registro/Registro.html"
      }
    });
  }

})

function incrementarCelda(nombreCelda) {
  // Extraer la parte de la letra y el número del nombre de la celda
  const letra = nombreCelda.match(/[A-Za-z]+/)[0];
  const numero = parseInt(nombreCelda.match(/\d+/)[0]);

  // Incrementar el número en uno
  const nuevoNumero = numero + 1;

  // Construir el nuevo nombre de la celda
  const nuevoNombreCelda = letra + nuevoNumero;

  return nuevoNombreCelda;
}

function eliminarElemento(array, elemento) {
  const indice = array.indexOf(elemento);
  
  if (indice !== -1) {
    array.splice(indice, 1);
  }
}

var horariosSeleccionados = [];
function seleccionarHorarios(){
  let $celdas = document.querySelectorAll("table td");
  $celdas.forEach(celda => {
    celda.addEventListener("click",()=>{
      const colorDeFondo = window.getComputedStyle(celda).getPropertyValue('background-color');
      let posicion = celda.getAttribute('data-columna') + celda.getAttribute('data-fila'); 
      if(colorDeFondo == "rgb(255, 255, 255)" && celda.innerHTML == ""){
         celda.style.backgroundColor = "red";
         horariosSeleccionados.push(posicion);
         horariosSeleccionados.push(incrementarCelda(posicion));
      }
      else if(colorDeFondo == "rgb(255, 0, 0)" && celda.innerHTML == ""){
        celda.style.backgroundColor = "white";
        eliminarElemento(horariosSeleccionados,posicion);
        eliminarElemento(horariosSeleccionados,incrementarCelda(posicion));
     }
     else if(colorDeFondo == "rgb(255, 255, 255)"){
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Esto no es un horario",
        });
      }
      else{
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Este horario ya esta ocupado",
        });
      }
    })  
  })
}

let $BotonReservar = document.getElementById("ReservarTurnos");
$BotonReservar.addEventListener("click",()=>{
  if (Alumno instanceof Persona){
    if(horariosSeleccionados.length === 0) {
      Swal.fire({
        title: "Accion Erronea",
        icon: "info",
        html: `Debes clickear las celdas que quieres reservar`,
        showConfirmButton: true
      });
    }else{
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: true,
        confirmButtonColor: "green",
        cancelButtonColor: "#d33",
      });
      swalWithBootstrapButtons.fire({
        title: "Estas por reservar un horario!!",
        text: "Seguro que quieres hacer esto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Si, reservar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          if(validarSoloUnDia(horariosSeleccionados)){
            enviar();
            const Toast = Swal.mixin({
              toast: true,
              position: "top-end",
              showConfirmButton: false,
              timer: 10000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            Toast.fire({
              icon: "success",
              title: "Listo, aguarda un instante mientras termina de reservarse"
            });
          }else{
            Swal.fire({
              icon: "error",
              title: "No debes seleccionar varios dias",
              text: `Si quieres varios turnos, tienes que registrarlos por separado.`,
            });
          }
        }
        else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelado!",
            text: "Tu reserva no fue realizada, puedes estar tranquilo",
            icon: "error"
          });
        }
      });
    }
  }else{
    Swal.fire({
      title: "Accion Erronea",
      icon: "info",
      html: `Debes iniciar sesion para reservar un horario`,
      showConfirmButton: true
    });
  }
})

function validarSoloUnDia(celdas){
  let letra = celdas[0][0];
  let resultado = true;
  celdas.forEach(celda =>{
    if(celda[0] != letra) resultado = false;
  })
  return resultado;
}

async function enviar(){
  let datos = {
    celdas: horariosSeleccionados,
    numeroHoja: numeroDeHoja,
    correo: Alumno.obtenerCorreo(),
    contrasenia: Alumno.obtenerContrasenia()
  }
  console.log(datos);
  fetch(url, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(datos)
      }).then(()=>enviarARegistros())
      .catch(function(error) {
          console.error('Error al enviar datos:', error);
      });
    console.log("datos enviados");
}

function enviarARegistros(){
  let datos = {
    celdas: horariosSeleccionados,
    numHoja: numeroDeHoja,
    correo: Alumno.obtenerCorreo(),
    contrasenia: Alumno.obtenerContrasenia()
  }
  console.log(datos);
  fetch(urlR, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({funcion:"asignarHorario",datos: datos})
      }).then(()=>{
        window.location.href = "index.html"}
      )
      .catch(function(error) {
          console.error('Error al enviar datos:', error);
      });
}

function ponerInmovibles(){
  let tabla = document.getElementById('tablaHorarios');
        // Recorre todas las filas de la tabla
        for (let i = 0; i < tabla.rows.length; i++) {
          const fila = tabla.rows[i];

          // Recorre todas las celdas de la fila
          for (let j = 0; j < fila.cells.length; j++) {
              const celda = fila.cells[j];

              // Verifica si la celda tiene la clase "inmovible"
              if (celda.classList.contains('inmovible')) {
                  // Establece el background-color a "inherit"
                  celda.style.backgroundColor = 'inherit';
              }
          }
      }
}