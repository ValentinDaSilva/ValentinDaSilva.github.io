


function mostrarJSONModificacionEnPantalla(jsonData, huespedOriginal = null, callbackCerrar = null) {
    
    let contenedorJSON = document.getElementById('contenedor-json-modificacion');
    
    if (!contenedorJSON) {
        
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

        
        const titulo = document.createElement('h2');
        titulo.textContent = 'Datos modificados del huésped - JSON para enviar al servidor backend';
        titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
        contenedorJSON.appendChild(titulo);

        
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

    
    const jsonFormateado = JSON.stringify(jsonData, null, 2);
    
    
    const textarea = document.getElementById('json-display-modificacion');
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

    
    console.log('=== DATOS MODIFICADOS DEL HUÉSPED ===');
    console.log('Datos originales:', huespedOriginal);
    console.log('Datos modificados:', jsonData);
    console.log('JSON formateado:', jsonFormateado);
    console.log('=====================================');
}

