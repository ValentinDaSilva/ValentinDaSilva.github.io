/* Datos de huéspedes (titular y acompañantes) */

/**
 * Obtiene todos los huéspedes de una estadía (titular + acompañantes)
 * @param {Object} estadia - Objeto estadía
 * @returns {Array} - Array de huéspedes con información formateada
 */
function obtenerHuespedesDeEstadia(estadia) {
  if (!estadia) {
    return [];
  }
  
  const huespedes = [];
  
  // Agregar titular
  if (estadia.titular) {
    const titular = estadia.titular;
    const fechaNacimiento = new Date(titular.fechaNacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    const edadCalculada = (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) 
      ? edad - 1 
      : edad;
    
    huespedes.push({
      apellido: titular.apellido || '',
      nombres: titular.nombres || '',
      edad: edadCalculada,
      documento: titular.numeroDocumento || '',
      esTitular: true,
      datosCompletos: titular
    });
  }
  
  // Agregar acompañantes
  if (estadia.acompaniantes && Array.isArray(estadia.acompaniantes)) {
    estadia.acompaniantes.forEach(acompanante => {
      const fechaNacimiento = new Date(acompanante.fechaNacimiento);
      const hoy = new Date();
      const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
      const mes = hoy.getMonth() - fechaNacimiento.getMonth();
      const edadCalculada = (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) 
        ? edad - 1 
        : edad;
      
      huespedes.push({
        apellido: acompanante.apellido || '',
        nombres: acompanante.nombres || '',
        edad: edadCalculada,
        documento: acompanante.numeroDocumento || '',
        esTitular: false,
        datosCompletos: acompanante
      });
    });
  }
  
  return huespedes;
}

/**
 * Carga los huéspedes en la tabla de selección de responsable
 * @param {Array} huespedes - Array de huéspedes
 */
function cargarHuespedesEnTabla(huespedes) {
  const tbody = document.querySelector("#seleccionarResponsable tbody");
  if (!tbody) {
    console.error('No se encontró el tbody de la tabla');
    return;
  }
  
  // Limpiar tabla
  tbody.innerHTML = '';
  
  // Agregar huéspedes a la tabla
  huespedes.forEach(huesped => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${huesped.apellido}</td>
      <td>${huesped.nombres}</td>
      <td>${huesped.edad}</td>
      <td>${huesped.documento}</td>
    `;
    
    // Almacenar datos completos del huésped en la fila
    fila.dataset.huesped = JSON.stringify(huesped.datosCompletos);
    fila.dataset.esTitular = huesped.esTitular;
    
    tbody.appendChild(fila);
  });
  
  // Reinicializar la selección de responsable después de cargar la tabla
  if (typeof inicializarSeleccionResponsable === 'function') {
    inicializarSeleccionResponsable();
  }
}






