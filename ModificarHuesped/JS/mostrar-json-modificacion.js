/* 
 * Muestra el JSON de modificación de huésped en pantalla
 * Similar a mostrar-json-factura.js pero adaptado para modificación de huésped
 */

/**
 * Muestra el JSON de modificación de huésped en pantalla
 * @param {Object} jsonData - Datos JSON modificados del huésped
 * @param {Object} huespedOriginal - Datos originales del huésped (opcional, para comparación)
 * @param {Function} callbackCerrar - Función a ejecutar al cerrar el modal (opcional)
 */
function mostrarJSONModificacionEnPantalla(jsonData, huespedOriginal = null, callbackCerrar = null) {
    // Crear o obtener el contenedor para mostrar el JSON
    let contenedorJSON = document.getElementById('contenedor-json-modificacion');
    
    if (!contenedorJSON) {
        // Crear el contenedor si no existe
        contenedorJSON = document.createElement('div');
        contenedorJSON.id = 'contenedor-json-modificacion';
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
            overflow: auto;
            z-index: 10000;
            font-family: Arial, sans-serif;
        `;

        // Crear título
        const titulo = document.createElement('h2');
        titulo.textContent = 'Datos modificados del huésped - JSON para enviar al servidor backend';
        titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
        contenedorJSON.appendChild(titulo);

        // Crear área de texto con el JSON
        const textarea = document.createElement('textarea');
        textarea.id = 'json-display-modificacion';
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
    const jsonFormateado = JSON.stringify(jsonData, null, 2);
    
    // Mostrar en el textarea
    const textarea = document.getElementById('json-display-modificacion');
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
    console.log('=== DATOS MODIFICADOS DEL HUÉSPED ===');
    console.log('Datos originales:', huespedOriginal);
    console.log('Datos modificados:', jsonData);
    console.log('JSON formateado:', jsonFormateado);
    console.log('=====================================');
}

