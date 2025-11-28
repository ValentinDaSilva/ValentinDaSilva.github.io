

let datosHuespedes = [];

function asegurarLista(valores) {
    if (Array.isArray(valores)) {
        return valores;
    }

    if (valores && Array.isArray(valores.huespedes)) {
        return valores.huespedes;
    }

    return [];
}

function normalizarDatosLocales(datosCrudos) {
    if (!datosCrudos) {
        return [];
    }

    const lista = asegurarLista(datosCrudos);

    return lista.map(huesped => {
        const nombre = (huesped.nombre ?? huesped.nombre ?? '').toString().trim();
        const numeroDocumentoRaw = huesped.numeroDocumento ?? huesped.nroDocumento ?? huesped.documento ?? '';
        const numeroDocumento = numeroDocumentoRaw === null || numeroDocumentoRaw === undefined
            ? ''
            : String(numeroDocumentoRaw).trim();
        const tipoDocumento = (huesped.tipoDocumento ?? huesped.tipoDoc ?? '').toString().trim();

        return {
            ...huesped,
            apellido: (huesped.apellido ?? '').toString().trim(),
            nombre,
            nombre: huesped.nombre ?? nombre,
            numeroDocumento,
            nroDocumento: huesped.nroDocumento ?? numeroDocumento,
            tipoDocumento
        };
    });
}

async function cargarHuespedes() {
    try {
        const respuesta = await fetch('../Datos/huespedes.json');
        if (!respuesta.ok) {
            throw new Error(`Error al cargar los datos: ${respuesta.status}`);
        }
        const datosCrudos = await respuesta.json();
        datosHuespedes = asegurarLista(normalizarDatosLocales(datosCrudos));
        console.log(`Se cargaron ${datosHuespedes.length} huéspedes`);
        return datosHuespedes;
    } catch (error) {
        console.error('Error al cargar huéspedes:', error);
        mensajeError('Error al cargar los datos de huéspedes. Por favor, recarga la página.');
        datosHuespedes = [];
        return [];
    }
}

function filtrarHuespedes(apellido, nombre, tipoDocumento, numeroDocumento) {
    
    const apellidoTrim = apellido ? apellido.trim() : '';
    const nombreTrim = nombre ? nombre.trim() : '';
    const tipoDoc = tipoDocumento ? tipoDocumento.trim() : '';
    const numDoc = numeroDocumento ? numeroDocumento.trim() : '';
    
    if (!apellidoTrim && !nombreTrim && !tipoDoc && !numDoc) {
        return datosHuespedes; 
    }
    
    let resultados = asegurarLista(datosHuespedes);
    
    
    if (apellidoTrim !== '') {
        const apellidoLower = apellidoTrim.toLowerCase();
        resultados = resultados.filter(huesped => 
            (huesped.apellido || '').toLowerCase().startsWith(apellidoLower)
        );
    }
    
    
    if (nombreTrim !== '') {
        const nombreLower = nombreTrim.toLowerCase();
        resultados = resultados.filter(huesped => 
            (huesped.nombre || '').toLowerCase().startsWith(nombreLower)
        );
    }
    
    
    if (tipoDoc !== '') {
        resultados = resultados.filter(huesped => 
            (huesped.tipoDocumento || '').toString() === tipoDoc
        );
    }
    
    
    if (numDoc !== '') {
        resultados = resultados.filter(huesped => 
            (huesped.numeroDocumento || '').toString().startsWith(numDoc)
        );
    }
    
    return resultados;
}

function obtenerTodosLosHuespedes() {
    return datosHuespedes;
}

