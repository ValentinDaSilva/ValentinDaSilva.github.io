

let huespedesSeleccionados = [];


function renderizarResultadosHuespedes(resultados) {
    const tbody = document.querySelector('.resultadoBusqueda tbody');
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
        
        
        const celdaNombres = document.createElement('td');
        celdaNombres.textContent = huesped.nombres;
        
        
        const celdaTipoDoc = document.createElement('td');
        celdaTipoDoc.textContent = huesped.tipoDocumento;
        
        
        const celdaNumDoc = document.createElement('td');
        celdaNumDoc.textContent = huesped.numeroDocumento;
        
        
        fila.appendChild(celdaApellido);
        fila.appendChild(celdaNombres);
        fila.appendChild(celdaTipoDoc);
        fila.appendChild(celdaNumDoc);
        
        
        fila.setAttribute('data-huesped', JSON.stringify(huesped));
        
        
        tbody.appendChild(fila);
    });
    
    console.log(`Se renderizaron ${resultados.length} resultados`);
}


function inicializarSeleccionHuespedes() {
    huespedesSeleccionados = [];
    
    const filasHuespedes = document.querySelectorAll('.resultadoBusqueda tbody tr');
    filasHuespedes.forEach(fila => {
        
        const nuevaFila = fila.cloneNode(true);
        fila.parentNode.replaceChild(nuevaFila, fila);
        
        nuevaFila.addEventListener('click', () => {
            const indice = huespedesSeleccionados.indexOf(nuevaFila);
            if (indice === -1) {
                
                huespedesSeleccionados.push(nuevaFila);
                nuevaFila.style.backgroundColor = 'yellow';
                nuevaFila.style.color = 'black';
            } else {
                
                huespedesSeleccionados.splice(indice, 1);
                nuevaFila.style.backgroundColor = '';
                nuevaFila.style.color = '';
            }
        });
    });
}


function obtenerDatosHuespedesSeleccionados() {
    return huespedesSeleccionados.map(fila => {
        const datosHuesped = fila.getAttribute('data-huesped');
        if (datosHuesped) {
            return JSON.parse(datosHuesped);
        }
        return null;
    }).filter(huesped => huesped !== null);
}


async function inicializarBusquedaHuesped() {
    const formBuscar = document.querySelector('.container form');
    const resultadoDiv = document.querySelector('.resultadoBusqueda');
    
    if (!formBuscar || !resultadoDiv) {
        console.error('Elementos de búsqueda de huésped no encontrados');
        return;
    }

    
    if (datosHuespedes.length === 0) {
        await cargarHuespedes();
        if (datosHuespedes.length === 0) {
            mensajeError('No se pudieron cargar los datos. Por favor, recarga la página.');
            return;
        }
    }

    formBuscar.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        
        const apellido = document.getElementById('apellido').value.trim();
        const nombres = document.getElementById('nombres').value.trim();
        const tipoDocumento = document.getElementById('tipoDocumento').value;
        const numeroDocumento = document.getElementById('numeroDocumento').value.trim();
        
        
        const resultados = filtrarHuespedes(apellido, nombres, tipoDocumento, numeroDocumento);
        
        
        renderizarResultadosHuespedes(resultados);
        
        
        resultadoDiv.style.display = 'block';
        
        setTimeout(() => {
            resultadoDiv.style.top = '50px';
        }, 10);
        
        
        setTimeout(() => {
            inicializarSeleccionHuespedes();
        }, 100);
    });

    const siguienteBusquedaButton = document.querySelector('.siguienteBusqueda');
    if (siguienteBusquedaButton) {
        siguienteBusquedaButton.addEventListener('click', function() {
            const datosHuespedes = obtenerDatosHuespedesSeleccionados();
            
            
            const container = document.querySelector('.container');
            const titulo = container ? container.querySelector('h1') : null;
            const esTitular = titulo && titulo.textContent.includes('Titular');
            
            if (esTitular) {
                
                if (datosHuespedes.length === 0) {
                    mensajeError("Por favor, seleccione un huésped como titular.");
                    return;
                }
                
                if (datosHuespedes.length > 1) {
                    mensajeError("Por favor, seleccione solo un huésped como titular.");
                    return;
                }
                
                
                const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
                if (resultadoBusqueda) {
                    resultadoBusqueda.style.display = 'none';
                }
                
                
                if (typeof window.manejarSeleccionTitular === 'function') {
                    window.manejarSeleccionTitular(datosHuespedes[0]);
                } else {
                    console.error('Función manejarSeleccionTitular no está disponible');
                    mensajeError("Error: No se pudo procesar la selección del titular.");
                }
            } else {
                
                
                const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
                if (resultadoBusqueda) {
                    resultadoBusqueda.style.display = 'none';
                }
                
                
                
                if (typeof window.manejarSeleccionAcompaniantes === 'function') {
                    window.manejarSeleccionAcompaniantes(datosHuespedes.length > 0 ? datosHuespedes : []);
                } else {
                    console.error('Función manejarSeleccionAcompaniantes no está disponible');
                    mensajeError("Error: No se pudo procesar la selección de acompañantes.");
                }
            }
        });
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusquedaHuesped);
} else {
    inicializarBusquedaHuesped();
}
