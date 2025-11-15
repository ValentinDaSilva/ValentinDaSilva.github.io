


function mostrarResultados() {
    const contenedorResultados = document.querySelector('.contenedor-resultados');
    const contenedorPrincipal = document.querySelector('.contenedor-principal');
    
    if (contenedorResultados && contenedorPrincipal) {
        contenedorPrincipal.style.width = '40vw';
        contenedorResultados.style.display = 'block';
    }
}


async function manejarBusqueda(event) {
    event.preventDefault(); 
    
    
    const todosLosCamposValidos = validarTodosLosCampos();
    
    if (!todosLosCamposValidos) {
        
        const primerError = document.querySelector('.campo-invalido');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerError.focus();
        }
        return;
    }
    
    
    if (datosHuespedes.length === 0) {
        await cargarHuespedes();
        if (datosHuespedes.length === 0) {
            mensajeError('No se pudieron cargar los datos. Por favor, recarga la página.');
            return;
        }
    }
    
    
    const apellido = document.getElementById('apellido').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value.trim();
    
    
    const resultados = filtrarHuespedes(apellido, nombres, tipoDocumento, numeroDocumento);
    
    
    if (typeof renderizarResultados === 'function') {
        renderizarResultados(resultados);
    } else {
        console.error('La función renderizarResultados no está disponible');
    }
    
    
    mostrarResultados();
    
    
    setTimeout(() => {
        if (typeof inicializarTablaResultados === 'function') {
            inicializarTablaResultados();
        } else {
            console.error('La función inicializarTablaResultados no está disponible');
        }
    }, 200);
}


function inicializarBusqueda() {
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', manejarBusqueda);
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusqueda);
} else {
    inicializarBusqueda();
}

