/* Generación dinámica de la tabla de habitaciones */

/**
 * Genera la tabla de habitaciones dinámicamente
 * @param {string} fechaInicio - Fecha inicio en formato YYYY-MM-DD
 * @param {string} fechaFin - Fecha fin en formato YYYY-MM-DD
 */
function generarTablaHabitaciones(fechaInicio, fechaFin) {
  const tabla = document.querySelector('.tabla-habitaciones');
  if (!tabla) {
    console.error('Tabla no encontrada');
    return;
  }

  // Limpiar tabla existente
  const thead = tabla.querySelector('thead');
  const tbody = tabla.querySelector('tbody');
  
  if (!thead || !tbody) {
    console.error('thead o tbody no encontrados');
    return;
  }

  // Obtener datos
  let habitaciones = obtenerHabitaciones();
  
  // Guardar todas las habitaciones para el filtro
  establecerHabitaciones(habitaciones);
  
  // Aplicar filtro si existe
  const tipoFiltro = obtenerTipoFiltroActual();
  if (tipoFiltro) {
    habitaciones = filtrarHabitacionesPorTipo(tipoFiltro);
  }
  
  const fechas = generarArrayFechas(fechaInicio, fechaFin);

  // Limpiar contenido anterior
  thead.innerHTML = '';
  tbody.innerHTML = '';

  // Crear header de la tabla
  const headerRow = document.createElement('tr');
  const thFecha = document.createElement('th');
  thFecha.textContent = 'Fecha \\ Habitación';
  headerRow.appendChild(thFecha);

  // Agregar headers de habitaciones
  habitaciones.forEach(habitacion => {
    const th = document.createElement('th');
    th.textContent = formatearNombreHabitacion(habitacion);
    th.setAttribute('data-tipo-habitacion', habitacion.tipo);
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  
  // Mostrar el filtro si hay habitaciones
  if (habitaciones.length > 0) {
    mostrarFiltro();
  }

  // Crear filas para cada fecha
  fechas.forEach(fecha => {
    const fila = document.createElement('tr');
    
    // Celda de fecha
    const tdFecha = document.createElement('td');
    tdFecha.textContent = formatearFechaParaMostrar(fecha);
    fila.appendChild(tdFecha);

    // Celdas para cada habitación
    habitaciones.forEach(habitacion => {
      const td = document.createElement('td');
      
      // Verificar si está reservada
      if (estaHabitacionReservada(habitacion.numero, fecha)) {
        td.className = 'estado-reservada';
        td.setAttribute('data-estado-original', 'reservada');
      } else {
        td.className = 'estado-libre';
        td.setAttribute('data-estado-original', 'libre');
      }
      
      // Guardar información de la habitación para referencia
      td.setAttribute('data-numero-habitacion', habitacion.numero);
      td.setAttribute('data-fecha', fecha);
      
      fila.appendChild(td);
    });

    tbody.appendChild(fila);
  });

  // Aplicar estilos y reinicializar selección
  aplicarEstilosCeldas();
  inicializarSeleccionHabitaciones();
}

