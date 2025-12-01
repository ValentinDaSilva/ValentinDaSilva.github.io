


function inicializarEventos() {
  
  const facturaForm = document.getElementById("facturaForm");
  if (facturaForm) {
    facturaForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const esValido = await validarFormularioFactura();
      if (esValido) {
        cambiarPantalla();
      }
    });
  }

  
  const botonAceptar = document.getElementById("boton-aceptar-responsable");
  if (botonAceptar) {
    botonAceptar.addEventListener("click", async () => {
      const cuit = document.getElementById("cuit").value.trim();
      const selectedRow = obtenerResponsableSeleccionado();

      if (!selectedRow && !cuit) {
        window.location.href = "../darAltaResponsableDePago.html";
      } else if (cuit) {
        
        try {
          const responsable = await buscarResponsableDePagoPorCUIT(cuit);
          if (responsable) {
            pregunta(
              `¿Desea asignar la factura a la razón social ${responsable.razonSocial}?`, 
              "Aceptar ✅",
              "Cancelar ❌",
              () => {
                
              },
              async () => {
                
                await procesarFactura(null, responsable);
              }
            );
          } else {
            mensajeError("No se encontró un responsable de pago con el CUIT ingresado.");
          }
        } catch (error) {
          console.error('Error al buscar responsable de pago:', error);
          mensajeError("Error al buscar el responsable de pago. Por favor, intente nuevamente.");
        }
      } else if (selectedRow) {
        
        await procesarFactura(selectedRow, null);
      }
    });
  }

  
  const cuitInput = document.getElementById("cuit");
  if (cuitInput) {
    cuitInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const botonAceptar = document.getElementById("boton-aceptar-responsable");
        if (botonAceptar) {
          botonAceptar.click();
        }
      }
    });
  }

  
  const botonVolverResponsable = document.getElementById("boton-volver-responsable");
  if (botonVolverResponsable) {
    botonVolverResponsable.addEventListener("click", volverFactura);
  }

  
  const botonVolverFactura = document.getElementById("boton-volver-factura");
  if (botonVolverFactura) {
    botonVolverFactura.addEventListener("click", cambiarPantalla);
  }

  
  const botonVistaPrevia = document.getElementById("boton-vista-previa");
  if (botonVistaPrevia) {
    botonVistaPrevia.addEventListener("click", () => {
      window.open('../assets/image/facturaCortada.jpg', '_blank');
    });
  }

  
  const botonAceptarFactura = document.getElementById("boton-aceptar-factura");
  if (botonAceptarFactura) {
    botonAceptarFactura.addEventListener("click", () => {
      const factura = obtenerFacturaGenerada();
      if (factura) {
        
        mostrarJSONFacturaEnPantalla(factura, () => {
          
          console.log("Factura generada y mostrada");
          
        });
      } else {
        mensajeError("No se pudo generar la factura. Por favor, intente nuevamente.");
      }
    });
  }
  

  
  
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}

