/* Mostrar JSON de factura en pantalla */

/**
 * Muestra el JSON de la factura en pantalla en un contenedor especial
 * @param {Object} factura - Objeto factura
 * @param {Function} callbackCerrar - Función a ejecutar cuando se cierre el JSON (opcional)
 */
function mostrarJSONFacturaEnPantalla(factura, callbackCerrar) {
  // Crear o obtener el contenedor para mostrar el JSON
  let contenedorJSON = document.getElementById('contenedor-json-factura');
  
  if (!contenedorJSON) {
    // Crear el contenedor si no existe
    contenedorJSON = document.createElement('div');
    contenedorJSON.id = 'contenedor-json-factura';
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
      width: 40vw;
      overflow: auto;
      z-index: 10001;
      font-family: Arial, sans-serif;
    `;

    // Crear título
    const titulo = document.createElement('h2');
    titulo.textContent = '📋 Factura Generada (JSON)';
    titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
    contenedorJSON.appendChild(titulo);

    // Crear información adicional
    const infoAdicional = document.createElement('div');
    infoAdicional.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #e7f3ff; border-radius: 4px; font-size: 14px;';
    infoAdicional.id = 'info-adicional-factura';
    contenedorJSON.appendChild(infoAdicional);

    // Crear área de texto con el JSON
    const textarea = document.createElement('textarea');
    textarea.id = 'json-display-factura';
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

  // Formatear el JSON con indentación
  const jsonFormateado = JSON.stringify(factura, null, 2);
  
  // Actualizar información adicional
  const infoAdicional = document.getElementById('info-adicional-factura');
  if (infoAdicional && factura) {
    const responsableNombre = factura.responsableDePago.tipo === 'tercero'
      ? factura.responsableDePago.razonSocial
      : `${factura.responsableDePago.apellido}, ${factura.responsableDePago.nombres}`;
    
    infoAdicional.innerHTML = `
      <strong>Información de la Factura:</strong><br>
      • ID Estadía: ${factura.estadia.id || 'N/A'}<br>
      • Fecha: ${factura.fecha || 'N/A'}<br>
      • Hora: ${factura.hora || 'N/A'}<br>
      • Tipo: ${factura.tipo || 'N/A'}<br>
      • Responsable: ${responsableNombre}<br>
      • Total: $${factura.detalle.total.toFixed(2) || '0.00'}<br>
      • <strong>Estado:</strong> ${factura.estado || 'N/A'}
    `;
  }
  
  // Mostrar en el textarea
  const textarea = document.getElementById('json-display-factura');
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
  console.log('=== FACTURA GENERADA ===');
  console.log('Factura:', factura);
  console.log('JSON formateado:', jsonFormateado);
  console.log('=======================');
}



