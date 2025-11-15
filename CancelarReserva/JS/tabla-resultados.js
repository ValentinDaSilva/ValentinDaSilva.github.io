/* Manejo de la tabla de resultados */

/**
 * Formatea una fecha de formato YYYY-MM-DD a DD/MM/YYYY
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @returns {string} - Fecha formateada
 */
function formatearFecha(fecha) {
  if (!fecha) return '';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}

/**
 * Obtiene el tipo de habitación desde el número
 * @param {number} numeroHabitacion - Número de habitación
 * @returns {string} - Tipo de habitación
 */
function obtenerTipoHabitacion(numeroHabitacion) {
  if (!numeroHabitacion) return '';
  
  // Determinar tipo según el piso
  if (numeroHabitacion >= 101 && numeroHabitacion <= 115) return 'INDIVIDUAL';
  if (numeroHabitacion >= 201 && numeroHabitacion <= 215) return 'DOBLE';
  if (numeroHabitacion >= 302 && numeroHabitacion <= 308) return 'FAMILIAR';
  if (numeroHabitacion >= 402 && numeroHabitacion <= 409) return 'SUITE';
  
  return 'DESCONOCIDO';
}

/**
 * Formatea el número de habitación al formato TIPO-NUMERO
 * @param {number} numeroHabitacion - Número de habitación
 * @returns {string} - Formato TIPO-NUMERO
 */
function formatearNumeroHabitacion(numeroHabitacion) {
  const tipo = obtenerTipoHabitacion(numeroHabitacion);
  const prefijo = tipo === 'INDIVIDUAL' ? 'IND' : 
                  tipo === 'DOBLE' ? 'DOB' : 
                  tipo === 'FAMILIAR' ? 'FAM' : 
                  tipo === 'SUITE' ? 'SUITE' : 'DES';
  return `${prefijo}-${numeroHabitacion}`;
}

/**
 * Muestra los resultados de la búsqueda en la tabla
 */
function mostrarResultados() {
  const contenedorResultados = document.getElementById('contenedor-resultados');
  const cuerpoTabla = document.getElementById('cuerpo-tabla');

  if (reservasFiltradas.length === 0) {
    // No hay resultados - mostrar modal
    mostrarModalNoResultados();
    return;
  }

  // Mostrar contenedor de resultados
  contenedorResultados.style.display = 'block';

  // Limpiar tabla
  cuerpoTabla.innerHTML = '';

  // Agregar filas
  reservasFiltradas.forEach((reserva, index) => {
    const fila = document.createElement('tr');
    const apellido = extraerApellido(reserva);
    const nombres = extraerNombre(reserva);
    
    // Nuevo formato: habitaciones es un array, mostrar todas o la primera
    const habitaciones = reserva.habitaciones || [];
    const primeraHabitacion = habitaciones.length > 0 ? habitaciones[0] : null;
    const numeroHabitacion = primeraHabitacion ? primeraHabitacion.numero : (reserva.numeroHabitacion || null);
    const tipoHabitacion = primeraHabitacion ? primeraHabitacion.tipo : obtenerTipoHabitacion(numeroHabitacion);
    const numeroHabitacionFormateado = numeroHabitacion ? formatearNumeroHabitacion(numeroHabitacion) : 'N/A';
    
    // Fechas: nuevo formato usa fechaInicio/fechaFin, antiguo usa desde/hasta
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

  // Limpiar selecciones
  reservasSeleccionadas = [];
}
