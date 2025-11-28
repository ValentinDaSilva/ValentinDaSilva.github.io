// ===============================
//  datos-habitaciones.js (NUEVO)
// ===============================

let habitaciones = [];
let reservas = [];

// GET /api/habitaciones
async function cargarHabitaciones() {
  try {
    const respuesta = await fetch('http://localhost:8080/api/habitaciones');
    if (!respuesta.ok) throw new Error('Error en servidor');
    habitaciones = await respuesta.json();
  } catch (error) {
    console.error('Error al cargar habitaciones:', error);
    mensajeError('No se pudieron cargar las habitaciones desde el servidor.');
    habitaciones = [];
  }
}

// GET /api/reservas/entre?inicio=YYYY-MM-DD&fin=YYYY-MM-DD
async function cargarReservasEntreFechas(fechaInicio, fechaFin) {
  try {
    const url =
      `http://localhost:8080/api/reservas/entre?inicio=${fechaInicio}&fin=${fechaFin}`;

    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error('Error en servidor');

    reservas = await respuesta.json();
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    mensajeError('No se pudieron cargar las reservas desde el servidor.');
    reservas = [];
  }
}

function obtenerHabitaciones() {
  return habitaciones;
}

function obtenerReservas() {
  return reservas;
}

// Determina si esta habitación está reservada según los datos DEL BACKEND
function estaHabitacionReservada(numeroHabitacion, fecha) {
  return reservas.some(reserva =>
    reserva.habitaciones?.some(h => h.numero === numeroHabitacion) &&
    fecha >= reserva.fechaInicio &&
    fecha <= reserva.fechaFin
  );
}

// Formateos útiles
function obtenerNumeroDesdeNombre(nombreHabitacion) {
  const partes = nombreHabitacion.split('-');
  if (partes.length === 2) {
    const numero = parseInt(partes[1], 10);
    return isNaN(numero) ? null : numero;
  }
  return null;
}

function formatearNombreHabitacion(habitacion) {
  return `${habitacion.tipo}-${habitacion.numero}`;
}

// Generar secuencia de fechas
function generarArrayFechas(inicio, fin) {
  const fechas = [];
  const d1 = new Date(inicio);
  const d2 = new Date(fin);

  let fechaActual = new Date(d1);

  while (fechaActual <= d2) {
    const y = fechaActual.getFullYear();
    const m = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const d = String(fechaActual.getDate()).padStart(2, '0');
    fechas.push(`${y}-${m}-${d}`);
    fechaActual.setDate(fechaActual.getDate() + 1);
  }

  return fechas;
}

function formatearFechaParaMostrar(fecha) {
  const partes = fecha.split('-').map(Number);
  return `${String(partes[2]).padStart(2, '0')}/${String(partes[1]).padStart(2, '0')}/${partes[0]}`;
}

// Flag solo por compatibilidad
let datosCargados = false;

// Cargar habitaciones una sola vez
async function asegurarDatosCargados() {
  if (datosCargados && habitaciones.length > 0) return;
  await cargarHabitaciones();
  datosCargados = true;
}
