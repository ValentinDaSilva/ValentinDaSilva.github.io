/* Manejo de eventos */

/**
 * Inicializa todos los event listeners
 */
function inicializarEventos() {
  // Event listener del formulario de factura
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

  // Event listener del botón de aceptar en selección de responsable
  const botonAceptar = document.getElementById("boton-aceptar-responsable");
  if (botonAceptar) {
    botonAceptar.addEventListener("click", async () => {
      const cuit = document.getElementById("cuit").value.trim();
      const selectedRow = obtenerResponsableSeleccionado();

      if (!selectedRow && !cuit) {
        window.location.href = "../darAltaResponsableDePago.html";
      } else if (cuit) {
        // Buscar responsable de pago por CUIT
        try {
          const responsable = await buscarResponsableDePagoPorCUIT(cuit);
          if (responsable) {
            pregunta(
              `¿Desea asignar la factura a la razón social ${responsable.razonSocial}?`, 
              "Cancelar", 
              "Aceptar",
              () => {
                // Callback para Cancelar - no hacer nada
              },
              async () => {
                // Callback para Aceptar - procesar factura con tercero
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
        // Si hay un responsable seleccionado, proceder a facturar
        await procesarFactura(selectedRow, null);
      }
    });
  }

  // Event listener para Enter en el campo CUIT
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

  // Event listener del botón volver en selección de responsable
  const botonVolverResponsable = document.getElementById("boton-volver-responsable");
  if (botonVolverResponsable) {
    botonVolverResponsable.addEventListener("click", volverFactura);
  }

  // Event listener del botón volver en resumen de factura
  const botonVolverFactura = document.getElementById("boton-volver-factura");
  if (botonVolverFactura) {
    botonVolverFactura.addEventListener("click", cambiarPantalla);
  }

  // Event listener del botón vista previa
  const botonVistaPrevia = document.getElementById("boton-vista-previa");
  if (botonVistaPrevia) {
    botonVistaPrevia.addEventListener("click", () => {
      window.open('../assets/image/facturaCortada.jpg', '_blank');
    });
  }

  // Event listener del botón aceptar en resumen de factura
  const botonAceptarFactura = document.getElementById("boton-aceptar-factura");
  if (botonAceptarFactura) {
    botonAceptarFactura.addEventListener("click", () => {
      const factura = obtenerFacturaGenerada();
      if (factura) {
        // Mostrar JSON de la factura
        mostrarJSONFacturaEnPantalla(factura, () => {
          // Callback cuando se cierra el JSON
          console.log("Factura generada y mostrada");
          // TODO: Implementar guardado en base de datos
        });
      } else {
        mensajeError("No se pudo generar la factura. Por favor, intente nuevamente.");
      }
    });
  }
  

  // La inicialización de selección de responsable se hace cuando se cargan los huéspedes
  // No es necesario inicializarla aquí porque la tabla está vacía al inicio
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}

