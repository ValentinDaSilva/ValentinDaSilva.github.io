/* Manejo del formulario de búsqueda y visualización de resultados */

/**
 * Muestra los resultados de la búsqueda
 */
function mostrarResultados() {
    const contenedorResultados = document.querySelector('.contenedor-resultados');
    const contenedorPrincipal = document.querySelector('.contenedor-principal');
    
    if (contenedorResultados && contenedorPrincipal) {
        contenedorPrincipal.style.width = '40vw';
        contenedorResultados.style.display = 'block';
    }
}

/**
 * Maneja el evento de envío del formulario de búsqueda
 * @param {Event} event - Evento del formulario
 */
async function manejarBusqueda(event) {
    event.preventDefault(); // Evita que el formulario se envíe de forma tradicional
    
    // Validar campos
    const todosLosCamposValidos = validarTodosLosCampos();
    
    if (!todosLosCamposValidos) {
        // Hacer scroll al primer campo con error
        const primerError = document.querySelector('.campo-invalido');
        if (primerError) {
            primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primerError.focus();
        }
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
    
    // Obtener valores del formulario
    const apellido = document.getElementById('apellido').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value.trim();
    
    // Filtrar huéspedes según los criterios de búsqueda
    const resultados = filtrarHuespedes(apellido, nombres, tipoDocumento, numeroDocumento);
    
    // Mostrar los resultados en la tabla
    if (typeof renderizarResultados === 'function') {
        renderizarResultados(resultados);
    } else {
        console.error('La función renderizarResultados no está disponible');
    }
    
    // Mostrar el contenedor de resultados
    mostrarResultados();
    
    // Reinicializar la tabla de resultados después de renderizar
    setTimeout(() => {
        if (typeof inicializarTablaResultados === 'function') {
            inicializarTablaResultados();
        } else {
            console.error('La función inicializarTablaResultados no está disponible');
        }
    }, 200);
}

/**
 * Inicializa el event listener del formulario
 */
function inicializarBusqueda() {
    const formulario = document.querySelector('form');
    if (formulario) {
        formulario.addEventListener('submit', manejarBusqueda);
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarBusqueda);
} else {
    inicializarBusqueda();
}

