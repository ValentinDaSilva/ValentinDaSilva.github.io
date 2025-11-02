/* Manejo de la tabla de resultados y selección de filas */

let filasTabla = [];
let datosResultados = [];

/**
 * Obtiene todas las filas de la tabla (excluyendo el header)
 * @returns {Array} - Array de elementos tr
 */
function obtenerFilasTabla() {
    const tbody = document.querySelector(".tabla-resultados tbody");
    if (!tbody) {
        return [];
    }
    const todasLasFilas = tbody.querySelectorAll("tr");
    return Array.from(todasLasFilas);
}

/**
 * Inicializa los event listeners para la selección de filas
 */
function inicializarSeleccionFilas() {
    // Limpiar el array anterior
    filasTabla = [];
    
    // Obtener las filas actuales del tbody
    const tbody = document.querySelector(".tabla-resultados tbody");
    if (!tbody) {
        console.warn('No se encontró el tbody de la tabla');
        return;
    }
    
    const filas = tbody.querySelectorAll("tr");
    
    if (filas.length === 0) {
        console.warn('No se encontraron filas en la tabla');
        return;
    }
    
    // Convertir NodeList a Array
    const filasArray = Array.from(filas);
    
    filasArray.forEach((fila) => {
        // Remover cualquier event listener anterior usando removeEventListener
        // Para esto, usamos una función nombrada en lugar de anónima
        const manejarClick = function(e) {
            e.stopPropagation();
            
            // Remover selección de todas las filas
            filasTabla.forEach((r) => {
                if (r !== fila) {
                    r.classList.remove('fila-seleccionada');
                    r.style.backgroundColor = "";
                }
            });
            
            // Alternar selección de la fila actual
            if (fila.classList.contains('fila-seleccionada')) {
                fila.classList.remove('fila-seleccionada');
                fila.style.backgroundColor = "";
            } else {
                fila.classList.add('fila-seleccionada');
                fila.style.backgroundColor = "yellow";
            }
        };
        
        // Agregar el event listener
        fila.addEventListener("click", manejarClick);
        
        // Agregar la fila al array
        filasTabla.push(fila);
    });
    
    console.log(`Se inicializaron ${filasTabla.length} filas`);
}

/**
 * Obtiene la fila seleccionada
 * @returns {HTMLElement|null} - La fila seleccionada o null
 */
function obtenerFilaSeleccionada() {
    return filasTabla.find(fila => fila.classList.contains('fila-seleccionada')) || null;
}

/**
 * Guarda los datos del huésped en sessionStorage
 * @param {Object} huesped - Objeto con los datos del huésped
 */
function guardarHuespedEnSessionStorage(huesped) {
    try {
        sessionStorage.setItem('huespedSeleccionado', JSON.stringify(huesped));
        console.log('Huésped guardado en sessionStorage:', huesped);
    } catch (error) {
        console.error('Error al guardar en sessionStorage:', error);
        mensajeError('Error al guardar los datos del huésped. Por favor, intente nuevamente.');
    }
}

/**
 * Maneja el evento de clic en el botón "Siguiente"
 */
function manejarBotonSiguiente() {
    const filaSeleccionada = obtenerFilaSeleccionada();
    
    if (filaSeleccionada) {
        // Obtener los datos del huésped seleccionado
        const datosHuesped = obtenerDatosHuespedSeleccionado();
        
        if (datosHuesped) {
            // Guardar en sessionStorage antes de redirigir
            guardarHuespedEnSessionStorage(datosHuesped);
            
            // Redirigir a modificarHuesped.html
            window.location.href = '../ModificarHuesped/modificarHuesped.html';
        } else {
            console.error('No se pudieron obtener los datos del huésped seleccionado');
            mensajeError('Error al obtener los datos del huésped. Por favor, seleccione nuevamente.');
        }
    } else {
        // Si no hay fila seleccionada, redirigir a altaHuesped.html
        window.location.href = '../AltaHuesped/altaHuesped.html';
    }
}

/**
 * Inicializa el botón "Siguiente"
 */
function inicializarBotonSiguiente() {
    const botonSiguiente = document.querySelector('.boton-siguiente');
    if (botonSiguiente) {
        botonSiguiente.addEventListener('click', manejarBotonSiguiente);
    }
}

/**
 * Inicializa toda la funcionalidad de la tabla
 */
function inicializarTablaResultados() {
    console.log('Inicializando tabla de resultados...');
    
    // Verificar que la tabla exista
    const tabla = document.querySelector('.tabla-resultados');
    if (!tabla) {
        console.error('No se encontró la tabla de resultados');
        return;
    }
    
    // Reinicializar
    inicializarSeleccionFilas();
    inicializarBotonSiguiente();
    
    console.log('Tabla de resultados inicializada correctamente');
}

/**
 * Renderiza los resultados de la búsqueda en la tabla
 * @param {Array} resultados - Array de huéspedes a mostrar
 */
function renderizarResultados(resultados) {
    datosResultados = resultados;
    
    const tbody = document.querySelector(".tabla-resultados tbody");
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
 * Obtiene los datos del huésped seleccionado
 * @returns {Object|null} - Datos del huésped seleccionado o null
 */
function obtenerDatosHuespedSeleccionado() {
    const filaSeleccionada = obtenerFilaSeleccionada();
    if (!filaSeleccionada) {
        return null;
    }
    
    const datosHuesped = filaSeleccionada.getAttribute('data-huesped');
    if (datosHuesped) {
        return JSON.parse(datosHuesped);
    }
    
    return null;
}

// Exportar funciones para uso en otros módulos
window.inicializarTablaResultados = inicializarTablaResultados;
window.renderizarResultados = renderizarResultados;
window.obtenerDatosHuespedSeleccionado = obtenerDatosHuespedSeleccionado;

// No inicializar automáticamente aquí porque la tabla está oculta al principio

