


function obtenerHuespedesDeEstadia(estadia) {
  if (!estadia) {
    return [];
  }
  
  const huespedes = [];
  
  
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


function cargarHuespedesEnTabla(huespedes) {
  const tbody = document.querySelector("#seleccionarResponsable tbody");
  if (!tbody) {
    console.error('No se encontró el tbody de la tabla');
    return;
  }
  
  
  tbody.innerHTML = '';
  
  
  huespedes.forEach(huesped => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${huesped.apellido}</td>
      <td>${huesped.nombres}</td>
      <td>${huesped.edad}</td>
      <td>${huesped.documento}</td>
    `;
    
    
    fila.dataset.huesped = JSON.stringify(huesped.datosCompletos);
    fila.dataset.esTitular = huesped.esTitular;
    
    tbody.appendChild(fila);
  });
  
  
  if (typeof inicializarSeleccionResponsable === 'function') {
    inicializarSeleccionResponsable();
  }
}









