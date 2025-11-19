


function convertirReservaDTOAJSONConFechasIndividuales(habitacionesConFechas, reservaDTO) {
    
    const titular = reservaDTO.titular ? {
        nombre: reservaDTO.titular.nombre || '',
        apellido: reservaDTO.titular.apellido || '',
        telefono: reservaDTO.titular.telefono || ''
    } : null;

    
    const reservasJSON = habitacionesConFechas.map((item, index) => {
        
        const habitacionIndividual = {
            numero: item.habitacion.numero,
            tipo: item.habitacion.tipo,
            categoria: item.habitacion.categoria || '',
            costoPorNoche: item.habitacion.costoNoche || item.habitacion.costoPorNoche || 0,
            estadoHabitacion: item.habitacion.estado || item.habitacion.estadoHabitacion || 'Disponible'
        };

        
        
        const reservaJSON = {
            id: null, 
            fechaInicio: item.fechaDesde,
            fechaFin: item.fechaHasta,
            titular: titular,
            estado: reservaDTO.estado || 'Pendiente',
            habitaciones: [habitacionIndividual] 
        };
        
        return reservaJSON;
    });
    
    return reservasJSON;
}


function convertirReservaDTOAJSON(reservaDTO) {
    const reservasFormatoJSON = [];
    
    
    const titularCompleto = reservaDTO.titular ? {
        nombre: reservaDTO.titular.nombre || '',
        apellido: reservaDTO.titular.apellido || '',
        telefono: reservaDTO.titular.telefono || '',
        tipoDocumento: reservaDTO.titular.tipoDocumento || null,
        nroDocumento: reservaDTO.titular.nroDocumento || null,
        fechaNacimiento: reservaDTO.titular.fechaNacimiento || null,
        condicionIVA: reservaDTO.titular.condicionIVA || null,
        ocupacion: reservaDTO.titular.ocupacion || null,
        nacionalidad: reservaDTO.titular.nacionalidad || null,
        cuit: reservaDTO.titular.cuit || null,
        email: reservaDTO.titular.email || null
    } : null;

    
    const habitacionesCompletas = reservaDTO.habitaciones ? reservaDTO.habitaciones.map(hab => ({
        numero: hab.numero,
        tipo: hab.tipo,
        categoria: hab.categoria || '',
        costoPorNoche: hab.costoPorNoche || hab.costoNoche,
        estadoHabitacion: hab.estadoHabitacion || null
    })) : [];
    
    if (reservaDTO.habitaciones && reservaDTO.habitaciones.length > 0) {
        
        reservaDTO.habitaciones.forEach(habitacion => {
        reservasFormatoJSON.push({
            id: reservaDTO.id || null,
            fechaInicio: reservaDTO.fechaInicio,
            fechaFin: reservaDTO.fechaFin,
            titular: titularCompleto,
            estado: reservaDTO.estado || null,
            habitaciones: habitacionesCompletas
        });
        });
    } else {
        
        reservasFormatoJSON.push({
            id: reservaDTO.id || null,
            fechaInicio: reservaDTO.fechaInicio,
            fechaFin: reservaDTO.fechaFin,
            titular: titularCompleto,
            estado: reservaDTO.estado || null,
            habitaciones: habitacionesCompletas,
            
            numeroHabitacion: null,
            desde: reservaDTO.fechaInicio,
            hasta: reservaDTO.fechaFin,
            responsable: reservaDTO.titular 
                ? `${reservaDTO.titular.apellido || ''}, ${reservaDTO.titular.nombre || ''}`.trim()
                : '',
            telefono: reservaDTO.titular ? reservaDTO.titular.telefono || '' : ''
        });
    }
    
    return reservasFormatoJSON;
}


async function guardarReservaConFechasIndividuales(nuevasReservas) {
    try {
        
        const respuesta = await fetch('/Datos/reservas.json');
        let reservasExistentes = [];
        
        if (respuesta.ok) {
            const datos = await respuesta.json();
            reservasExistentes = datos.reservas || [];
        }

        
        reservasExistentes.push(...nuevasReservas);

        
        console.log('=== FORMATO FINAL PARA JSON ===');
        console.log('Reservas a agregar al JSON (una por cada habitación):', nuevasReservas);
        console.log('Total de reservas a agregar:', nuevasReservas.length);
        console.log('==============================');
        
        
        
    } catch (error) {
        console.error('Error al guardar reserva en BD:', error);
        throw error;
    }
}


function mostrarJSONReservaEnPantalla(nuevasReservas, reservaDTO, callbackCerrar) {
    
    let contenedorJSON = document.getElementById('contenedor-json-reserva');
    
    if (!contenedorJSON) {
        
        contenedorJSON = document.createElement('div');
        contenedorJSON.id = 'contenedor-json-reserva';
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
        titulo.textContent = 'Datos a enviar al servidor backend';
        titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
        contenedorJSON.appendChild(titulo);

        
        const infoAdicional = document.createElement('div');
        infoAdicional.style.cssText = 'display: none; margin-bottom: 15px; padding: 10px; background: #e7f3ff; border-radius: 4px; font-size: 14px;';
        infoAdicional.id = 'info-adicional-reserva';
        contenedorJSON.appendChild(infoAdicional);

        
        const textarea = document.createElement('textarea');
        textarea.id = 'json-display-reserva';
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

    
    const jsonFormateado = JSON.stringify(nuevasReservas, null, 2);
    
    
    
    
    const textarea = document.getElementById('json-display-reserva');
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

    
    console.log('=== DATOS A ENVIAR A LA BASE DE DATOS ===');
    console.log('ReservaDTO completo:', reservaDTO);
    console.log('Reservas a agregar a la BD (una por cada habitación):', nuevasReservas);
    console.log('JSON formateado:', jsonFormateado);
    console.log('Total de reservas a agregar:', nuevasReservas.length);
    console.log('==========================================');
}


window.convertirReservaDTOAJSONConFechasIndividuales = convertirReservaDTOAJSONConFechasIndividuales;
window.mostrarJSONReservaEnPantalla = mostrarJSONReservaEnPantalla;

