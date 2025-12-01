
// ====================================================
//    filtro-habitaciones.js — versión corregida
// ====================================================

let todasLasHabitaciones = [];
let tipoFiltroActual = '';

// =======================================================
// NORMALIZACIÓN (tipo + categoría)
// Convierte lo que viene del backend → IND / DOBE / DOBS / FAM / SUITE
// =======================================================
function normalizarTipo(h) {
  if (!h || !h.tipo) return "";

  const tipo = h.tipo.trim().toLowerCase();
  const categoria = (h.categoria || "").trim().toLowerCase();

  // Individual
  if (tipo === "individual") return "IND";

  // Doble estándar
  if (tipo === "doble" && categoria.includes("estandar")) return "DOBE";
  if (tipo === "doble" && categoria.includes("estándar")) return "DOBE";

  // Doble superior
  if (tipo === "doble" && categoria.includes("superior")) return "DOBS";

  // Familiar
  if (tipo === "familiar") return "FAM";

  // Suite
  if (tipo === "suite") return "SUITE";

  return "";
}

function establecerHabitaciones(habitaciones) {
  todasLasHabitaciones = habitaciones;
}

// =======================================================
// FILTRO POR CÓDIGO (IND / DOBE / DOBS / FAM / SUITE)
// =======================================================
function filtrarHabitacionesPorTipo(tipoSeleccionado) {
  if (!tipoSeleccionado || tipoSeleccionado === '') {
    return todasLasHabitaciones;
  }
  
  return todasLasHabitaciones.filter(h => {
    const codigo = normalizarTipo(h);
    return codigo === tipoSeleccionado;
  });
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
    
    
    const fechaDesdeInput = document.getElementById('desde') || document.getElementById('checkin');
    const fechaHastaInput = document.getElementById('hasta') || document.getElementById('checkout');
    
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

// =======================================================
// EXPONER A WINDOW para que sean accesibles desde otros módulos
// =======================================================
window.establecerHabitaciones = establecerHabitaciones;
window.filtrarHabitacionesPorTipo = filtrarHabitacionesPorTipo;
window.obtenerTipoFiltroActual = obtenerTipoFiltroActual;
window.establecerTipoFiltro = establecerTipoFiltro;
window.mostrarFiltro = mostrarFiltro;
window.ocultarFiltro = ocultarFiltro;
window.normalizarTipo = normalizarTipo;

