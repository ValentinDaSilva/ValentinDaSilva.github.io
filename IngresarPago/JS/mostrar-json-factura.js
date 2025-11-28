


function convertirFacturaAJSON(factura) {
  // Obtener pagos - puede ser getter o propiedad directa
  // getPagos es un getter, así que se accede como propiedad
  let pagos = [];
  if (factura.pagos !== undefined) {
    pagos = factura.pagos;
  } else if (factura.getPagos !== undefined) {
    // Si existe el getter, acceder a él (los getters se acceden como propiedades)
    pagos = factura.getPagos;
  }
  if (!Array.isArray(pagos)) {
    pagos = [];
  }
  
  const pagosJSON = pagos.map(pago => {
    // Obtener montoTotal - puede ser propiedad directa o getter
    const montoTotal = pago.montoTotal !== undefined ? pago.montoTotal : (pago.getMontoTotal ? pago.getMontoTotal() : 0);
    
    const pagoJSON = {
      id: pago.id !== undefined ? pago.id : (pago.getId ? pago.getId() : null),
      fecha: pago.fecha !== undefined ? pago.fecha : (pago.getFecha ? pago.getFecha() : null),
      hora: pago.hora !== undefined ? pago.hora : (pago.getHora ? pago.getHora() : null),
      montoTotal: montoTotal,
      medioDePago: null
    };
    
    
    const medio = pago.medioDePago !== undefined ? pago.medioDePago : (pago.getMedioDePago ? pago.getMedioDePago() : null);
    
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
        tipo: 'tarjeta',
        tipoTarjeta: medio.tipo,
        numeroTarjeta: medio.numeroTarjeta,
        monto: medio.monto
      };
    }
    
    return pagoJSON;
  });
  
  // Obtener valores de la factura - puede ser getter o propiedad directa
  const id = factura.id !== undefined ? factura.id : (factura.getId ? factura.getId() : null);
  const hora = factura.hora !== undefined ? factura.hora : (factura.getHora ? factura.getHora() : null);
  const fecha = factura.fecha !== undefined ? factura.fecha : (factura.getFecha ? factura.getFecha() : null);
  const tipo = factura.tipo !== undefined ? factura.tipo : (factura.getTipo ? factura.getTipo() : null);
  const estado = factura.estado !== undefined ? factura.estado : (factura.getEstado ? factura.getEstado() : null);
  
  // Obtener responsableDePago y convertirlo a JSON si es una instancia de clase
  let responsableDePago = factura.responsableDePago !== undefined ? factura.responsableDePago : null;
  if (responsableDePago && typeof responsableDePago.toJSON === 'function') {
    // Es una instancia de PersonaFisica o PersonaJuridica, convertir a JSON
    responsableDePago = responsableDePago.toJSON();
  }
  
  const estadia = factura.estadia !== undefined ? factura.estadia : null;
  const total = factura.total !== undefined ? factura.total : (factura.getTotal ? factura.getTotal() : 0);
  const iva = factura.iva !== undefined ? factura.iva : (factura.getIva ? factura.getIva() : 0);
  const horaSalida = factura.horaSalida !== undefined ? factura.horaSalida : (factura.getHoraSalida ? factura.getHoraSalida() : null);
  
  // Generar JSON de Factura con todos los campos de la clase Factura
  const facturaJSON = {
    id: id,
    hora: hora,
    fecha: fecha,
    tipo: tipo,
    estado: estado,
    responsableDePago: responsableDePago,
    estadia: estadia,
    pagos: pagosJSON,
    total: total,
    iva: iva,
    horaSalida: horaSalida
  };
  
  return facturaJSON;
}


export function mostrarJSONFacturaEnPantalla(factura, callbackCerrar) {
  
  let contenedorJSON = document.getElementById('contenedor-json-factura-pago');
  
  if (!contenedorJSON) {
    
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

    
    const titulo = document.createElement('h2');
    titulo.textContent = 'Datos a enviar al servidor backend';
    titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
    contenedorJSON.appendChild(titulo);

    
    const infoAdicional = document.createElement('div');
    infoAdicional.style.cssText = 'display: none; margin-bottom: 15px; padding: 10px; background: #e7f3ff; border-radius: 4px; font-size: 14px;';
    infoAdicional.id = 'info-adicional-factura-pago';
    contenedorJSON.appendChild(infoAdicional);

    
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
    
    
    contenedorJSON._callbackCerrar = callbackCerrar;

    
    document.body.appendChild(contenedorJSON);
  }

  
  const facturaJSON = convertirFacturaAJSON(factura);
  
  
  const jsonFormateado = JSON.stringify(facturaJSON, null, 2);
  
  
  const infoAdicional = document.getElementById('info-adicional-factura-pago');
  if (infoAdicional && factura) {
    const responsableNombre = factura.responsableDePago?.tipo === 'juridica'
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
  
  
  const textarea = document.getElementById('json-display-factura-pago');
  if (textarea) {
    textarea.value = jsonFormateado;
    
    textarea.scrollTop = 0;
  }

  
  if (typeof callbackCerrar === 'function') {
    contenedorJSON._callbackCerrar = callbackCerrar;
    
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

  
  contenedorJSON.style.display = 'block';

  
  console.log('=== FACTURA CON PAGO ===');
  console.log('Factura:', factura);
  console.log('JSON formateado:', jsonFormateado);
  console.log('========================');
}

