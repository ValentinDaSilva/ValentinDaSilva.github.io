/* 
 * Función para mostrar el JSON de la reserva que se enviará a la base de datos
 */

/**
 * Convierte las habitaciones con fechas individuales al formato JSON que se enviará a la base de datos
 * @param {Array} habitacionesConFechas - Array de objetos { habitacion: Habitacion, fechaDesde: string, fechaHasta: string }
 * @param {ReservaDTO} reservaDTO - Objeto ReservaDTO (para obtener datos del titular)
 * @returns {Array} - Array de objetos en formato JSON para la base de datos
 */
function convertirReservaDTOAJSONConFechasIndividuales(habitacionesConFechas, reservaDTO) {
    const reservasFormatoJSON = [];
    
    // Crear una entrada por cada habitación con sus fechas específicas
    habitacionesConFechas.forEach(item => {
        reservasFormatoJSON.push({
            numeroHabitacion: item.habitacion.numero,
            desde: item.fechaDesde,
            hasta: item.fechaHasta,
            responsable: reservaDTO.titular 
                ? `${reservaDTO.titular.apellido || ''}, ${reservaDTO.titular.nombre || ''}`.trim()
                : '',
            telefono: reservaDTO.titular ? reservaDTO.titular.telefono || '' : ''
        });
    });
    
    return reservasFormatoJSON;
}

/**
 * Convierte un ReservaDTO al formato JSON que se enviaría a la base de datos
 * (Función antigua mantenida por compatibilidad, pero ahora se usa convertirReservaDTOAJSONConFechasIndividuales)
 * @param {ReservaDTO} reservaDTO - Objeto ReservaDTO
 * @returns {Array} - Array de objetos en formato JSON para la base de datos
 */
function convertirReservaDTOAJSON(reservaDTO) {
    const reservasFormatoJSON = [];
    
    if (reservaDTO.habitaciones && reservaDTO.habitaciones.length > 0) {
        // Crear una entrada por cada habitación (formato del JSON)
        reservaDTO.habitaciones.forEach(habitacion => {
            reservasFormatoJSON.push({
                numeroHabitacion: habitacion.numero,
                desde: reservaDTO.fechaInicio,
                hasta: reservaDTO.fechaFin,
                responsable: reservaDTO.titular 
                    ? `${reservaDTO.titular.apellido || ''}, ${reservaDTO.titular.nombre || ''}`.trim()
                    : '',
                telefono: reservaDTO.titular ? reservaDTO.titular.telefono || '' : ''
            });
        });
    } else {
        // Si no hay habitaciones, crear una entrada básica
        reservasFormatoJSON.push({
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

/**
 * Guarda las reservas en la base de datos usando las fechas individuales
 * @param {Array} nuevasReservas - Array de reservas en formato JSON a guardar
 * @returns {Promise<void>}
 */
async function guardarReservaConFechasIndividuales(nuevasReservas) {
    try {
        // Leer todas las reservas existentes
        const respuesta = await fetch('/Datos/reservas.json');
        let reservasExistentes = [];
        
        if (respuesta.ok) {
            const datos = await respuesta.json();
            reservasExistentes = datos.reservas || [];
        }

        // Agregar las nuevas reservas (que ya tienen las fechas individuales correctas)
        reservasExistentes.push(...nuevasReservas);

        // Simular el guardado (en un entorno real, esto se haría con una llamada al servidor)
        console.log('=== FORMATO FINAL PARA JSON ===');
        console.log('Entradas a agregar al JSON (una por cada habitación con sus fechas):', nuevasReservas);
        console.log('Total de entradas:', nuevasReservas.length);
        console.log('==============================');
        
        // TODO: Implementar guardado real cuando se tenga acceso al servidor
        // Por ahora, solo se simula el guardado
    } catch (error) {
        console.error('Error al guardar reserva en BD:', error);
        throw error;
    }
}

/**
 * Muestra el JSON en pantalla en un contenedor especial
 * @param {Array} nuevasReservas - Array de nuevas reservas a agregar
 * @param {ReservaDTO} reservaDTO - ReservaDTO completo para referencia
 * @param {Function} callbackCerrar - Función a ejecutar cuando se cierre el JSON (opcional)
 */
function mostrarJSONReservaEnPantalla(nuevasReservas, reservaDTO, callbackCerrar) {
    // Crear o obtener el contenedor para mostrar el JSON
    let contenedorJSON = document.getElementById('contenedor-json-reserva');
    
    if (!contenedorJSON) {
        // Crear el contenedor si no existe
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

        // Crear título
        const titulo = document.createElement('h2');
        titulo.textContent = '📋 Datos a enviar a la Base de Datos (JSON)';
        titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
        contenedorJSON.appendChild(titulo);

        // Crear información adicional
        const infoAdicional = document.createElement('div');
        infoAdicional.style.cssText = 'margin-bottom: 15px; padding: 10px; background: #e7f3ff; border-radius: 4px; font-size: 14px;';
        infoAdicional.id = 'info-adicional-reserva';
        contenedorJSON.appendChild(infoAdicional);

        // Crear área de texto con el JSON
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

    // Formatear el JSON con indentación (solo las nuevas reservas)
    // Si hay múltiples habitaciones, mostrar cada una como objeto separado
    const jsonFormateado = JSON.stringify(nuevasReservas, null, 2);
    
    // Actualizar información adicional
    const infoAdicional = document.getElementById('info-adicional-reserva');
    if (infoAdicional && reservaDTO) {
        const habitacionesCount = reservaDTO.habitaciones ? reservaDTO.habitaciones.length : 0;
        
        // Verificar si todas las habitaciones tienen las mismas fechas
        let todasMismasFechas = true;
        if (nuevasReservas.length > 1) {
            const primeraFechaDesde = nuevasReservas[0].desde;
            const primeraFechaHasta = nuevasReservas[0].hasta;
            todasMismasFechas = nuevasReservas.every(r => r.desde === primeraFechaDesde && r.hasta === primeraFechaHasta);
        }
        
        let infoFechas = '';
        if (todasMismasFechas && nuevasReservas.length > 0) {
            infoFechas = `• Fecha Inicio: ${nuevasReservas[0].desde || 'N/A'}<br>
                          • Fecha Fin: ${nuevasReservas[0].hasta || 'N/A'}<br>`;
        } else {
            infoFechas = `• <strong>Fechas:</strong> Diferentes por habitación (ver JSON abajo)<br>`;
        }
        
        infoAdicional.innerHTML = `
            <strong>Información de la Reserva:</strong><br>
            • ID Reserva: ${reservaDTO.id || 'N/A'}<br>
            ${infoFechas}
            • Estado: ${reservaDTO.estado || 'N/A'}<br>
            • Habitaciones: ${habitacionesCount}<br>
            • Titular: ${reservaDTO.titular ? `${reservaDTO.titular.nombre || ''} ${reservaDTO.titular.apellido || ''}`.trim() : 'N/A'}<br>
            • <strong>Entradas a agregar a la BD:</strong> ${nuevasReservas.length}
        `;
    }
    
    // Mostrar en el textarea
    const textarea = document.getElementById('json-display-reserva');
    if (textarea) {
        // Mostrar solo las nuevas reservas que se agregarán
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
    console.log('=== DATOS A ENVIAR A LA BASE DE DATOS ===');
    console.log('ReservaDTO completo:', reservaDTO);
    console.log('Entradas a agregar a la BD:', nuevasReservas);
    console.log('JSON formateado:', jsonFormateado);
    console.log('Total de entradas:', nuevasReservas.length);
    console.log('==========================================');
}

