


async function procesarFactura(selectedRow, responsableTercero) {
  let estadia = null;
  let responsableDePago = null;
  
  try {
    estadia = obtenerEstadiaActual();
    if (!estadia) {
      mensajeError("No se encontró la estadía. Por favor, intente nuevamente.");
      return;
    }
    
    const horaSalida = document.getElementById("horaSalida").value.trim();
    if (!horaSalida) {
      mensajeError("La hora de salida es requerida.");
      return;
    }
    
    
    
    if (responsableTercero) {
      
      responsableDePago = responsableTercero;
    } else if (selectedRow) {
      
      const datosHuesped = JSON.parse(selectedRow.dataset.huesped || '{}');
      responsableDePago = datosHuesped;
    } else {
      mensajeError("Debe seleccionar un responsable de pago.");
      return;
    }
    
    
    let factura = null;
    console.log('Verificando gestores disponibles:', {
      gestorFactura: !!window.gestorFactura,
      gestorGenerarFactura: !!window.gestorGenerarFactura,
      generarJSONFactura: typeof generarJSONFactura
    });
    
    try {
      if (window.gestorFactura) {
        console.log('Usando window.gestorFactura');
        factura = await window.gestorFactura.generarFactura(estadia, responsableDePago, horaSalida, 'B');
        console.log('Factura retornada por gestorFactura:', factura);
        console.log('Tipo de factura:', typeof factura);
        console.log('Factura es null?', factura === null);
        console.log('Factura es undefined?', factura === undefined);
        console.log('Factura es truthy?', !!factura);
      } else if (window.gestorGenerarFactura) {
        console.log('Usando window.gestorGenerarFactura');
        factura = await window.gestorGenerarFactura.procesarFactura(estadia, responsableDePago, horaSalida, 'B');
        console.log('Factura retornada por gestorGenerarFactura:', factura);
      } else if (typeof generarJSONFactura === 'function') {
        console.log('Usando función generarJSONFactura local');
        factura = await generarJSONFactura(estadia, responsableDePago, horaSalida, 'B');
        console.log('Factura retornada por generarJSONFactura:', factura);
      } else {
        console.error('No se encontró ningún método para generar factura');
        throw new Error('No hay método disponible para generar factura');
      }
    } catch (errorGen) {
      console.error('Error específico al generar factura:', errorGen);
      throw errorGen;
    }
    
    if (factura) {
      console.log('Mostrando factura en pantalla...');
      
      // Guardar factura globalmente para que obtenerFacturaGenerada() funcione
      console.log('Guardando factura globalmente...');
      
      // Establecer window.facturaGenerada directamente
      window.facturaGenerada = factura;
      console.log('Factura guardada en window.facturaGenerada:', !!window.facturaGenerada);
      
      // También llamar a obtenerFacturaGenerada si está disponible para verificar
      if (typeof window.obtenerFacturaGenerada === 'function') {
        const facturaVerificada = window.obtenerFacturaGenerada();
        console.log('Verificación: obtenerFacturaGenerada() retorna:', !!facturaVerificada);
        
        // Si obtenerFacturaGenerada no retorna la factura, usar limpiar y un método alternativo
        if (!facturaVerificada && typeof window.limpiarFacturaGenerada === 'function') {
          window.limpiarFacturaGenerada();
        }
      }
      
      try {
        if (typeof mostrarDatosFacturaEnPantalla === 'function') {
          console.log('Llamando a mostrarDatosFacturaEnPantalla (local)');
          mostrarDatosFacturaEnPantalla(factura);
        } else if (typeof window.mostrarDatosFacturaEnPantalla === 'function') {
          console.log('Llamando a window.mostrarDatosFacturaEnPantalla');
          window.mostrarDatosFacturaEnPantalla(factura);
        } else {
          console.warn('mostrarDatosFacturaEnPantalla no está disponible');
        }
        
        console.log('Llamando a facturar()...');
        if (typeof facturar === 'function') {
          facturar();
          console.log('facturar() ejecutado correctamente');
        } else if (typeof window.facturar === 'function') {
          window.facturar();
          console.log('window.facturar() ejecutado correctamente');
        } else {
          console.warn('facturar() no está disponible');
        }
        
        console.log('Factura procesada exitosamente');
      } catch (errorMostrar) {
        console.error('Error al mostrar factura:', errorMostrar);
        throw errorMostrar;
      }
    } else {
      console.error('Factura es null o undefined');
      mensajeError("Error al generar la factura. Por favor, intente nuevamente.");
    }
    
  } catch (error) {
    console.error('Error al procesar factura:', error);
    console.error('Stack:', error.stack);
    console.error('Estadia:', estadia);
    console.error('Responsable de pago:', responsableDePago);
    const mensajeErrorCompleto = error.message || "Por favor, intente nuevamente.";
    mensajeError("Error al generar la factura: " + mensajeErrorCompleto);
  }
}






