

let filasTabla = [];
let datosResultados = [];


function obtenerFilasTabla() {
    const tbody = document.querySelector(".tabla-resultados tbody");
    if (!tbody) {
        return [];
    }
    const todasLasFilas = tbody.querySelectorAll("tr");
    return Array.from(todasLasFilas);
}


function inicializarSeleccionFilas() {
    
    filasTabla = [];
    
    
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
    
    
    const filasArray = Array.from(filas);
    
    filasArray.forEach((fila) => {
        
        
        const manejarClick = function(e) {
            e.stopPropagation();
            
            
            filasTabla.forEach((r) => {
                if (r !== fila) {
                    r.classList.remove('fila-seleccionada');
                    r.style.backgroundColor = "";
                }
            });
            
            
            if (fila.classList.contains('fila-seleccionada')) {
                fila.classList.remove('fila-seleccionada');
                fila.style.backgroundColor = "";
            } else {
                fila.classList.add('fila-seleccionada');
                fila.style.backgroundColor = "yellow";
            }
        };
        
        
        fila.addEventListener("click", manejarClick);
        
        
        filasTabla.push(fila);
    });
    
    console.log(`Se inicializaron ${filasTabla.length} filas`);
}


function obtenerFilaSeleccionada() {
    return filasTabla.find(fila => fila.classList.contains('fila-seleccionada')) || null;
}


function guardarHuespedEnSessionStorage(huesped) {
    try {
        sessionStorage.setItem('huespedSeleccionado', JSON.stringify(huesped));
        console.log('Huésped guardado en sessionStorage:', huesped);
    } catch (error) {
        console.error('Error al guardar en sessionStorage:', error);
        mensajeError('Error al guardar los datos del huésped. Por favor, intente nuevamente.');
    }
}


function manejarBotonSiguiente() {
    const filaSeleccionada = obtenerFilaSeleccionada();
    
    if (filaSeleccionada) {
        
        const datosHuesped = obtenerDatosHuespedSeleccionado();
        
        if (datosHuesped) {
            
            guardarHuespedEnSessionStorage(datosHuesped);
            
            
            window.location.href = '../ModificarHuesped/modificarHuesped.html';
        } else {
            console.error('No se pudieron obtener los datos del huésped seleccionado');
            mensajeError('Error al obtener los datos del huésped. Por favor, seleccione nuevamente.');
        }
    } else {
        
        window.location.href = '../AltaHuesped/altaHuesped.html';
    }
}


function inicializarBotonSiguiente() {
    const botonSiguiente = document.querySelector('.boton-siguiente');
    if (botonSiguiente) {
        botonSiguiente.addEventListener('click', manejarBotonSiguiente);
    }
}


function inicializarTablaResultados() {
    console.log('Inicializando tabla de resultados...');
    
    
    const tabla = document.querySelector('.tabla-resultados');
    if (!tabla) {
        console.error('No se encontró la tabla de resultados');
        return;
    }
    
    
    inicializarSeleccionFilas();
    inicializarBotonSiguiente();
    
    console.log('Tabla de resultados inicializada correctamente');
}


function renderizarResultados(resultados) {
    datosResultados = resultados;
    
    const tbody = document.querySelector(".tabla-resultados tbody");
    if (!tbody) {
        console.error('No se encontró el tbody de la tabla');
        return;
    }
    
    
    tbody.innerHTML = '';
    
    
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
    
    
    resultados.forEach(huesped => {
        const fila = document.createElement('tr');
        
        
        const celdaApellido = document.createElement('td');
        celdaApellido.textContent = huesped.apellido;
        
        
        const celdanombre = document.createElement('td');
        celdanombre.textContent = huesped.nombre;
        
        
        const celdaTipoDoc = document.createElement('td');
        celdaTipoDoc.textContent = huesped.tipoDocumento;
        
        
        const celdaNumDoc = document.createElement('td');
        celdaNumDoc.textContent = huesped.numeroDocumento;
        
        
        fila.appendChild(celdaApellido);
        fila.appendChild(celdanombre);
        fila.appendChild(celdaTipoDoc);
        fila.appendChild(celdaNumDoc);
        
        
        fila.setAttribute('data-huesped', JSON.stringify(huesped));
        
        
        tbody.appendChild(fila);
    });
    
    console.log(`Se renderizaron ${resultados.length} resultados`);
}


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


window.inicializarTablaResultados = inicializarTablaResultados;
window.renderizarResultados = renderizarResultados;
window.obtenerDatosHuespedSeleccionado = obtenerDatosHuespedSeleccionado;



