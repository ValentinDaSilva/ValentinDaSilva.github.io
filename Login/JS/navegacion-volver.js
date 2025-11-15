


function guardarPaginaEnHistorial() {
    const rutaActual = window.location.pathname;
    const nombreArchivo = rutaActual.split('/').pop() || '';
    
    
    const esPaginaLogin = rutaActual.includes('Login/login.html') || 
                         rutaActual.includes('login.html') ||
                         nombreArchivo === 'login.html';
    const esIndex = nombreArchivo === 'index.html' || 
                   (nombreArchivo === '' && rutaActual.endsWith('/')) ||
                   rutaActual === '/' || rutaActual === '';
    
    if (!esPaginaLogin && !esIndex) {
        const urlCompleta = window.location.pathname + window.location.search + window.location.hash;
        
        
        let historial = [];
        try {
            const historialStr = sessionStorage.getItem('historialNavegacion');
            if (historialStr) {
                historial = JSON.parse(historialStr);
            }
        } catch (error) {
            historial = [];
        }
        
        
        if (historial.length === 0 || historial[historial.length - 1] !== urlCompleta) {
            
            historial.push(urlCompleta);
            if (historial.length > 10) {
                historial.shift(); 
            }
            
            
            sessionStorage.setItem('historialNavegacion', JSON.stringify(historial));
        }
    }
}


function obtenerPenultimaPaginaHistorial() {
    try {
        const historialStr = sessionStorage.getItem('historialNavegacion');
        if (!historialStr) return null;
        
        const historial = JSON.parse(historialStr);
        if (historial.length < 2) return null; 
        
        const urlActual = window.location.pathname + window.location.search + window.location.hash;
        
        
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


function volverPaginaAnterior() {
    
    const referrer = document.referrer;
    const vieneDelLogin = referrer && (
        referrer.includes('Login/login.html') || 
        referrer.includes('/Login/') ||
        referrer.includes('login.html')
    );
    
    if (vieneDelLogin) {
        
        
        let urlAnterior = null;
        try {
            urlAnterior = sessionStorage.getItem('urlAntesDelLogin');
        } catch (error) {
            console.error('Error al obtener urlAntesDelLogin:', error);
        }
        
        
        if (!urlAnterior) {
            urlAnterior = obtenerUrlAnterior();
        }
        
        if (urlAnterior && !urlAnterior.includes('Login/login.html') && !urlAnterior.includes('login.html')) {
            
            console.log('Volviendo a URL anterior (antes del login):', urlAnterior);
            
            sessionStorage.removeItem('urlAntesDelLogin');
            eliminarUrlAnterior();
            window.location.href = urlAnterior;
            return;
        }
        
        
        const penultimaPagina = obtenerPenultimaPaginaHistorial();
        if (penultimaPagina && !penultimaPagina.includes('Login/login.html') && !penultimaPagina.includes('login.html')) {
            console.log('Volviendo a penúltima página del historial:', penultimaPagina);
            window.location.href = penultimaPagina;
            return;
        }
        
        
        const rutaIndex = determinarRutaIndex();
        console.log('No hay URL anterior, yendo al index:', rutaIndex);
        window.location.href = rutaIndex;
        return;
    }
    
    
    
    if (window.history.length > 1) {
        window.history.back();
    } else {
        
        const rutaIndex = determinarRutaIndex();
        window.location.href = rutaIndex;
    }
}


function obtenerUrlAnterior() {
    try {
        return sessionStorage.getItem('urlAnterior');
    } catch (error) {
        console.error('Error al obtener URL anterior:', error);
        return null;
    }
}


function eliminarUrlAnterior() {
    try {
        sessionStorage.removeItem('urlAnterior');
    } catch (error) {
        console.error('Error al eliminar URL anterior:', error);
    }
}


function determinarRutaIndex() {
    const rutaActual = window.location.pathname;
    
    
    const partes = rutaActual.split('/').filter(p => p);
    
    
    if (partes.length > 0 && partes[partes.length - 1].endsWith('.html')) {
        partes.pop();
    }
    
    
    if (partes.length === 0) {
        return 'index.html';
    }
    
    
    const nivelesSubida = partes.length;
    return '../'.repeat(nivelesSubida) + 'index.html';
}


function inicializarGuardadoHistorial() {
    
    guardarPaginaEnHistorial();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarGuardadoHistorial);
} else {
    inicializarGuardadoHistorial();
}

