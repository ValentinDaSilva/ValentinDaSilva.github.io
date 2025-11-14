/* Procesamiento de factura */

/**
 * Procesa la factura con el responsable seleccionado
 * @param {HTMLElement|null} selectedRow - Fila seleccionada de la tabla (huésped) o null
 * @param {Object|null} responsableTercero - Responsable de pago (tercero) o null
 */
async function procesarFactura(selectedRow, responsableTercero) {
  try {
    const estadia = obtenerEstadiaActual();
    if (!estadia) {
      mensajeError("No se encontró la estadía. Por favor, intente nuevamente.");
      return;
    }
    
    const horaSalida = document.getElementById("horaSalida").value.trim();
    if (!horaSalida) {
      mensajeError("La hora de salida es requerida.");
      return;
    }
    
    // Determinar responsable de pago
    let responsableDePago = null;
    
    if (responsableTercero) {
      // Es un tercero
      responsableDePago = responsableTercero;
    } else if (selectedRow) {
      // Es un huésped (titular o acompañante)
      const datosHuesped = JSON.parse(selectedRow.dataset.huesped || '{}');
      responsableDePago = datosHuesped;
    } else {
      mensajeError("Debe seleccionar un responsable de pago.");
      return;
    }
    
    // Generar factura
    const factura = generarJSONFactura(estadia, responsableDePago, horaSalida, 'B');
    
    // Mostrar datos en pantalla
    mostrarDatosFacturaEnPantalla(factura);
    
    // Cambiar a pantalla de factura
    facturar();
    
  } catch (error) {
    console.error('Error al procesar factura:', error);
    mensajeError("Error al generar la factura. Por favor, intente nuevamente.");
  }
}



