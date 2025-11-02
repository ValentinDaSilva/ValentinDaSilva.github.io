/* Gestión de la selección de habitaciones */

let habitacionesSeleccionadas = [];

/**
 * Obtiene la lista de habitaciones seleccionadas
 * @returns {string[]} - Array con los nombres de las habitaciones seleccionadas
 */
function obtenerHabitacionesSeleccionadas() {
  return habitacionesSeleccionadas;
}

/**
 * Limpia la lista de habitaciones seleccionadas
 */
function limpiarHabitacionesSeleccionadas() {
  habitacionesSeleccionadas = [];
}

/**
 * Inicializa los event listeners para la selección de habitaciones al hacer clic en los headers
 */
function inicializarSeleccionHabitaciones() {
  // Remover listeners anteriores para evitar duplicados
  document.querySelectorAll('.tabla-habitaciones th').forEach((header, index) => {
    if (index === 0) return;
    const nuevoHeader = header.cloneNode(true);
    header.parentNode.replaceChild(nuevoHeader, header);
  });
  
  document.querySelectorAll('.tabla-habitaciones th').forEach((header, index) => {
    // Saltamos la primera columna (fecha)
    if (index === 0) return;
    
    header.addEventListener('click', () => {
      const celdasColumna = obtenerCeldasColumna(index);
      
      // Verificar que todas las celdas estén libres (no reservadas)
      const todasLibres = celdasColumna.every(celda => {
        const estadoOriginal = celda.getAttribute('data-estado-original');
        return estadoOriginal === 'libre' || celda.classList.contains('estado-libre');
      });
      
      if (!todasLibres) {
        mensajeError("No se puede seleccionar la habitación porque tiene días reservados en el rango seleccionado");
        return;
      }
      
      const habitacion = header.textContent.trim();
      const indiceHabitacion = habitacionesSeleccionadas.indexOf(habitacion);
      
      // Verificar si ya está seleccionada
      const yaSeleccionada = celdasColumna.some(celda => 
        celda.classList.contains('estado-seleccionada') || 
        celda.style.backgroundColor === 'yellow'
      );
      
      if (!yaSeleccionada) {
        // Seleccionar
        habitacionesSeleccionadas.push(habitacion);
        celdasColumna.forEach(celda => {
          celda.style.backgroundColor = 'yellow';
          celda.classList.add('estado-seleccionada');
          celda.classList.remove('estado-libre');
        });
      } else {
        // Deseleccionar
        const indice = habitacionesSeleccionadas.indexOf(habitacion);
        if (indice !== -1) {
          habitacionesSeleccionadas.splice(indice, 1);
        }
        celdasColumna.forEach(celda => {
          const estadoOriginal = celda.getAttribute('data-estado-original');
          celda.style.backgroundColor = '';
          celda.classList.remove('estado-seleccionada');
          celda.classList.add(estadoOriginal === 'reservada' ? 'estado-reservada' : 'estado-libre');
          // Reaplicar estilos
          aplicarEstilosCeldas();
        });
      }
    });
  });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarSeleccionHabitaciones);
} else {
  inicializarSeleccionHabitaciones();
}

