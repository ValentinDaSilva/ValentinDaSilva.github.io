/* Mostrar JSON de factura con pago en pantalla */

/**
 * Convierte una instancia de Factura a JSON
 * @param {Factura} factura - Instancia de Factura
 * @returns {Object} - JSON de la factura
 */
function convertirFacturaAJSON(factura) {
  // Convertir pagos a JSON
  const pagosJSON = factura.pagos.map(pago => {
    const pagoJSON = {
      id: pago.id,
      fecha: pago.fecha,
      hora: pago.hora,
      montoTotal: pago.montoTotal,
      medioDePago: null
    };
    
    // Convertir medio de pago según su tipo
    const medio = pago.medioDePago;
    
    if (medio && medio.constructor.name === 'Efectivo') {
      pagoJSON.medioDePago = {
        tipo: 'efectivo',
        monto: medio.monto
      };
    } else if (medio && medio.constructor.name === 'MonedaExtranjera') {
      pagoJSON.medioDePago = {
        tipo: 'monedaExtranjera',
        tipoMoneda: medio.tipoMoneda,
        montoExtranjero: medio.montoExtranjero,
        cotizacion: medio.cotizacion,
        monto: medio.monto
      };
    } else if (medio && medio.constructor.name === 'Cheque') {
      pagoJSON.medioDePago = {
        tipo: 'cheques',
        numero: medio.numero,
        monto: medio.monto,
        fechaVencimiento: medio.fechaVencimiento
      };
    } else if (medio && medio.constructor.name === 'Tarjeta') {
      pagoJSON.medioDePago = {
        tipo: 'tarjetas',
        tipoTarjeta: medio.tipo,
        numeroTarjeta: medio.numeroTarjeta,
        monto: medio.monto
      };
    }
    
    return pagoJSON;
  });
  
  // Construir JSON de factura
  const facturaJSON = {
    id: factura.id,
    hora: factura.hora,
    fecha: factura.fecha,
    tipo: factura.tipo,
    estado: factura.estado,
    responsableDePago: factura.responsableDePago,
    medioDePago: factura.medioDePago,
    estadia: factura.estadia,
    pagos: pagosJSON
  };
  
  return facturaJSON;
}

/**
 * Muestra el JSON de la factura con el pago en pantalla
 * @param {Factura} factura - Instancia de Factura con el pago agregado
 * @param {Function} callbackCerrar - Función a ejecutar cuando se cierre el JSON (opcional)
 */
export function mostrarJSONFacturaEnPantalla(factura, callbackCerrar) {
  // Crear o obtener el contenedor para mostrar el JSON
  let contenedorJSON = document.getElementById('contenedor-json-factura-pago');
  
  if (!contenedorJSON) {
    // Crear el contenedor si no existe
    contenedorJSON = document.createElement('div');
    contenedorJSON.id = 'contenedor-json-factura-pago';
    contenedorJSON.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border: 2px solid #333;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      max-width: 90%;
      max-height: 90%;
      width: 50vw;
      overflow: auto;
      z-index: 10001;
      font-family: Arial, sans-serif;
    `;

    // Crear título
    const titulo = document.createElement('h2');
    titulo.textContent = '📋 Factura con Pago Registrado (JSON)';
    titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
    contenedorJSON.appendChild(titulo);

    // Crear información adicional
    const infoAdicional = document.createElement('div');
    infoAdicional.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #e7f3ff; border-radius: 4px; font-size: 14px;';
    infoAdicional.id = 'info-adicional-factura-pago';
    contenedorJSON.appendChild(infoAdicional);

    // Crear área de texto con el JSON
    const textarea = document.createElement('textarea');
    textarea.id = 'json-display-factura-pago';
    textarea.readOnly = true;
    textarea.style.cssText = `
      width: 100%;
      min-height: 400px;
      padding: 15px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 13px;
      resize: vertical;
      box-sizing: border-box;
      background: #f8f9fa;
      line-height: 1.5;
    `;
    contenedorJSON.appendChild(textarea);

    // Crear botón para cerrar
    const botonCerrar = document.createElement('button');
    botonCerrar.textContent = 'Cerrar';
    botonCerrar.style.cssText = `
      margin-top: 15px;
      padding: 10px 30px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      transition: background 0.3s;
    `;
    botonCerrar.onclick = function() {
      contenedorJSON.style.display = 'none';
      // Ejecutar callback si existe
      if (typeof callbackCerrar === 'function') {
        callbackCerrar();
      }
    };
    botonCerrar.onmouseover = function() {
      this.style.background = '#0056b3';
    };
    botonCerrar.onmouseout = function() {
      this.style.background = '#007bff';
    };
    contenedorJSON.appendChild(botonCerrar);
    
    // Guardar el callback para poder usarlo más adelante
    contenedorJSON._callbackCerrar = callbackCerrar;

    // Agregar al body
    document.body.appendChild(contenedorJSON);
  }

  // Convertir factura a JSON
  const facturaJSON = convertirFacturaAJSON(factura);
  
  // Formatear el JSON con indentación
  const jsonFormateado = JSON.stringify(facturaJSON, null, 2);
  
  // Actualizar información adicional
  const infoAdicional = document.getElementById('info-adicional-factura-pago');
  if (infoAdicional && factura) {
    const responsableNombre = factura.responsableDePago?.tipo === 'tercero'
      ? factura.responsableDePago.razonSocial
      : `${factura.responsableDePago?.apellido || ''}, ${factura.responsableDePago?.nombres || ''}`.trim();
    
    const totalPagos = factura.pagos.reduce((sum, p) => sum + p.montoTotal, 0);
    
    infoAdicional.innerHTML = `
      <strong>Información de la Factura:</strong><br>
      • ID: ${factura.id || 'N/A'}<br>
      • Fecha: ${factura.fecha || 'N/A'}<br>
      • Hora: ${factura.hora || 'N/A'}<br>
      • Tipo: ${factura.tipo || 'N/A'}<br>
      • Responsable: ${responsableNombre || 'N/A'}<br>
      • Estado: ${factura.estado || 'N/A'}<br>
      • Total Pagos: $${totalPagos.toFixed(2)}<br>
      • Cantidad de Pagos: ${factura.pagos.length}
    `;
  }
  
  // Mostrar en el textarea
  const textarea = document.getElementById('json-display-factura-pago');
  if (textarea) {
    textarea.value = jsonFormateado;
    // Hacer scroll al inicio
    textarea.scrollTop = 0;
  }

  // Actualizar el callback si se proporcionó uno nuevo
  if (typeof callbackCerrar === 'function') {
    contenedorJSON._callbackCerrar = callbackCerrar;
    // Actualizar el onclick del botón para incluir el nuevo callback
    const botonCerrar = contenedorJSON.querySelector('button');
    if (botonCerrar) {
      botonCerrar.onclick = function() {
        contenedorJSON.style.display = 'none';
        if (typeof callbackCerrar === 'function') {
          callbackCerrar();
        }
      };
    }
  }

  // Mostrar el contenedor
  contenedorJSON.style.display = 'block';

  // También mostrar en consola para debugging
  console.log('=== FACTURA CON PAGO ===');
  console.log('Factura:', factura);
  console.log('JSON formateado:', jsonFormateado);
  console.log('========================');
}

