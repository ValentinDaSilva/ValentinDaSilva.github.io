
// [JS/generar-tabla.js]
// ========================================================
//   generar-tabla.js — VERSIÓN FINAL DEFINITIVA
//   ✔ Usa normalizarTipo() para obtener IND/DOBE/DOBS/FAM/SUITE
//   ✔ No redeclara variables globales
//   ✔ No usa MAPA duplicado (se elimina por completo)
// ========================================================

function generarTablaHabitaciones(fechaInicio, fechaFin) {
  const tabla = document.querySelector(".tabla-habitaciones");
  if (!tabla) {
    console.error("Tabla de habitaciones no encontrada");
    return;
  }

  const thead = tabla.querySelector("thead");
  const tbody = tabla.querySelector("tbody");

  if (!thead || !tbody) {
    console.error("thead o tbody no encontrados");
    return;
  }

  // ----------------------------------------
  // 1) Obtener habitaciones del backend
  // ----------------------------------------
  let habitaciones = obtenerHabitaciones() || [];

  // GUARDAR COPIA GLOBAL PARA EL FILTRO
  establecerHabitaciones(habitaciones);

  // Aplicar el filtro seleccionado
  const tipoFiltro = obtenerTipoFiltroActual();
  if (tipoFiltro) {
    habitaciones = filtrarHabitacionesPorTipo(tipoFiltro);
  }

  // Normalizar cada habitación (agrega h.codigoTipo)
  habitaciones = habitaciones.map(h => ({
    ...h,
    codigoTipo: normalizarTipo(h) // IND / DOBE / DOBS / FAM / SUITE
  }));

  // Crear rango de fechas
  const fechas = generarArrayFechas(fechaInicio, fechaFin);

  // LIMPIAR tabla
  thead.innerHTML = "";
  tbody.innerHTML = "";

  if (!habitaciones.length || !fechas.length) return;

  // ----------------------------------------
  // 2) CABECERA
  // ----------------------------------------
  const headerRow = document.createElement("tr");

  const thFecha = document.createElement("th");
  thFecha.textContent = "Fecha \\ Habitación";
  headerRow.appendChild(thFecha);

  habitaciones.forEach(h => {
    const th = document.createElement("th");

    // TEXTO FINAL: "IND-103"
    th.textContent = `${h.codigoTipo}-${h.numero}`;
    th.dataset.tipoHabitacion = h.codigoTipo;

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);

  // Mostrar filtro
  mostrarFiltro();

  // ----------------------------------------
  // 3) FILAS POR FECHA
  // ----------------------------------------
  fechas.forEach(fechaISO => {
    const fila = document.createElement("tr");

    // Celda de fecha
    const tdFecha = document.createElement("td");
    tdFecha.textContent = formatearFecha(fechaISO);
    fila.appendChild(tdFecha);

    habitaciones.forEach(h => {
      const td = document.createElement("td");

      // ¿Está reservada?
      if (estaHabitacionReservada(h.numero, fechaISO)) {
        td.className = "estado-reservada";
        td.dataset.estadoOriginal = "reservada";
      } else {
        td.className = "estado-libre";
        td.dataset.estadoOriginal = "libre";
      }

      td.dataset.numeroHabitacion = h.numero;
      td.dataset.fecha = fechaISO;

      fila.appendChild(td);
    });

    tbody.appendChild(fila);
  });

  // ----------------------------------------
  // 4) Estilado + selección
  // ----------------------------------------
  aplicarEstilosCeldas();
  inicializarSeleccionHabitaciones();
}

// Exponer globalmente
window.generarTablaHabitaciones = generarTablaHabitaciones;


