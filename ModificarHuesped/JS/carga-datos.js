/* Carga de datos del huésped desde sessionStorage */

/**
 * Obtiene los datos del huésped seleccionado desde sessionStorage
 * @returns {Object|null} - Datos del huésped o null si no existe
 */
function obtenerHuespedDeSessionStorage() {
    try {
        const huespedGuardado = sessionStorage.getItem('huespedSeleccionado');
        if (huespedGuardado) {
            return JSON.parse(huespedGuardado);
        }
        return null;
    } catch (error) {
        console.error('Error al obtener huésped de sessionStorage:', error);
        return null;
    }
}

/**
 * Carga los datos del huésped en el formulario
 * @param {Object} huesped - Datos del huésped
 */
function cargarDatosEnFormulario(huesped) {
    if (!huesped) return;
    
    // Mapear los datos del huésped a los campos del formulario
    // Manejar diferentes formatos de datos que pueden venir del sessionStorage
    
    // Datos básicos
    if (huesped.apellido) {
        const campoApellido = document.getElementById('apellido');
        if (campoApellido) campoApellido.value = huesped.apellido;
    }
    
    if (huesped.nombres) {
        const campoNombres = document.getElementById('nombres');
        if (campoNombres) campoNombres.value = huesped.nombres;
    }
    
    if (huesped.tipoDocumento) {
        const campoTipoDoc = document.getElementById('tipoDocumento');
        if (campoTipoDoc) campoTipoDoc.value = huesped.tipoDocumento;
    }
    
    if (huesped.numeroDocumento) {
        const campoNumDoc = document.getElementById('numeroDocumento');
        if (campoNumDoc) campoNumDoc.value = huesped.numeroDocumento;
    }
    
    // Datos opcionales
    if (huesped.cuit) {
        const campoCuit = document.getElementById('cuit');
        if (campoCuit) campoCuit.value = huesped.cuit;
    }
    
    if (huesped.fechaNacimiento) {
        const campoFecha = document.getElementById('fechaNacimiento');
        if (campoFecha) campoFecha.value = huesped.fechaNacimiento;
    }
    
    // Teléfono - manejar diferentes formatos
    if (huesped.caracteristica || huesped.telefono) {
        const campoCaracteristica = document.getElementById('caracteristica');
        if (campoCaracteristica) {
            if (huesped.caracteristica) {
                campoCaracteristica.value = huesped.caracteristica;
            } else if (huesped.telefono && huesped.telefono.includes('-')) {
                campoCaracteristica.value = huesped.telefono.split('-')[0];
            }
        }
    }
    
    // Teléfono número - puede venir como telefonoNumero o celular
    if (huesped.telefonoNumero || huesped.celular || huesped.telefono) {
        const campoCelular = document.getElementById('celular');
        if (campoCelular) {
            if (huesped.telefonoNumero) {
                campoCelular.value = huesped.telefonoNumero;
            } else if (huesped.celular) {
                campoCelular.value = huesped.celular;
            } else if (huesped.telefono && huesped.telefono.includes('-')) {
                campoCelular.value = huesped.telefono.split('-')[1];
            }
        }
    }
    
    if (huesped.email) {
        const campoEmail = document.getElementById('email');
        if (campoEmail) campoEmail.value = huesped.email;
    }
    
    if (huesped.ocupacion) {
        const campoOcupacion = document.getElementById('ocupacion');
        if (campoOcupacion) campoOcupacion.value = huesped.ocupacion;
    }
    
    if (huesped.nacionalidad) {
        const campoNacionalidad = document.getElementById('nacionalidad');
        if (campoNacionalidad) campoNacionalidad.value = huesped.nacionalidad;
    }
    
    // Dirección
    if (huesped.calle || (huesped.direccion && huesped.direccion.calle)) {
        const campoCalle = document.getElementById('calle');
        if (campoCalle) campoCalle.value = huesped.calle || huesped.direccion.calle || '';
    }
    
    // Número de calle - puede venir como numeroCalle o numero
    if (huesped.numeroCalle || huesped.numero || (huesped.direccion && huesped.direccion.numero)) {
        const campoNumero = document.getElementById('numero');
        if (campoNumero) {
            if (huesped.numeroCalle) {
                campoNumero.value = huesped.numeroCalle;
            } else if (huesped.numero) {
                campoNumero.value = huesped.numero;
            } else if (huesped.direccion && huesped.direccion.numero) {
                campoNumero.value = huesped.direccion.numero;
            }
        }
    }
    
    if (huesped.departamento || (huesped.direccion && huesped.direccion.departamento)) {
        const campoDepto = document.getElementById('departamento');
        if (campoDepto) campoDepto.value = huesped.departamento || (huesped.direccion ? huesped.direccion.departamento : '') || '';
    }
    
    if (huesped.piso || (huesped.direccion && huesped.direccion.piso)) {
        const campoPiso = document.getElementById('piso');
        if (campoPiso) campoPiso.value = huesped.piso || (huesped.direccion ? huesped.direccion.piso : '') || '';
    }
    
    if (huesped.codigoPostal || (huesped.direccion && huesped.direccion.codigoPostal)) {
        const campoCodPostal = document.getElementById('codigoPostal');
        if (campoCodPostal) campoCodPostal.value = huesped.codigoPostal || (huesped.direccion ? huesped.direccion.codigoPostal : '') || '';
    }
    
    if (huesped.localidad || (huesped.direccion && huesped.direccion.localidad)) {
        const campoLocalidad = document.getElementById('localidad');
        if (campoLocalidad) campoLocalidad.value = huesped.localidad || (huesped.direccion ? huesped.direccion.localidad : '') || '';
    }
    
    if (huesped.provincia || (huesped.direccion && huesped.direccion.provincia)) {
        const campoProvincia = document.getElementById('provincia');
        if (campoProvincia) campoProvincia.value = huesped.provincia || (huesped.direccion ? huesped.direccion.provincia : '') || '';
    }
    
    if (huesped.pais || (huesped.direccion && huesped.direccion.pais)) {
        const campoPais = document.getElementById('pais');
        if (campoPais) campoPais.value = huesped.pais || (huesped.direccion ? huesped.direccion.pais : '') || '';
    }
}

/**
 * Verifica si existe un huésped seleccionado y carga los datos
 * Si no existe, muestra una alerta y redirige a buscarHuesped
 */
function inicializarCargaDatos() {
    const huesped = obtenerHuespedDeSessionStorage();
    
    if (!huesped) {
        // Mostrar alerta y redirigir
        alert("Primero debes seleccionar un huésped");
        window.location.href = '../BuscarHuesped/buscarHuesped.html';
        return;
    }
    
    // Esperar a que el gestor esté disponible (los módulos se cargan de forma asíncrona)
    function establecerHuespedEnGestor() {
        if (window.gestorModificarHuesped) {
            // Crear una copia del huésped para evitar modificaciones accidentales
            const huespedOriginal = JSON.parse(JSON.stringify(huesped));
            window.gestorModificarHuesped.establecerHuespedOriginal(huespedOriginal);
            console.log('Huésped original establecido en el gestor:', huespedOriginal);
        } else {
            // Si el gestor aún no está disponible, intentar de nuevo después de un breve delay
            setTimeout(establecerHuespedEnGestor, 50);
        }
    }
    
    // Intentar establecer el huésped en el gestor
    establecerHuespedEnGestor();
    
    // Cargar los datos en el formulario
    cargarDatosEnFormulario(huesped);
    
    console.log('Datos del huésped cargados correctamente:', huesped);
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCargaDatos);
} else {
    inicializarCargaDatos();
}

