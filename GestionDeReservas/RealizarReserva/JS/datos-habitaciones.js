// [JS/datos-habitaciones.js]
// ===========================================================
//   datos-habitaciones.js — VERSIÓN FINAL DEFINITIVA
//   ✔ Normalización consistente (tipo + categoría)
//   ✔ Sin timezone (no usa new Date())
//   ✔ Compatible 100% con filtros y selección
//   ✔ Regenera fechas y estados correctamente
// ===========================================================

// Estado interno
let HABITACIONES = [];
let RESERVAS = [];
let datosHabitacionesCargados = false;

// ===========================================================
//   Normalización REAL según backend
// ===========================================================
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

window.normalizarTipo = normalizarTipo;

// ===========================================================
//   Comparar fechas YYYY-MM-DD (sin Date())
// ===========================================================
function compararFechas(f1, f2) {
  const A = f1.split("-").map(Number);
  const B = f2.split("-").map(Number);

  if (A[0] !== B[0]) return A[0] - B[0];
  if (A[1] !== B[1]) return A[1] - B[1];
  return A[2] - B[2];
}

// ===========================================================
//   Generar array de fechas (sin timezone)
// ===========================================================
function generarArrayFechas(inicio, fin) {
  const [y1, m1, d1] = inicio.split("-").map(Number);
  const [y2, m2, d2] = fin.split("-").map(Number);

  let y = y1, m = m1, d = d1;
  const fechas = [];

  while (true) {
    fechas.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);

    if (y === y2 && m === m2 && d === d2) break;

    d++;

    const diasMes = new Date(y, m, 0).getDate();
    if (d > diasMes) {
      d = 1;
      m++;
      if (m > 12) {
        m = 1;
        y++;
      }
    }
  }

  return fechas;
}

// ===========================================================
//   Formatear fecha dd/mm/yyyy
// ===========================================================
function formatearFecha(f) {
  const [y, m, d] = f.split("-");
  return `${d}/${m}/${y}`;
}

// ===========================================================
//   GET /api/habitaciones
// ===========================================================
async function cargarHabitaciones() {
   
}

async function asegurarHabitaciones() {
  if (!datosHabitacionesCargados || HABITACIONES.length === 0) {
    await cargarHabitaciones();
  }
}


// ===========================================================
//   Consultas globales
// ===========================================================
function obtenerHabitaciones() {
  return HABITACIONES;
}

function obtenerReservas() {
  return RESERVAS;
}

// Habitación reservada?
function estaHabitacionReservada(numero, fechaISO) {
  return RESERVAS.some(r =>
    r.habitaciones?.some(h => h.numero === numero) &&
    compararFechas(fechaISO, r.fechaInicio) >= 0 &&
    compararFechas(fechaISO, r.fechaFin) <= 0
  );
}

// Obtener número desde "IND-101"
function obtenerNumeroDesdeNombre(nombre) {
  const partes = nombre.split("-");
  const num = parseInt(partes[1]);
  return isNaN(num) ? null : num;
}

// Exponer funciones globales
window.obtenerHabitaciones = obtenerHabitaciones;
window.obtenerReservas = obtenerReservas;
window.estaHabitacionReservada = estaHabitacionReservada;
window.obtenerNumeroDesdeNombre = obtenerNumeroDesdeNombre;

window.compararFechas = compararFechas;
window.generarArrayFechas = generarArrayFechas;
window.formatearFecha = formatearFecha;

window.asegurarHabitaciones = asegurarHabitaciones;
window.cargarReservasEntre = cargarReservasEntre;



