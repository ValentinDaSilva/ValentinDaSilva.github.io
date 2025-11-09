/* Funciones para manejar la navegación "Volver" ignorando el login */

/**
 * Guarda la página actual en el historial (excepto si es login o index)
 * Esta función se llama cuando se carga una página para mantener un historial
 */
function guardarPaginaEnHistorial() {
    const rutaActual = window.location.pathname;
    const nombreArchivo = rutaActual.split('/').pop() || '';
    
    // No guardar si es login o index
    const esPaginaLogin = rutaActual.includes('Login/login.html') || 
                         rutaActual.includes('login.html') ||
                         nombreArchivo === 'login.html';
    const esIndex = nombreArchivo === 'index.html' || 
                   (nombreArchivo === '' && rutaActual.endsWith('/')) ||
                   rutaActual === '/' || rutaActual === '';
    
    if (!esPaginaLogin && !esIndex) {
        const urlCompleta = window.location.pathname + window.location.search + window.location.hash;
        
        // Obtener historial actual
        let historial = [];
        try {
            const historialStr = sessionStorage.getItem('historialNavegacion');
            if (historialStr) {
                historial = JSON.parse(historialStr);
            }
        } catch (error) {
            historial = [];
        }
        
        // Evitar duplicados consecutivos
        if (historial.length === 0 || historial[historial.length - 1] !== urlCompleta) {
            // Agregar la página actual al historial (máximo 10 páginas)
            historial.push(urlCompleta);
            if (historial.length > 10) {
                historial.shift(); // Eliminar la más antigua
            }
            
            // Guardar historial
            sessionStorage.setItem('historialNavegacion', JSON.stringify(historial));
        }
    }
}

/**
 * Obtiene la penúltima página del historial (ignorando la actual y login)
 * @returns {string|null} - URL de la penúltima página o null si no existe
 */
function obtenerPenultimaPaginaHistorial() {
    try {
        const historialStr = sessionStorage.getItem('historialNavegacion');
        if (!historialStr) return null;
        
        const historial = JSON.parse(historialStr);
        if (historial.length < 2) return null; // Necesitamos al menos 2 páginas
        
        const urlActual = window.location.pathname + window.location.search + window.location.hash;
        
        // Buscar desde el final, ignorando la página actual y login
        for (let i = historial.length - 2; i >= 0; i--) {
            const url = historial[i];
            if (url !== urlActual && 
                !url.includes('Login/login.html') && 
                !url.includes('login.html')) {
                return url;
            }
        }
        
        return null;
    } catch (error) {
        console.error('Error al obtener historial:', error);
        return null;
    }
}

/**
 * Función inteligente para volver que ignora el login en el historial
 * Si la página anterior era login, va a la URL guardada antes del login o al index
 * Si no, usa history.back() normalmente
 */
function volverPaginaAnterior() {
    // Verificar si venimos del login usando document.referrer
    const referrer = document.referrer;
    const vieneDelLogin = referrer && (
        referrer.includes('Login/login.html') || 
        referrer.includes('/Login/') ||
        referrer.includes('login.html')
    );
    
    if (vieneDelLogin) {
        // Si venimos del login, intentar usar la URL guardada antes del login
        // Primero intentar urlAntesDelLogin (guardada después del login)
        let urlAnterior = null;
        try {
            urlAnterior = sessionStorage.getItem('urlAntesDelLogin');
        } catch (error) {
            console.error('Error al obtener urlAntesDelLogin:', error);
        }
        
        // Si no existe, intentar urlAnterior (guardada antes del login)
        if (!urlAnterior) {
            urlAnterior = obtenerUrlAnterior();
        }
        
        if (urlAnterior && !urlAnterior.includes('Login/login.html') && !urlAnterior.includes('login.html')) {
            // Si hay una URL anterior guardada y no es login, usarla
            console.log('Volviendo a URL anterior (antes del login):', urlAnterior);
            // Eliminar las URLs guardadas después de usarlas
            sessionStorage.removeItem('urlAntesDelLogin');
            eliminarUrlAnterior();
            window.location.href = urlAnterior;
            return;
        }
        
        // Intentar obtener la penúltima página del historial (ignorando la actual)
        const penultimaPagina = obtenerPenultimaPaginaHistorial();
        if (penultimaPagina && !penultimaPagina.includes('Login/login.html') && !penultimaPagina.includes('login.html')) {
            console.log('Volviendo a penúltima página del historial:', penultimaPagina);
            window.location.href = penultimaPagina;
            return;
        }
        
        // Si no hay URL anterior ni en historial, ir al index
        const rutaIndex = determinarRutaIndex();
        console.log('No hay URL anterior, yendo al index:', rutaIndex);
        window.location.href = rutaIndex;
        return;
    }
    
    // Si no venimos del login, usar el historial normal
    // Pero primero verificar si podemos usar history.back() de forma segura
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // Si no hay historial, ir al index
        const rutaIndex = determinarRutaIndex();
        window.location.href = rutaIndex;
    }
}

/**
 * Obtiene la URL anterior guardada (función auxiliar para compatibilidad)
 * @returns {string|null} - URL anterior o null si no existe
 */
function obtenerUrlAnterior() {
    try {
        return sessionStorage.getItem('urlAnterior');
    } catch (error) {
        console.error('Error al obtener URL anterior:', error);
        return null;
    }
}

/**
 * Elimina la URL anterior guardada (función auxiliar para compatibilidad)
 */
function eliminarUrlAnterior() {
    try {
        sessionStorage.removeItem('urlAnterior');
    } catch (error) {
        console.error('Error al eliminar URL anterior:', error);
    }
}

/**
 * Determina la ruta relativa al index según la ubicación actual
 * @returns {string} - Ruta relativa al index
 */
function determinarRutaIndex() {
    const rutaActual = window.location.pathname;
    
    // Obtener las partes de la ruta
    const partes = rutaActual.split('/').filter(p => p);
    
    // Si hay un archivo HTML al final, quitarlo para contar solo las carpetas
    if (partes.length > 0 && partes[partes.length - 1].endsWith('.html')) {
        partes.pop();
    }
    
    // Si estamos en la raíz
    if (partes.length === 0) {
        return 'index.html';
    }
    
    // Si estamos en una subcarpeta, calcular cuántos niveles subir
    const nivelesSubida = partes.length;
    return '../'.repeat(nivelesSubida) + 'index.html';
}

/**
 * Inicializa el guardado de páginas en el historial
 */
function inicializarGuardadoHistorial() {
    // Guardar la página actual cuando se carga
    guardarPaginaEnHistorial();
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGuardadoHistorial);
} else {
    inicializarGuardadoHistorial();
}

