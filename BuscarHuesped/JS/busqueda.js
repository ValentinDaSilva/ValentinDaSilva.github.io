


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
    
    GestorHuesped.buscarHuespedes();
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

