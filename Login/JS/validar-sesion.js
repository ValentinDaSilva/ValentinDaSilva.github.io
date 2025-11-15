


function obtenerSesionActiva() {
    try {
        const sesionStr = localStorage.getItem('sesionActiva');
        if (!sesionStr) {
            return null;
        }
        return JSON.parse(sesionStr);
    } catch (error) {
        console.error('Error al obtener sesión activa:', error);
        return null;
    }
}


function existeSesionActiva() {
    const sesion = obtenerSesionActiva();
    return sesion !== null;
}


function obtenerUsuarioAutenticado() {
    return obtenerSesionActiva();
}


function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    console.log('Sesión cerrada');
}


function guardarUrlAnterior() {
    
    const urlCompleta = window.location.pathname + window.location.search + window.location.hash;
    sessionStorage.setItem('urlAnterior', urlCompleta);
    console.log('URL anterior guardada:', urlCompleta);
}


function obtenerUrlAnterior() {
    return sessionStorage.getItem('urlAnterior');
}


function eliminarUrlAnterior() {
    sessionStorage.removeItem('urlAnterior');
}


function validarSesion() {
    
    const rutaActual = window.location.pathname;
    const nombreArchivo = rutaActual.split('/').pop() || '';
    const esPaginaLogin = rutaActual.includes('Login/login.html') || 
                         rutaActual.includes('login.html') ||
                         nombreArchivo === 'login.html';
    const esIndex = nombreArchivo === 'index.html' || 
                   nombreArchivo === '' || 
                   rutaActual.endsWith('/');
    
    if (esPaginaLogin || esIndex) {
        
        return;
    }
    
    
    if (!existeSesionActiva()) {
        console.warn('No hay sesión activa. Redirigiendo al login...');
        
        guardarUrlAnterior();
        
        const rutaLogin = determinarRutaLogin();
        window.location.href = rutaLogin;
        return false;
    }
    
    
    const sesion = obtenerSesionActiva();
    console.log('Sesión activa válida:', sesion);
    return true;
}


function determinarRutaLogin() {
    const rutaActual = window.location.pathname;
    
    
    const partes = rutaActual.split('/').filter(p => p);
    
    
    if (partes.length > 0 && partes[partes.length - 1].endsWith('.html')) {
        partes.pop();
    }
    
    
    if (partes.length === 0 || (partes.length === 1 && partes[0] === '')) {
        return 'Login/login.html';
    }
    
    
    
    
    const nivelesSubida = partes.length;
    return '../'.repeat(nivelesSubida) + 'Login/login.html';
}


function inicializarValidacionSesion() {
    
    validarSesion();
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionSesion);
} else {
    inicializarValidacionSesion();
}

