// [JS/generar-tabla.js]
// ========================================================
//   generar-tabla.js — VERSIÓN FINAL ULTRA CORREGIDA
//   ✔ Soporta estados: libre / reservada / ocupada / fuera de servicio
//   ✔ Ordena habitaciones por tipo normalizado + número
//   ✔ Respeta filtros
//   ✔ NO PINTA OCUPADA A MENOS QUE LA RESERVA ESTÉ FINALIZADA
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

  // Normalizar cada habitación → agregar codigoTipo
  habitaciones = habitaciones.map(h => ({
    ...h,
    codigoTipo: normalizarTipo(h)
  }));

  // =====================================================
  // ORDENAR HABITACIONES SOLO POR NÚMERO
  // =====================================================
  habitaciones.sort((a, b) => {
    const numA = Number(a.numero);
    const numB = Number(b.numero);

    if (isNaN(numA) || isNaN(numB)) {
      return String(a.numero).localeCompare(String(b.numero));
    }

    return numA - numB;
  });

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

      // Normalizar estado básico del backend
      let estadoBase = (h.estado || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/_/g, "")
        .replace(/-/g, "");

      // ---------------------------------------------
      // PRIORIDAD 1: Fuera de servicio
      // ---------------------------------------------
      if (estadoBase === "fueradeservicio") {
        td.className = "estado-fuera-servicio";
        td.dataset.estadoOriginal = "fueraservicio";
      }

      // ---------------------------------------------
      // PRIORIDAD 2: Habitaciones “ocupadas POR UNA RESERVA FINALIZADA”
      // ---------------------------------------------
      else {
        const reservaAsociada = obtenerReservas().find(r =>
          r.habitaciones?.some(hab => hab.numero === h.numero) &&
          compararFechas(fechaISO, r.fechaInicio) >= 0 &&
          compararFechas(fechaISO, r.fechaFin) <= 0
        );

        if (reservaAsociada) {
          const estadoReserva = (reservaAsociada.estado || "").trim().toUpperCase();

          if (estadoReserva === "FINALIZADA") {
            td.className = "estado-ocupada";
            td.dataset.estadoOriginal = "ocupada";
          } else {
            td.className = "estado-reservada";
            td.dataset.estadoOriginal = "reservada";
          }
        } else {
          td.className = "estado-libre";
          td.dataset.estadoOriginal = "libre";
        }
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
