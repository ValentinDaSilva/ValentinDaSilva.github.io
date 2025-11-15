

let datosHuespedes = [];


async function cargarHuespedes() {
    try {
        const respuesta = await fetch('/Datos/huspedes.json');
        if (!respuesta.ok) {
            throw new Error(`Error al cargar los datos: ${respuesta.status}`);
        }
        datosHuespedes = await respuesta.json();
        console.log(`Se cargaron ${datosHuespedes.length} huéspedes`);
        return datosHuespedes;
    } catch (error) {
        console.error('Error al cargar huéspedes:', error);
        mensajeError('Error al cargar los datos de huéspedes. Por favor, recarga la página.');
        return [];
    }
}


function filtrarHuespedes(apellido, nombres, tipoDocumento, numeroDocumento) {
    
    const apellidoTrim = apellido ? apellido.trim() : '';
    const nombresTrim = nombres ? nombres.trim() : '';
    const tipoDoc = tipoDocumento ? tipoDocumento.trim() : '';
    const numDoc = numeroDocumento ? numeroDocumento.trim() : '';
    
    if (!apellidoTrim && !nombresTrim && !tipoDoc && !numDoc) {
        return datosHuespedes; 
    }
    
    let resultados = datosHuespedes;
    
    
    if (apellidoTrim !== '') {
        const apellidoLower = apellidoTrim.toLowerCase();
        resultados = resultados.filter(huesped => 
            huesped.apellido.toLowerCase().startsWith(apellidoLower)
        );
    }
    
    
    if (nombresTrim !== '') {
        const nombresLower = nombresTrim.toLowerCase();
        resultados = resultados.filter(huesped => 
            huesped.nombres.toLowerCase().startsWith(nombresLower)
        );
    }
    
    
    if (tipoDoc !== '') {
        resultados = resultados.filter(huesped => 
            huesped.tipoDocumento === tipoDoc
        );
    }
    
    
    if (numDoc !== '') {
        resultados = resultados.filter(huesped => 
            huesped.numeroDocumento.startsWith(numDoc)
        );
    }
    
    return resultados;
}


function obtenerTodosLosHuespedes() {
    return datosHuespedes;
}



