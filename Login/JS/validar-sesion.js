/* Validación de sesión - Verifica si el usuario está autenticado */

/**
 * Obtiene la sesión activa del localStorage
 * @returns {Object|null} - Objeto con la información de la sesión o null si no existe
 */
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

/**
 * Verifica si existe una sesión activa
 * @returns {boolean} - true si existe una sesión activa, false en caso contrario
 */
function existeSesionActiva() {
    const sesion = obtenerSesionActiva();
    return sesion !== null;
}

/**
 * Obtiene la información del usuario autenticado
 * @returns {Object|null} - Objeto con información del usuario o null si no está autenticado
 */
function obtenerUsuarioAutenticado() {
    return obtenerSesionActiva();
}

/**
 * Cierra la sesión del usuario
 */
function cerrarSesion() {
    localStorage.removeItem('sesionActiva');
    console.log('Sesión cerrada');
}

/**
 * Guarda la URL anterior en sessionStorage para redirigir después del login
 * Estas funciones están aquí para uso en páginas protegidas que no cargan utilidades.js
 * Si utilidades.js ya las define, estas funciones las sobrescribirán (mismo comportamiento)
 */
function guardarUrlAnterior() {
    // Guardar la URL completa incluyendo pathname, search y hash
    const urlCompleta = window.location.pathname + window.location.search + window.location.hash;
    sessionStorage.setItem('urlAnterior', urlCompleta);
    console.log('URL anterior guardada:', urlCompleta);
}

/**
 * Obtiene la URL anterior guardada
 * @returns {string|null} - URL anterior o null si no existe
 */
function obtenerUrlAnterior() {
    return sessionStorage.getItem('urlAnterior');
}

/**
 * Elimina la URL anterior guardada
 */
function eliminarUrlAnterior() {
    sessionStorage.removeItem('urlAnterior');
}

/**
 * Valida la sesión y redirige al login si no existe
 * Esta función se ejecuta automáticamente cuando se carga el script
 */
function validarSesion() {
    // Verificar si estamos en la página de login o index (no validar sesión allí)
    const rutaActual = window.location.pathname;
    const nombreArchivo = rutaActual.split('/').pop() || '';
    const esPaginaLogin = rutaActual.includes('Login/login.html') || 
                         rutaActual.includes('login.html') ||
                         nombreArchivo === 'login.html';
    const esIndex = nombreArchivo === 'index.html' || 
                   nombreArchivo === '' || 
                   rutaActual.endsWith('/');
    
    if (esPaginaLogin || esIndex) {
        // No validar sesión en login o index
        return;
    }
    
    // Verificar si existe una sesión activa
    if (!existeSesionActiva()) {
        console.warn('No hay sesión activa. Redirigiendo al login...');
        // Guardar la URL actual para redirigir después del login
        guardarUrlAnterior();
        // Redirigir al login
        const rutaLogin = determinarRutaLogin();
        window.location.href = rutaLogin;
        return false;
    }
    
    // Sesión válida
    const sesion = obtenerSesionActiva();
    console.log('Sesión activa válida:', sesion);
    return true;
}

/**
 * Determina la ruta relativa al login según la ubicación actual
 * @returns {string} - Ruta relativa al login
 */
function determinarRutaLogin() {
    const rutaActual = window.location.pathname;
    
    // Obtener las partes de la ruta
    const partes = rutaActual.split('/').filter(p => p);
    
    // Si hay un archivo HTML al final, quitarlo para contar solo las carpetas
    if (partes.length > 0 && partes[partes.length - 1].endsWith('.html')) {
        partes.pop();
    }
    
    // Si estamos en la raíz (solo index.html o raíz)
    if (partes.length === 0 || (partes.length === 1 && partes[0] === '')) {
        return 'Login/login.html';
    }
    
    // Si estamos en una subcarpeta, calcular cuántos niveles subir
    // Ejemplo: /AltaHuesped/altaHuesped.html -> 1 nivel -> ../Login/login.html
    // Ejemplo: /RealizarReserva/realizarReserva.html -> 1 nivel -> ../Login/login.html
    const nivelesSubida = partes.length;
    return '../'.repeat(nivelesSubida) + 'Login/login.html';
}

/**
 * Inicializa la validación de sesión cuando se carga la página
 */
function inicializarValidacionSesion() {
    // Ejecutar validación inmediatamente
    validarSesion();
}

// Ejecutar validación cuando el DOM esté listo o inmediatamente si ya está listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarValidacionSesion);
} else {
    inicializarValidacionSesion();
}

