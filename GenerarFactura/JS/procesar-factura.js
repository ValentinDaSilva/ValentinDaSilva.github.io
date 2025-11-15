


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
    
    
    let responsableDePago = null;
    
    if (responsableTercero) {
      
      responsableDePago = responsableTercero;
    } else if (selectedRow) {
      
      const datosHuesped = JSON.parse(selectedRow.dataset.huesped || '{}');
      responsableDePago = datosHuesped;
    } else {
      mensajeError("Debe seleccionar un responsable de pago.");
      return;
    }
    
    
    const factura = generarJSONFactura(estadia, responsableDePago, horaSalida, 'B');
    
    
    mostrarDatosFacturaEnPantalla(factura);
    
    
    facturar();
    
  } catch (error) {
    console.error('Error al procesar factura:', error);
    mensajeError("Error al generar la factura. Por favor, intente nuevamente.");
  }
}






