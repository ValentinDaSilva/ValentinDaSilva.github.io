/* Lógica de autenticación de usuario */

/**
 * Autentica un usuario con nombre y contraseña usando datos del JSON
 * @param {string} nombreUsuario - Nombre de usuario
 * @param {string} contraseña - Contraseña del usuario
 * @returns {Promise<Object|null>} - Objeto usuario si las credenciales son válidas, null en caso contrario
 */
async function autenticarUsuario(nombreUsuario, contraseña) {
    // Asegurar que los usuarios estén cargados
    if (!datosUsuarios || datosUsuarios.length === 0) {
        await cargarUsuarios();
    }
    
    // Validar usuario con los datos cargados
    return validarUsuario(nombreUsuario, contraseña);
}

/**
 * Guarda la información de la sesión en localStorage
 * @param {Object} usuario - Objeto usuario con información de la sesión
 */
function guardarSesion(usuario) {
    const sesion = {
        usuario: usuario.usuario,
        fechaInicio: new Date().toISOString()
    };
    localStorage.setItem('sesionActiva', JSON.stringify(sesion));
    console.log('Sesión guardada en localStorage:', sesion);
}

/**
 * Procesa el intento de autenticación
 * @param {string} nombreUsuario - Nombre de usuario
 * @param {string} contraseña - Contraseña del usuario
 */
async function procesarAutenticacion(nombreUsuario, contraseña) {
    try {
        const usuario = await autenticarUsuario(nombreUsuario, contraseña);
        if (usuario) {
            console.log(`Usuario autenticado: ${usuario.usuario}`);
            // Guardar sesión en localStorage
            guardarSesion(usuario);
            mostrarModalExito();
        } else {
            mostrarModalError('El usuario o la contraseña no son válidos');
        }
    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        mostrarModalError('Error al procesar la autenticación. Por favor, intenta nuevamente.');
    }
}

/**
 * Inicializa el formulario de login
 */
function inicializarFormularioLogin() {
    const formularioLogin = document.getElementById('formulario-login');
    if (!formularioLogin) return;
    
    formularioLogin.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const campoNombreUsuario = document.getElementById('campo-nombre-usuario');
        const campoContraseña = document.getElementById('campo-contraseña');
        
        if (!campoNombreUsuario || !campoContraseña) return;
        
        const nombreUsuario = campoNombreUsuario.value.trim();
        const contraseña = campoContraseña.value.trim();
        
        // Limpiar mensajes de error anteriores
        limpiarMensajesError();
        
        // Validar campos
        if (!validarTodosLosCamposLogin()) {
            return;
        }
        
        // Procesar autenticación (ahora es asíncrona)
        await procesarAutenticacion(nombreUsuario, contraseña);
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFormularioLogin);
} else {
    inicializarFormularioLogin();
}

