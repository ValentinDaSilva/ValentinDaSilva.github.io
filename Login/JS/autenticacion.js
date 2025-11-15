


async function autenticarUsuario(nombreUsuario, contraseña) {
    
    if (!datosUsuarios || datosUsuarios.length === 0) {
        await cargarUsuarios();
    }
    
    
    return validarUsuario(nombreUsuario, contraseña);
}


function guardarSesion(usuario) {
    const sesion = {
        usuario: usuario.usuario,
        fechaInicio: new Date().toISOString()
    };
    localStorage.setItem('sesionActiva', JSON.stringify(sesion));
    console.log('Sesión guardada en localStorage:', sesion);
}


async function procesarAutenticacion(nombreUsuario, contraseña) {
    try {
        const usuario = await autenticarUsuario(nombreUsuario, contraseña);
        if (usuario) {
            console.log(`Usuario autenticado: ${usuario.usuario}`);
            
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
        
        
        limpiarMensajesError();
        
        
        if (!validarTodosLosCamposLogin()) {
            return;
        }
        
        
        await procesarAutenticacion(nombreUsuario, contraseña);
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFormularioLogin);
} else {
    inicializarFormularioLogin();
}

