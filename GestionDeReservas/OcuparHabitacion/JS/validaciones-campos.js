// validaciones-campos.js

function inicializarValidacionesCampos() {
  const checkinInput = document.getElementById('fecha-desde');
  const checkoutInput = document.getElementById('fecha-hasta');

  // Si no existen, NO HACER NADA (evita error en buscarHuesped.html)
  if (!checkinInput || !checkoutInput) return;

  [checkinInput, checkoutInput].forEach(input => {
    input.addEventListener('blur', function(event) {
      if (!event.target.value) {
        const fieldName = event.target.id === 'fecha-desde' ? 'Desde fecha' : 'Hasta fecha';
        mensajeError(`Por favor, ingrese una fecha válida en "${fieldName}".`);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', inicializarValidacionesCampos);
