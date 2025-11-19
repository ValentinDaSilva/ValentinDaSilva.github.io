


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
    
    
    if (window.gestorHuesped) {
        await window.gestorHuesped.buscarHuespedes();
    } else if (window.gestorBuscarHuesped) {
        await window.gestorBuscarHuesped.procesarBusqueda();
    } else {
        console.error('El gestor de búsqueda de huéspedes no está disponible');
        mensajeError('Error al procesar la búsqueda. Por favor, recarga la página.');
        }
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

