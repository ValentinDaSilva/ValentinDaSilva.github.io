/* Gestión de la búsqueda y selección de huéspedes */

let huespedesSeleccionados = [];

/**
 * Renderiza los resultados de la búsqueda en la tabla
 * @param {Array} resultados - Array de huéspedes a mostrar
 */
function renderizarResultadosHuespedes(resultados) {
    const tbody = document.querySelector('.resultadoBusqueda tbody');
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    // Limpiar el contenido anterior
    tbody.innerHTML = '';
    
    // Mostrar mensaje si no hay resultados
    if (resultados.length === 0) {
        const filaVacia = document.createElement('tr');
        const celdaVacia = document.createElement('td');
        celdaVacia.colSpan = 4;
        celdaVacia.textContent = 'No se encontraron resultados';
        celdaVacia.style.textAlign = 'center';
        celdaVacia.style.padding = '20px';
        celdaVacia.style.color = '#666';
        filaVacia.appendChild(celdaVacia);
        tbody.appendChild(filaVacia);
        return;
    }
    
    // Crear filas para cada resultado
    resultados.forEach(huesped => {
        const fila = document.createElement('tr');
        
        // Celda de Apellido
        const celdaApellido = document.createElement('td');
        celdaApellido.textContent = huesped.apellido;
        
        // Celda de Nombres
        const celdaNombres = document.createElement('td');
        celdaNombres.textContent = huesped.nombres;
        
        // Celda de Tipo de Documento
        const celdaTipoDoc = document.createElement('td');
        celdaTipoDoc.textContent = huesped.tipoDocumento;
        
        // Celda de Número de Documento
        const celdaNumDoc = document.createElement('td');
        celdaNumDoc.textContent = huesped.numeroDocumento;
        
        // Agregar celdas a la fila
        fila.appendChild(celdaApellido);
        fila.appendChild(celdaNombres);
        fila.appendChild(celdaTipoDoc);
        fila.appendChild(celdaNumDoc);
        
        // Agregar atributo de datos para identificar el huésped
        fila.setAttribute('data-huesped', JSON.stringify(huesped));
        
        // Agregar la fila al tbody
        tbody.appendChild(fila);
    });
    
    console.log(`Se renderizaron ${resultados.length} resultados`);
}

/**
 * Inicializa la selección de huéspedes en la tabla de resultados (selección múltiple)
 */
function inicializarSeleccionHuespedes() {
    huespedesSeleccionados = [];
    
    const filasHuespedes = document.querySelectorAll('.resultadoBusqueda tbody tr');
    filasHuespedes.forEach(fila => {
        // Limpiar listeners anteriores
        const nuevaFila = fila.cloneNode(true);
        fila.parentNode.replaceChild(nuevaFila, fila);
        
        nuevaFila.addEventListener('click', () => {
            const indice = huespedesSeleccionados.indexOf(nuevaFila);
            if (indice === -1) {
                // Agregar a selección
                huespedesSeleccionados.push(nuevaFila);
                nuevaFila.style.backgroundColor = 'yellow';
                nuevaFila.style.color = 'black';
            } else {
                // Remover de selección
                huespedesSeleccionados.splice(indice, 1);
                nuevaFila.style.backgroundColor = '';
                nuevaFila.style.color = '';
            }
        });
    });
}

/**
 * Obtiene los datos de los huéspedes seleccionados
 * @returns {Array} - Array de objetos con los datos de los huéspedes seleccionados
 */
function obtenerDatosHuespedesSeleccionados() {
    return huespedesSeleccionados.map(fila => {
        const datosHuesped = fila.getAttribute('data-huesped');
        if (datosHuesped) {
            return JSON.parse(datosHuesped);
        }
        return null;
    }).filter(huesped => huesped !== null);
}

/**
 * Inicializa el formulario de búsqueda de huésped
 */
async function inicializarBusquedaHuesped() {
    const formBuscar = document.querySelector('.container form');
    const resultadoDiv = document.querySelector('.resultadoBusqueda');
    
    if (!formBuscar || !resultadoDiv) {
        console.error('Elementos de búsqueda de huésped no encontrados');
        return;
    }

    // Verificar que los datos estén cargados
    if (datosHuespedes.length === 0) {
        await cargarHuespedes();
        if (datosHuespedes.length === 0) {
            mensajeError('No se pudieron cargar los datos. Por favor, recarga la página.');
            return;
        }
    }

    formBuscar.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        // Obtener valores del formulario
        const apellido = document.getElementById('apellido').value.trim();
        const nombres = document.getElementById('nombres').value.trim();
        const tipoDocumento = document.getElementById('tipoDocumento').value;
        const numeroDocumento = document.getElementById('numeroDocumento').value.trim();
        
        // Filtrar huéspedes según los criterios de búsqueda
        const resultados = filtrarHuespedes(apellido, nombres, tipoDocumento, numeroDocumento);
        
        // Renderizar resultados
        renderizarResultadosHuespedes(resultados);
        
        // Mostrar el contenedor de resultados
        resultadoDiv.style.display = 'block';
        // Animar desde abajo del viewport hacia arriba
        setTimeout(() => {
            resultadoDiv.style.top = '50px';
        }, 10);
        
        // Inicializar selección después de renderizar
        setTimeout(() => {
            inicializarSeleccionHuespedes();
        }, 100);
    });

    const siguienteBusquedaButton = document.querySelector('.siguienteBusqueda');
    if (siguienteBusquedaButton) {
        siguienteBusquedaButton.addEventListener('click', function() {
            if (huespedesSeleccionados.length === 0) {
                mensajeError("Por favor, seleccione al menos un huésped antes de continuar.");
                return;
            }
            
            const habitacionesSeleccionadas = obtenerHabitacionesSeleccionadas();
            if (habitacionesSeleccionadas.length === 0) {
                mensajeError("Por favor, seleccione al menos una habitación.");
                return;
            }

            const datosHuespedes = obtenerDatosHuespedesSeleccionados();
            
            pregunta(
                "¿Qué desea hacer?",
                "Seguir Cargando 🔄",
                "Cargar otra habitación 🏠",
                "Salir 🚪"
            ).then(boton => {
                if (boton === "Cargar otra habitación 🏠") {
                    const nombresHuespedes = datosHuespedes.map(h => 
                        `${h.apellido} ${h.nombres} (${h.tipoDocumento}: ${h.numeroDocumento})`
                    ).join('<br>');
                    
                    mensajeCorrecto(`Ya cargaste la habitación: ${habitacionesSeleccionadas[0].habitacion}<br><br>Huéspedes cargados:<br>${nombresHuespedes}<br><br>PORFAVOR, PRESIONE CUALQUIER TECLA PARA CONTINUAR`);
                    
                    window.addEventListener('keydown', () => {
                        location.reload();
                    }, { once: true });
                } else if (boton === "Salir 🚪") {
                    location.reload();
                }
                // Si es "Seguir Cargando", no hacer nada, permitir seguir
            });
        });
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusquedaHuesped);
} else {
    inicializarBusquedaHuesped();
}
