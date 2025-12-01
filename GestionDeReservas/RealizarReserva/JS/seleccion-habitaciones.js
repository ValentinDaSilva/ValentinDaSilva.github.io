

// [JS/seleccion-habitaciones.js]
// ===========================================================
//   seleccion-habitaciones.js — VERSIÓN FINAL
//   ✔ Selección por rangos sin desplazar fechas
//   ✔ Compatible con códigos IND/DOBE/DOBS/FAM/SUITE
//   ✔ Sin alias (usa texto EXACTO de generar-tabla: "TIPO-101")
// ===========================================================

let HAB_SELECCIONADAS = [];
let inicioSeleccion = null;

// ===========================================================
//   Obtener lista actual
// ===========================================================
function obtenerHabitacionesSeleccionadas() {
  return HAB_SELECCIONADAS;
}

function limpiarHabitacionesSeleccionadas() {
  HAB_SELECCIONADAS = [];
  inicioSeleccion = null;

  document.querySelectorAll(".tabla-habitaciones td").forEach(celda => {
    if (!celda.dataset.estadoOriginal) return;

    celda.classList.remove("estado-seleccionada");
    celda.style.backgroundColor = "";

    celda.classList.add(
      celda.dataset.estadoOriginal === "reservada"
        ? "estado-reservada"
        : "estado-libre"
    );
  });

  aplicarEstilosCeldas();
}

// ===========================================================
//   Seleccionar rango
// ===========================================================
function seleccionarRango(nombreHabitacion, fechaDesde, fechaHasta) {
  if (compararFechas(fechaDesde, fechaHasta) > 0)
    [fechaDesde, fechaHasta] = [fechaHasta, fechaDesde];

  const numero = obtenerNumeroDesdeNombre(nombreHabitacion);
  const fechasRango = generarArrayFechas(fechaDesde, fechaHasta);

  // validar disponibilidad
  const todosLibres = fechasRango.every(fecha =>
    !estaHabitacionReservada(numero, fecha)
  );
  if (!todosLibres) {
    mensajeError("La habitación tiene días reservados en ese rango.");
    return;
  }

  // si ya existe → borrar antes
  deseleccionarRango(nombreHabitacion);

  HAB_SELECCIONADAS.push({ habitacion: nombreHabitacion, fechaDesde, fechaHasta });

  fechasRango.forEach(f => {
    const celda = document.querySelector(
      `.tabla-habitaciones td[data-numero-habitacion="${numero}"][data-fecha="${f}"]`
    );

    if (!celda) return;

    if (celda.dataset.estadoOriginal === "libre") {
      celda.classList.add("estado-seleccionada");
      celda.style.backgroundColor = "yellow";
    }
  });
}

function deseleccionarRango(nombreHabitacion) {
  const idx = HAB_SELECCIONADAS.findIndex(s => s.habitacion === nombreHabitacion);
  if (idx === -1) return;

  const seleccion = HAB_SELECCIONADAS[idx];
  HAB_SELECCIONADAS.splice(idx, 1);

  const numero = obtenerNumeroDesdeNombre(nombreHabitacion);
  const fechas = generarArrayFechas(seleccion.fechaDesde, seleccion.fechaHasta);

  fechas.forEach(f => {
    const celda = document.querySelector(
      `.tabla-habitaciones td[data-numero-habitacion="${numero}"][data-fecha="${f}"]`
    );
    if (!celda) return;

    celda.classList.remove("estado-seleccionada");
    celda.style.backgroundColor = "";

    celda.classList.add(
      celda.dataset.estadoOriginal === "reservada"
        ? "estado-reservada"
        : "estado-libre"
    );
  });

  aplicarEstilosCeldas();
}

// ===========================================================
//   Click en celda
// ===========================================================
function manejarClickCelda(celda) {
  if (celda.dataset.estadoOriginal === "reservada") return;

  const numero = celda.dataset.numeroHabitacion;
  const fecha = celda.dataset.fecha;

  // Obtener nombre TIPO-101 desde el header
  let nombreHab = null;
  const headers = document.querySelectorAll(".tabla-habitaciones thead th");

  for (let i = 1; i < headers.length; i++) {
    const texto = headers[i].textContent.trim(); // "IND-101"
    const partes = texto.split("-");
    if (partes.length === 2 && partes[1] === numero) {
      nombreHab = texto;
      break;
    }
  }

  if (!nombreHab) return;

  const seleccionado = HAB_SELECCIONADAS.find(s => s.habitacion === nombreHab);

  // si ya estaba seleccionado y clic dentro → deselecciona
  if (seleccionado) {
    if (
      compararFechas(fecha, seleccionado.fechaDesde) >= 0 &&
      compararFechas(fecha, seleccionado.fechaHasta) <= 0
    ) {
      deseleccionarRango(nombreHab);
      inicioSeleccion = null;
      return;
    }
  }

  // si ya hay un inicio en la misma habitación → cerrar rango
  if (inicioSeleccion && inicioSeleccion.habitacion === nombreHab) {
    seleccionarRango(nombreHab, inicioSeleccion.fecha, fecha);
    inicioSeleccion = null;
    return;
  }

  // iniciar selección
  inicioSeleccion = { habitacion: nombreHab, fecha };
}

// ===========================================================
//   Inicialización
// ===========================================================
function inicializarSeleccionHabitaciones() {
  limpiarHabitacionesSeleccionadas();

  const celdas = document.querySelectorAll(".tabla-habitaciones tbody td");
  celdas.forEach(c => {
    if (c.cellIndex === 0) return;

    const nuevo = c.cloneNode(true);
    nuevo.dataset.numeroHabitacion = c.dataset.numeroHabitacion;
    nuevo.dataset.fecha = c.dataset.fecha;
    nuevo.dataset.estadoOriginal = c.dataset.estadoOriginal;
    nuevo.className = c.className;

    c.parentNode.replaceChild(nuevo, c);
  });

  document.querySelectorAll(".tabla-habitaciones tbody td").forEach(c => {
    if (c.cellIndex === 0) return;

    if (c.dataset.estadoOriginal == "libre") {
      c.addEventListener("click", () => manejarClickCelda(c));
      c.style.cursor = "pointer";
    }
  });
}

// Exponer
window.obtenerHabitacionesSeleccionadas = obtenerHabitacionesSeleccionadas;
window.limpiarHabitacionesSeleccionadas = limpiarHabitacionesSeleccionadas;
window.inicializarSeleccionHabitaciones = inicializarSeleccionHabitaciones;



