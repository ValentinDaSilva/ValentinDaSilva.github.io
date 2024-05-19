class Persona {
  constructor(nombre, contrasenia, correo) {
    this.nombre = nombre;
    this.contrasenia = contrasenia;
    this.correo = correo;
  }
  obtenerNombre() {
    return this.nombre;
  }
  obtenerApellido() {
    return this.apellido;
  }
  obtenerCorreo() {
    return this.correo;
  }
}
var Alumno;
var url = "https://script.google.com/macros/s/AKfycbzdklIYGsaVytfEq2mOegd4oiLuxe14Xt_6tXRy9kCHn1iPIGLRm2zC3F7TjhhlJY0/exec";


document.getElementById('formularioRegistro').addEventListener('submit', function (event) {
  event.preventDefault();
  let formData = new FormData();
  let datosAEnviar = [];
  formData.forEach((value, key) => {
    datosAEnviar.push(value);
  });
  datosAEnviar[0] = datosAEnviar[0].toLowerCase();
  console.log(datosAEnviar);
  let urlFinal = url + "?correo=" + datosAEnviar[0] + "&contrasenia=" + datosAEnviar[1];
  console.log(urlFinal);
  enviar(urlFinal);
})

function enviar(urlFinal) {
  document.querySelector("body").style.cursor = "wait";
  document.querySelector("#botonEnviar").style.cursor = "wait";
  fetch(urlFinal)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data); // Aquí se imprime el objeto JSON en la consola
      if (data.sesion) {
        Alumno = new Persona(data.Nombre, data.Contrasenia, data.Correo);
        const personaJSON = JSON.stringify(Alumno);
        console.log(personaJSON);
        sessionStorage.setItem('persona', personaJSON);
        window.location.href = "../index.html";
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "El correo o la contraseña son erroneas",
        });
      }
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    }).finally(() => {
      document.querySelector("body").style.cursor = "default";
      document.querySelector("#botonEnviar").style.cursor = "default";
    }
    );
}
