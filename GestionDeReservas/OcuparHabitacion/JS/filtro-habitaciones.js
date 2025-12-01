
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
    
    // Intentar obtener las fechas de window primero (las que se usaron para generar la tabla)
    let fechaDesde = window.desdeCU07;
    let fechaHasta = window.hastaCU07;
    
    // Si no están en window, intentar obtenerlas de los inputs
    if (!fechaDesde || !fechaHasta) {
      const fechaDesdeInput = document.getElementById('desde') || document.getElementById('checkin');
      const fechaHastaInput = document.getElementById('hasta') || document.getElementById('checkout');
      
      if (fechaDesdeInput && fechaHastaInput && fechaDesdeInput.value && fechaHastaInput.value) {
        fechaDesde = fechaDesdeInput.value;
        fechaHasta = fechaHastaInput.value;
      }
    }
    
    if (fechaDesde && fechaHasta) {
      // Regenerar la tabla con el filtro aplicado
      if (typeof generarTablaHabitaciones === 'function') {
        generarTablaHabitaciones(fechaDesde, fechaHasta);
      } else {
        console.error('La función generarTablaHabitaciones no está disponible');
      }
    } else {
      console.warn('No se pueden obtener las fechas para regenerar la tabla');
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
window.inicializarFiltro = inicializarFiltro;

