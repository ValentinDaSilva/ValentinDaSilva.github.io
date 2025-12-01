

let todasLasHabitaciones = [];
let tipoFiltroActual = '';


function establecerHabitaciones(habitaciones) {
  todasLasHabitaciones = habitaciones;
}


function filtrarHabitacionesPorTipo(tipo) {
  if (!tipo || tipo === '') {
    return todasLasHabitaciones;
  }
  return todasLasHabitaciones.filter(habitacion => habitacion.tipo === tipo);
}


function obtenerTodasLasHabitaciones() {
  return todasLasHabitaciones;
}


function obtenerTipoFiltroActual() {
  return tipoFiltroActual;
}


function establecerTipoFiltro(tipo) {
  tipoFiltroActual = tipo;
}


function inicializarFiltro() {
  const selectFiltro = document.getElementById('filtro-tipo-habitacion');
  const contenedorFiltro = document.getElementById('contenedor-filtro');
  
  if (!selectFiltro || !contenedorFiltro) {
    console.error('Elementos del filtro no encontrados');
    return;
  }

  selectFiltro.addEventListener('change', function() {
    tipoFiltroActual = this.value;
    
    
    const fechaDesdeInput = document.getElementById('checkin');
    const fechaHastaInput = document.getElementById('checkout');
    
    if (fechaDesdeInput && fechaHastaInput && fechaDesdeInput.value && fechaHastaInput.value) {
      
      generarTablaHabitaciones(fechaDesdeInput.value, fechaHastaInput.value);
    }
  });
}


function mostrarFiltro() {
  const contenedorFiltro = document.getElementById('contenedor-filtro');
  if (contenedorFiltro) {
    contenedorFiltro.style.display = 'block';
  }
}


function ocultarFiltro() {
  const contenedorFiltro = document.getElementById('contenedor-filtro');
  if (contenedorFiltro) {
    contenedorFiltro.style.display = 'none';
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarFiltro);
} else {
  inicializarFiltro();
}

