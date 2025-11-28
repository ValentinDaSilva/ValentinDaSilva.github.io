


export function mostrarJSONNotaCreditoEnPantalla(notaCredito, facturas, callbackCerrar) {
  
  let contenedorJSON = document.getElementById('contenedor-json-nota-credito');
  
  if (!contenedorJSON) {
    
    contenedorJSON = document.createElement('div');
    contenedorJSON.id = 'contenedor-json-nota-credito';
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
    infoAdicional.id = 'info-adicional-nota-credito';
    contenedorJSON.appendChild(infoAdicional);

    
    const textarea = document.createElement('textarea');
    textarea.id = 'json-display-nota-credito';
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

  
  const notaCreditoCompleta = {
    idNota: notaCredito.idNota,
    fecha: notaCredito.fecha,
    tipo: notaCredito.tipo,
    responsable: notaCredito.responsable,
    facturas: facturas.map(factura => ({
      id: factura.id,
      hora: factura.hora,
      fecha: factura.fecha,
      tipo: factura.tipo,
      estado: factura.estado,
      responsableDePago: factura.responsableDePago,
      estadia: factura.estadia,
      iva: factura.iva,
      total: factura.total,
      pagos: factura.pagos || []
    }))
  };

  
  const jsonFormateado = JSON.stringify(notaCreditoCompleta, null, 2);
  
  
  const infoAdicional = document.getElementById('info-adicional-nota-credito');
  if (infoAdicional && notaCredito) {
    const responsableNombre = notaCredito.responsable.tipo === 'tercero'
      ? notaCredito.responsable.razonSocial
      : `${notaCredito.responsable.apellido || ''}, ${notaCredito.responsable.nombres || ''}`.trim();
    
    const totalCalculado = (notaCredito.subtotal || 0) + (notaCredito.iva || 0);
    infoAdicional.innerHTML = `
      <strong>Información de la Nota de Crédito:</strong><br>
      • ID Nota: ${notaCredito.idNota || 'N/A'}<br>
      • Fecha: ${notaCredito.fecha || 'N/A'}<br>
      • Tipo: ${notaCredito.tipo || 'N/A'}<br>
      • Responsable: ${responsableNombre}<br>
      • Total: $${totalCalculado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}<br>
      • <strong>Facturas Anuladas:</strong> ${facturas.length}
    `;
  }
  
  
  const textarea = document.getElementById('json-display-nota-credito');
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

  
  console.log('=== NOTA DE CRÉDITO GENERADA ===');
  console.log('Nota de Crédito:', notaCreditoCompleta);
  console.log('JSON formateado:', jsonFormateado);
  console.log('================================');
}


if (typeof window !== 'undefined') {
  window.mostrarJSONNotaCreditoEnPantalla = mostrarJSONNotaCreditoEnPantalla;
}



