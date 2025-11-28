


async function autenticarUsuario(username, password) {
    try {
        const res = await fetch("http://localhost:8080/api/usuarios/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            return { error: await res.text() };
        }

        const data = await res.json();
        console.log('Respuesta del servidor:', data);

        return data;

    } catch (error) {
        console.error('Error al autenticar usuario:', error);
        return { error: "Error inesperado de conexión." };
    }
}



function guardarSesion(usuario) {
    const sesion = {
        usuario: usuario.username || usuario.usuario,
        fechaInicio: new Date().toISOString(),
        datosUsuario: usuario
    };
    localStorage.setItem('sesionActiva', JSON.stringify(sesion));
    console.log('Sesión guardada en localStorage:', sesion);
}


async function procesarAutenticacion(nombreUsuario, contraseña) {
    const usuario = await autenticarUsuario(nombreUsuario, contraseña);

    if (usuario?.error) {
        mostrarModalError(usuario.error);
        return;
    }

    if (usuario) {
        console.log(`Usuario autenticado: ${usuario.username}`);
        guardarSesion(usuario);
        mostrarModalExito();
    } else {
        mostrarModalError("Usuario o contraseña incorrectos.");
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

