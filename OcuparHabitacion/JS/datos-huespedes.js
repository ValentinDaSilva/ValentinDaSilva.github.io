/* Carga y manejo de datos de huéspedes desde JSON */

let datosHuespedes = [];

/**
 * Carga los datos de huéspedes desde el archivo JSON
 * @returns {Promise<Array>} - Array de huéspedes
 */
async function cargarHuespedes() {
    try {
        const respuesta = await fetch('/huspedes.json');
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

/**
 * Filtra los huéspedes según los criterios de búsqueda
 * Criterio: "comienza con" para apellido, nombres y número de documento
 * @param {string} apellido - Apellido a buscar (opcional)
 * @param {string} nombres - Nombres a buscar (opcional)
 * @param {string} tipoDocumento - Tipo de documento a buscar (opcional)
 * @param {string} numeroDocumento - Número de documento a buscar (opcional)
 * @returns {Array} - Array de huéspedes que coinciden con los criterios
 */
function filtrarHuespedes(apellido, nombres, tipoDocumento, numeroDocumento) {
    // Si todos los campos están vacíos, retornar todos los huéspedes
    const apellidoTrim = apellido ? apellido.trim() : '';
    const nombresTrim = nombres ? nombres.trim() : '';
    const tipoDoc = tipoDocumento ? tipoDocumento.trim() : '';
    const numDoc = numeroDocumento ? numeroDocumento.trim() : '';
    
    if (!apellidoTrim && !nombresTrim && !tipoDoc && !numDoc) {
        return datosHuespedes; // Mostrar todos si todos los campos están vacíos
    }
    
    let resultados = datosHuespedes;
    
    // Filtrar por apellido (búsqueda "comienza con", case-insensitive)
    if (apellidoTrim !== '') {
        const apellidoLower = apellidoTrim.toLowerCase();
        resultados = resultados.filter(huesped => 
            huesped.apellido.toLowerCase().startsWith(apellidoLower)
        );
    }
    
    // Filtrar por nombres (búsqueda "comienza con", case-insensitive)
    if (nombresTrim !== '') {
        const nombresLower = nombresTrim.toLowerCase();
        resultados = resultados.filter(huesped => 
            huesped.nombres.toLowerCase().startsWith(nombresLower)
        );
    }
    
    // Filtrar por tipo de documento (coincidencia exacta)
    if (tipoDoc !== '') {
        resultados = resultados.filter(huesped => 
            huesped.tipoDocumento === tipoDoc
        );
    }
    
    // Filtrar por número de documento (búsqueda "comienza con")
    if (numDoc !== '') {
        resultados = resultados.filter(huesped => 
            huesped.numeroDocumento.startsWith(numDoc)
        );
    }
    
    return resultados;
}

/**
 * Obtiene todos los huéspedes
 * @returns {Array} - Array de todos los huéspedes
 */
function obtenerTodosLosHuespedes() {
    return datosHuespedes;
}



