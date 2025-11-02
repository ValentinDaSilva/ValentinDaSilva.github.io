/* Gestión del filtro de tipo de habitación */

let todasLasHabitaciones = [];
let tipoFiltroActual = '';

/**
 * Establece todas las habitaciones para el filtro
 * @param {Array} habitaciones - Array de todas las habitaciones
 */
function establecerHabitaciones(habitaciones) {
  todasLasHabitaciones = habitaciones;
}

/**
 * Filtra las habitaciones por tipo
 * @param {string} tipo - Tipo de habitación a filtrar (IND, DOBE, DOBS, FAM, SUITE) o '' para todas
 * @returns {Array} - Array de habitaciones filtradas
 */
function filtrarHabitacionesPorTipo(tipo) {
  if (!tipo || tipo === '') {
    return todasLasHabitaciones;
  }
  return todasLasHabitaciones.filter(habitacion => habitacion.tipo === tipo);
}

/**
 * Obtiene todas las habitaciones sin filtrar
 * @returns {Array} - Array de todas las habitaciones
 */
function obtenerTodasLasHabitaciones() {
  return todasLasHabitaciones;
}

/**
 * Obtiene el tipo de filtro actual
 * @returns {string} - Tipo de filtro actual
 */
function obtenerTipoFiltroActual() {
  return tipoFiltroActual;
}

/**
 * Establece el tipo de filtro
 * @param {string} tipo - Tipo de filtro a establecer
 */
function establecerTipoFiltro(tipo) {
  tipoFiltroActual = tipo;
}

/**
 * Inicializa el event listener del filtro
 */
function inicializarFiltro() {
  const selectFiltro = document.getElementById('filtro-tipo-habitacion');
  const contenedorFiltro = document.getElementById('contenedor-filtro');
  
  if (!selectFiltro || !contenedorFiltro) {
    console.error('Elementos del filtro no encontrados');
    return;
  }

  selectFiltro.addEventListener('change', function() {
    tipoFiltroActual = this.value;
    
    // Obtener las fechas actuales (necesitamos regenerar la tabla)
    const fechaDesdeInput = document.getElementById('fecha-desde');
    const fechaHastaInput = document.getElementById('fecha-hasta');
    
    if (fechaDesdeInput && fechaHastaInput && fechaDesdeInput.value && fechaHastaInput.value) {
      // Regenerar la tabla con el filtro aplicado
      generarTablaHabitaciones(fechaDesdeInput.value, fechaHastaInput.value);
    }
  });
}

/**
 * Muestra el filtro
 */
function mostrarFiltro() {
  const contenedorFiltro = document.getElementById('contenedor-filtro');
  if (contenedorFiltro) {
    contenedorFiltro.style.display = 'block';
  }
}

/**
 * Ocultar el filtro
 */
function ocultarFiltro() {
  const contenedorFiltro = document.getElementById('contenedor-filtro');
  if (contenedorFiltro) {
    contenedorFiltro.style.display = 'none';
  }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarFiltro);
} else {
  inicializarFiltro();
}

