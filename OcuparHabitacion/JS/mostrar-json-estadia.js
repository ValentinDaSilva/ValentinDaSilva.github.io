


function convertirEstadiaAJSON(estadia) {
    
    let reservaJSON = null;
    if (estadia.reserva) {
        reservaJSON = {
            id: estadia.reserva.id,
            fechaInicio: estadia.reserva.fechaInicio instanceof Date 
                ? estadia.reserva.fechaInicio.toISOString().split('T')[0]
                : estadia.reserva.fechaInicio,
            fechaFin: estadia.reserva.fechaFin instanceof Date
                ? estadia.reserva.fechaFin.toISOString().split('T')[0]
                : estadia.reserva.fechaFin,
            estado: estadia.reserva.estado
        };
        
        
        if (estadia.reserva.habitaciones && estadia.reserva.habitaciones.length > 0) {
            reservaJSON.habitaciones = estadia.reserva.habitaciones.map(hab => ({
                numero: hab.numero,
                tipo: hab.tipo,
                categoria: hab.categoria || '',
                costoPorNoche: hab.costoPorNoche
            }));
        }
        
        
        if (estadia.reserva.titular) {
            reservaJSON.titular = {
                nombre: estadia.reserva.titular.nombre,
                apellido: estadia.reserva.titular.apellido,
                telefono: estadia.reserva.titular.telefono || ''
            };
        }
    }
    
    
    function convertirHuespedAJSON(huesped) {
        if (!huesped) return null;
        
        
        
        let caracteristica = '';
        let telefonoNumero = '';
        if (huesped.telefono) {
            const telefonoStr = huesped.telefono.toString();
            
            if (telefonoStr.includes('-')) {
                const partes = telefonoStr.split('-');
                caracteristica = partes[0] || '';
                telefonoNumero = partes.slice(1).join('-') || '';
            } else {
                
                
                if (telefonoStr.length >= 7) {
                    caracteristica = telefonoStr.substring(0, 3);
                    telefonoNumero = telefonoStr.substring(3);
                } else {
                    telefonoNumero = telefonoStr;
                }
            }
        }
        
        
        const huespedJSON = {
            apellido: huesped.apellido || '',
            nombres: huesped.nombre || '',
            tipoDocumento: huesped.tipoDocumento || '',
            numeroDocumento: huesped.nroDocumento || '',
            cuit: huesped.cuit || '',
            fechaNacimiento: huesped.fechaNacimiento instanceof Date
                ? huesped.fechaNacimiento.toISOString().split('T')[0]
                : (typeof huesped.fechaNacimiento === 'string' ? huesped.fechaNacimiento : '2000-01-01'),
            caracteristica: caracteristica,
            telefonoNumero: telefonoNumero,
            email: huesped.email || '',
            ocupacion: huesped.ocupacion || '',
            nacionalidad: huesped.nacionalidad || ''
        };
        
        
        if (huesped.direccion) {
            huespedJSON.calle = huesped.direccion.calle || '';
            huespedJSON.numeroCalle = huesped.direccion.numero || '';
            huespedJSON.departamento = huesped.direccion.departamento || '';
            huespedJSON.piso = huesped.direccion.piso || '';
            huespedJSON.codigoPostal = huesped.direccion.codigoPostal || '';
            huespedJSON.localidad = huesped.direccion.localidad || '';
            huespedJSON.provincia = huesped.direccion.provincia || '';
            huespedJSON.pais = huesped.direccion.pais || '';
        } else {
            
            huespedJSON.calle = '';
            huespedJSON.numeroCalle = '';
            huespedJSON.departamento = '';
            huespedJSON.piso = '';
            huespedJSON.codigoPostal = '';
            huespedJSON.localidad = '';
            huespedJSON.provincia = '';
            huespedJSON.pais = '';
        }
        
        
        if (huesped.condicionIVA) {
            huespedJSON.condicionIVA = huesped.condicionIVA;
        }
        
        return huespedJSON;
    }
    
    
    const titularJSON = convertirHuespedAJSON(estadia.titular);
    
    
    const acompaniantesJSON = (estadia.acompaniantes || []).map(acomp => 
        convertirHuespedAJSON(acomp)
    ).filter(acomp => acomp !== null);
    
    
    const estadiaJSON = {
        id: estadia.id,
        fechaCheckIn: estadia.fechaCheckIn instanceof Date
            ? estadia.fechaCheckIn.toISOString().split('T')[0]
            : estadia.fechaCheckIn,
        fechaCheckOut: estadia.fechaCheckOut instanceof Date
            ? estadia.fechaCheckOut.toISOString().split('T')[0]
            : (estadia.fechaCheckOut || null),
        estado: estadia.estado,
        reserva: reservaJSON,
        titular: titularJSON,
        acompaniantes: acompaniantesJSON,
        consumos: estadia.consumos || []
    };
    
    return estadiaJSON;
}


function mostrarJSONEstadiaEnPantalla(estadia, callbackCerrar) {
    
    let contenedorJSON = document.getElementById('contenedor-json-estadia');
    
    if (!contenedorJSON) {
        
        contenedorJSON = document.createElement('div');
        contenedorJSON.id = 'contenedor-json-estadia';
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
            z-index: 10001;
            font-family: Arial, sans-serif;
        `;

        
        const titulo = document.createElement('h2');
        titulo.textContent = '📋 Datos de la Estadía (JSON)';
        titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
        contenedorJSON.appendChild(titulo);

        
        const infoAdicional = document.createElement('div');
        infoAdicional.style.cssText = 'display: none; margin-bottom: 15px; padding: 10px; background: #e7f3ff; border-radius: 4px; font-size: 14px;';
        infoAdicional.id = 'info-adicional-estadia';
        contenedorJSON.appendChild(infoAdicional);

        
        const textarea = document.createElement('textarea');
        textarea.id = 'json-display-estadia';
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

    
    const estadiaJSON = convertirEstadiaAJSON(estadia);
    
    
    const jsonFormateado = JSON.stringify(estadiaJSON, null, 2);
    
    
    const infoAdicional = document.getElementById('info-adicional-estadia');
    if (infoAdicional && estadia) {
        const fechaCheckIn = estadia.fechaCheckIn instanceof Date
            ? estadia.fechaCheckIn.toISOString().split('T')[0]
            : estadia.fechaCheckIn;
        const fechaCheckOut = estadia.fechaCheckOut instanceof Date
            ? estadia.fechaCheckOut.toISOString().split('T')[0]
            : (estadia.fechaCheckOut || 'No definida');
        
        infoAdicional.innerHTML = `
            <strong>Información de la Estadía:</strong><br>
            • ID Estadía: ${estadia.id || 'N/A'}<br>
            • Fecha Check-In: ${fechaCheckIn || 'N/A'}<br>
            • Fecha Check-Out: ${fechaCheckOut || 'N/A'}<br>
            • Estado: ${estadia.estado || 'N/A'}<br>
            • ID Reserva: ${estadia.reserva ? estadia.reserva.id : 'N/A'}<br>
            • Titular: ${estadia.titular ? `${estadia.titular.nombre || ''} ${estadia.titular.apellido || ''}`.trim() : 'N/A'}<br>
            • Acompañantes: ${estadia.acompaniantes ? estadia.acompaniantes.length : 0}
        `;
    }
    
    
    const textarea = document.getElementById('json-display-estadia');
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

    
    console.log('=== DATOS DE LA ESTADÍA (JSON) ===');
    console.log('Estadia completa:', estadia);
    console.log('JSON formateado:', jsonFormateado);
    console.log('==================================');
}


export { mostrarJSONEstadiaEnPantalla, convertirEstadiaAJSON };


window.mostrarJSONEstadiaEnPantalla = mostrarJSONEstadiaEnPantalla;

