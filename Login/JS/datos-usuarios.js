/* Carga y manejo de datos de usuarios desde JSON */

let datosUsuarios = [];

/**
 * Carga los datos de usuarios desde el archivo JSON
 * @returns {Promise<Array>} - Array de usuarios
 */
async function cargarUsuarios() {
    try {
        const respuesta = await fetch('../Datos/usuarios.json');
        if (!respuesta.ok) {
            throw new Error(`Error al cargar los datos: ${respuesta.status}`);
        }
        datosUsuarios = await respuesta.json();
        console.log(`Se cargaron ${datosUsuarios.length} usuarios`);
        return datosUsuarios;
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        datosUsuarios = [];
        // El error se manejará en autenticacion.js cuando se intente autenticar
        return [];
    }
}

/**
 * Valida si un usuario existe y sus credenciales son correctas
 * @param {string} nombreUsuario - Nombre de usuario
 * @param {string} contraseña - Contraseña del usuario
 * @returns {Object|null} - Objeto usuario si las credenciales son válidas, null en caso contrario
 */
function validarUsuario(nombreUsuario, contraseña) {
    if (!datosUsuarios || datosUsuarios.length === 0) {
        console.warn('No hay usuarios cargados');
        return null;
    }
    
    const usuarioEncontrado = datosUsuarios.find(usuario => {
        return usuario.usuario === nombreUsuario && usuario.contraseña === contraseña;
    });
    
    return usuarioEncontrado || null;
}

/**
 * Verifica si un nombre de usuario existe (sin validar contraseña)
 * @param {string} nombreUsuario - Nombre de usuario a verificar
 * @returns {boolean} - true si el usuario existe, false en caso contrario
 */
function existeUsuario(nombreUsuario) {
    if (!datosUsuarios || datosUsuarios.length === 0) {
        return false;
    }
    
    return datosUsuarios.some(usuario => usuario.usuario === nombreUsuario);
}

/**
 * Obtiene todos los usuarios cargados
 * @returns {Array} - Array de todos los usuarios
 */
function obtenerTodosLosUsuarios() {
    return datosUsuarios;
}

/**
 * Obtiene un usuario por su nombre de usuario
 * @param {string} nombreUsuario - Nombre de usuario
 * @returns {Object|null} - Objeto usuario o null si no existe
 */
function obtenerUsuarioPorNombre(nombreUsuario) {
    if (!datosUsuarios || datosUsuarios.length === 0) {
        return null;
    }
    
    return datosUsuarios.find(usuario => usuario.usuario === nombreUsuario) || null;
}

// Cargar datos al inicializar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarUsuarios);
} else {
    cargarUsuarios();
}

