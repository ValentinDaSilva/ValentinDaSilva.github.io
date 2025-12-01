


function generarTablaHabitaciones(fechaInicio, fechaFin) {
  let huboLibre = false;
  
  const tabla = document.querySelector('.tabla-habitaciones');
  if (!tabla) {
    console.error('Tabla no encontrada');
    return false;
  }

  
  const thead = tabla.querySelector('thead');
  const tbody = tabla.querySelector('tbody');
  
  if (!thead || !tbody) {
    console.error('thead o tbody no encontrados');
    return false;
  }

  
  // Usar habitaciones del backend (obtenidas por GestorEstadia)
  let habitaciones = window.listaHabitacionesCU07 || [];
  
  if (habitaciones.length === 0) {
    console.error('No hay habitaciones disponibles');
    return false;
  }
  
  
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
      
      // Verificar si está reservada usando las reservas del backend
      const estaReservada = estaHabitacionReservada(habitacion.numero, fecha);
      
      // Debug: log para verificar reservas
      if (fecha === fechas[0] && habitacion.numero === habitaciones[0].numero) {
        console.log("🔍 Debug generarTabla - Primera celda:");
        console.log("  - Habitación:", habitacion.numero);
        console.log("  - Fecha:", fecha);
        console.log("  - Reservas disponibles:", (window.listaReservasCU07 || []).length);
        console.log("  - Está reservada:", estaReservada);
      }
      
      if (estaReservada) {
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

