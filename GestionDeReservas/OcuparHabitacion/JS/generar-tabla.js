


function generarTablaHabitaciones(fechaInicio, fechaFin) {
  const tabla = document.querySelector('.tabla-habitaciones');
  if (!tabla) {
    console.error('Tabla no encontrada');
    return;
  }

  
  const thead = tabla.querySelector('thead');
  const tbody = tabla.querySelector('tbody');
  
  if (!thead || !tbody) {
    console.error('thead o tbody no encontrados');
    return;
  }

  
  let habitaciones = obtenerHabitaciones();
  
  
  establecerHabitaciones(habitaciones);
  
  
  const tipoFiltro = obtenerTipoFiltroActual();
  if (tipoFiltro) {
    habitaciones = filtrarHabitacionesPorTipo(tipoFiltro);
  }
  
  const fechas = generarArrayFechas(fechaInicio, fechaFin);

  
  thead.innerHTML = '';
  tbody.innerHTML = '';

  
  const headerRow = document.createElement('tr');
  const thFecha = document.createElement('th');
  thFecha.textContent = 'Fecha \\ Habitación';
  headerRow.appendChild(thFecha);

  
  habitaciones.forEach(habitacion => {
    const th = document.createElement('th');
    th.textContent = formatearNombreHabitacion(habitacion);
    th.setAttribute('data-tipo-habitacion', habitacion.tipo);
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  
  
  if (habitaciones.length > 0) {
    mostrarFiltro();
  }

  
  fechas.forEach(fecha => {
    const fila = document.createElement('tr');
    
    
    const tdFecha = document.createElement('td');
    tdFecha.textContent = formatearFechaParaMostrar(fecha);
    fila.appendChild(tdFecha);

    
    habitaciones.forEach(habitacion => {
      const td = document.createElement('td');
      
      
      if (estaHabitacionReservada(habitacion.numero, fecha)) {
        td.className = 'estado-reservada';
        td.setAttribute('data-estado-original', 'reservada');
      } else {
        td.className = 'estado-libre';
        td.setAttribute('data-estado-original', 'libre');
        huboLibre = true;
      }
      
      
      td.setAttribute('data-numero-habitacion', habitacion.numero);
      td.setAttribute('data-fecha', fecha);
      
      fila.appendChild(td);
    });

    tbody.appendChild(fila);
  });

  
  aplicarEstilosCeldas();
  inicializarSeleccionHabitaciones();
  return huboLibre;
}

