// ====================================================
//    filtro-habitaciones.js — versión FINAL DEFINITIVA
// ====================================================

// Lista completa de habitaciones (sin filtrar)
let TODAS_LAS_HABITACIONES = [];

// Valor del filtro actual seleccionado
let TIPO_FILTRO = "";

// =======================================================
// NORMALIZACIÓN DEFINITIVA (tipo + categoría)
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

  // Familiar (Family Plan)
  if (tipo === "familiar") return "FAM";

  // Suite
  if (tipo === "suite") return "SUITE";

  return "";
}

// =======================================================
// Guardamos TODAS las habitaciones crudas del backend
// =======================================================
function establecerHabitaciones(lista) {
  TODAS_LAS_HABITACIONES = Array.isArray(lista) ? lista : [];
}

// =======================================================
// FILTRO POR CÓDIGO (IND / DOBE / DOBS / FAM / SUITE)
// =======================================================
function filtrarHabitacionesPorTipo(tipoSeleccionado) {
  if (!tipoSeleccionado) return TODAS_LAS_HABITACIONES;

  return TODAS_LAS_HABITACIONES.filter(h => {
    const codigo = normalizarTipo(h);
    return codigo === tipoSeleccionado;
  });
}

function obtenerTipoFiltroActual() {
  return TIPO_FILTRO;
}

function establecerTipoFiltro(tipo) {
  TIPO_FILTRO = tipo;
}

// =======================================================
// Mostrar / ocultar filtro
// =======================================================
function mostrarFiltro() {
  const box = document.getElementById("contenedor-filtro");
  if (box) box.style.display = "flex";
}

function ocultarFiltro() {
  const box = document.getElementById("contenedor-filtro");
  if (box) box.style.display = "none";
}

// =======================================================
// Inicializar <select>
// =======================================================
function inicializarFiltro() {
  const select = document.getElementById("filtro-tipo-habitacion");
  if (!select) return;

  select.addEventListener("change", () => {
    establecerTipoFiltro(select.value);

    const f1 = document.getElementById("fecha-desde").value;
    const f2 = document.getElementById("fecha-hasta").value;

    if (f1 && f2) {
      generarTablaHabitaciones(f1, f2);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarFiltro);
} else {
  inicializarFiltro();
}

// =======================================================
// EXPONER A WINDOW
// =======================================================
window.establecerHabitaciones = establecerHabitaciones;
window.filtrarHabitacionesPorTipo = filtrarHabitacionesPorTipo;
window.obtenerTipoFiltroActual = obtenerTipoFiltroActual;
window.establecerTipoFiltro = establecerTipoFiltro;
window.mostrarFiltro = mostrarFiltro;
window.ocultarFiltro = ocultarFiltro;
window.normalizarTipo = normalizarTipo;

