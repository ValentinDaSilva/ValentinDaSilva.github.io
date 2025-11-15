

let datosUsuarios = [];


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
        
        return [];
    }
}


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


function existeUsuario(nombreUsuario) {
    if (!datosUsuarios || datosUsuarios.length === 0) {
        return false;
    }
    
    return datosUsuarios.some(usuario => usuario.usuario === nombreUsuario);
}


function obtenerTodosLosUsuarios() {
    return datosUsuarios;
}


function obtenerUsuarioPorNombre(nombreUsuario) {
    if (!datosUsuarios || datosUsuarios.length === 0) {
        return null;
    }
    
    return datosUsuarios.find(usuario => usuario.usuario === nombreUsuario) || null;
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', cargarUsuarios);
} else {
    cargarUsuarios();
}

