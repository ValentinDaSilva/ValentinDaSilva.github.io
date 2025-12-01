


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
      
      // Obtener el estado de la reserva (ocupada, reservada, o null si está libre)
      let estadoReserva = null;
      
      // Verificar que la función exista antes de llamarla
      if (typeof obtenerEstadoReservaHabitacion === 'function') {
        estadoReserva = obtenerEstadoReservaHabitacion(habitacion.numero, fecha);
      } else {
        // Fallback: usar la función antigua si la nueva no existe
        console.warn("⚠️ obtenerEstadoReservaHabitacion no está disponible, usando estaHabitacionReservada");
        const estaReservada = estaHabitacionReservada(habitacion.numero, fecha);
        estadoReserva = estaReservada ? 'reservada' : null;
      }
      
      // Debug: log para verificar reservas (solo primera celda para no saturar)
      if (fecha === fechas[0] && habitacion.numero === habitaciones[0].numero) {
        console.log("🔍 Debug generarTabla - Primera celda:");
        console.log("  - Habitación:", habitacion.numero);
        console.log("  - Fecha:", fecha);
        console.log("  - Reservas disponibles:", (window.listaReservasCU07 || []).length);
        console.log("  - window.listaReservasCU07:", window.listaReservasCU07);
        console.log("  - Estado reserva:", estadoReserva);
        console.log("  - Función disponible:", typeof obtenerEstadoReservaHabitacion);
      }
      
      if (estadoReserva === 'ocupada') {
        // Reserva con estado "Confirmada" o "Finalizada" → mostrar como ocupada (rojo)
        td.className = 'estado-ocupada';
        td.setAttribute('data-estado-original', 'ocupada');
      } else if (estadoReserva === 'reservada') {
        // Reserva con estado "Pendiente" u otro → mostrar como reservada (amarillo)
        td.className = 'estado-reservada';
        td.setAttribute('data-estado-original', 'reservada');
      } else {
        // No hay reserva → mostrar como libre (verde)
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

