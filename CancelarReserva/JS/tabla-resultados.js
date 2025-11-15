


function formatearFecha(fecha) {
  if (!fecha) return '';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}


function obtenerTipoHabitacion(numeroHabitacion) {
  if (!numeroHabitacion) return '';
  
  
  if (numeroHabitacion >= 101 && numeroHabitacion <= 115) return 'INDIVIDUAL';
  if (numeroHabitacion >= 201 && numeroHabitacion <= 215) return 'DOBLE';
  if (numeroHabitacion >= 302 && numeroHabitacion <= 308) return 'FAMILIAR';
  if (numeroHabitacion >= 402 && numeroHabitacion <= 409) return 'SUITE';
  
  return 'DESCONOCIDO';
}


function formatearNumeroHabitacion(numeroHabitacion) {
  const tipo = obtenerTipoHabitacion(numeroHabitacion);
  const prefijo = tipo === 'INDIVIDUAL' ? 'IND' : 
                  tipo === 'DOBLE' ? 'DOB' : 
                  tipo === 'FAMILIAR' ? 'FAM' : 
                  tipo === 'SUITE' ? 'SUITE' : 'DES';
  return `${prefijo}-${numeroHabitacion}`;
}


function mostrarResultados() {
  const contenedorResultados = document.getElementById('contenedor-resultados');
  const cuerpoTabla = document.getElementById('cuerpo-tabla');

  if (reservasFiltradas.length === 0) {
    
    mostrarModalNoResultados();
    return;
  }

  
  contenedorResultados.style.display = 'block';

  
  cuerpoTabla.innerHTML = '';

  
  reservasFiltradas.forEach((reserva, index) => {
    const fila = document.createElement('tr');
    const apellido = extraerApellido(reserva);
    const nombres = extraerNombre(reserva);
    
    
    const habitaciones = reserva.habitaciones || [];
    const primeraHabitacion = habitaciones.length > 0 ? habitaciones[0] : null;
    const numeroHabitacion = primeraHabitacion ? primeraHabitacion.numero : (reserva.numeroHabitacion || null);
    const tipoHabitacion = primeraHabitacion ? primeraHabitacion.tipo : obtenerTipoHabitacion(numeroHabitacion);
    const numeroHabitacionFormateado = numeroHabitacion ? formatearNumeroHabitacion(numeroHabitacion) : 'N/A';
    
    
    const fechaDesde = reserva.fechaInicio || reserva.desde;
    const fechaHasta = reserva.fechaFin || reserva.hasta;
    
    fila.innerHTML = `
      <td class="celda-checkbox">
        <input type="checkbox" id="check_${index}" onchange="toggleSeleccion(${index})">
      </td>
      <td>${apellido}</td>
      <td>${nombres}</td>
      <td>${numeroHabitacionFormateado}${habitaciones.length > 1 ? ` (+${habitaciones.length - 1})` : ''}</td>
      <td>${tipoHabitacion}</td>
      <td>${formatearFecha(fechaDesde)}</td>
      <td>${formatearFecha(fechaHasta)}</td>
    `;
    
    cuerpoTabla.appendChild(fila);
  });

  
  reservasSeleccionadas = [];
}
