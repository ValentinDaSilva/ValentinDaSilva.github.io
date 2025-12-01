// [JS/gestor-realizar-reserva.js]
// ===============================================================
//   GestorRealizarReserva — ejecutor del caso de uso Reservar
//   ✔ Valida y normaliza la selección de habitaciones
//   ✔ Crea el modelo de dominio interno
//   ✔ Crea el/los DTO para el backend
//   ✔ Hace las llamadas fetch y actualiza la UI
// ===============================================================

export class GestorRealizarReserva {

  static validaarFechas(desde, hasta) {
    const fechaDesde = new Date(desde);
    const fechaHasta = new Date(hasta);
    if (!desde || !hasta) {
          mensajeError("Debes completar ambas fechas.");
          return false;
        }

        if (new Date(desde) >= new Date(hasta)) {
          mensajeError("La fecha de salida debe ser posterior a la de entrada.");
          return false;
        }

        // Limpio selección anterior, cargo datos y genero grilla
        if (typeof limpiarHabitacionesSeleccionadas === "function") {
            limpiarHabitacionesSeleccionadas();
        }
        return true;

  }
  // -----------------------------------------------------------
  // 1) Normalizar / validar selección proveniente de la UI
  //    listaSeleccion: [{ habitacion: "IND-101", fechaDesde, fechaHasta }, ...]
  // -----------------------------------------------------------
  extraerDatosSeleccion(listaSeleccion) {
    if (!Array.isArray(listaSeleccion) || listaSeleccion.length === 0) {
      throw new Error("No se recibieron habitaciones seleccionadas.");
    }

    return listaSeleccion.map(item => {
      const { habitacion, fechaDesde, fechaHasta } = item || {};

      if (!habitacion || !fechaDesde || !fechaHasta) {
        throw new Error("La selección de habitaciones es inválida.");
      }

      const numero = this.extraerNumero(habitacion);
      if (numero === null) {
        throw new Error(`No se pudo obtener el número de habitación desde "${habitacion}".`);
      }

      return {
        habitacion,    // "IND-101"
        numero,        // 101
        fechaDesde,    // "YYYY-MM-DD"
        fechaHasta     // "YYYY-MM-DD"
      };
    });
  }

  // -----------------------------------------------------------
  // 2) Crear modelo de dominio interno
  //    (podrías mapear esto 1:1 con tus clases Reserva/Habitacion/Titular)
  // -----------------------------------------------------------
  crearReservaDominio(seleccionNormalizada, datosTitular) {
    if (!datosTitular || !datosTitular.nombre || !datosTitular.apellido || !datosTitular.telefono) {
      throw new Error("Los datos del titular están incompletos.");
    }

    const titular = this.crearTitularDominio(datosTitular);

    // Dominio: una reserva por cada habitación seleccionada
    return seleccionNormalizada.map(sel => ({
      fechaInicio: sel.fechaDesde,
      fechaFin: sel.fechaHasta,
      titular: titular,
      estado: "PENDIENTE",
      habitaciones: [
        {
          numero: sel.numero
          // si más adelante querés: tipo, categoria, etc.
        }
      ]
    }));
  }

  // Titular en el modelo de dominio
  crearTitularDominio(t) {
    return {
      nombre: t.nombre,
      apellido: t.apellido,
      telefono: t.telefono
      // acá tranquilamente podrías agregar más campos (DNI, etc.) si después
      // se completan en la UI
    };
  }

  // -----------------------------------------------------------
  // 3) Crear DTO para el backend
  //    Ahora recibe el dominio, no la selección cruda
  // -----------------------------------------------------------
  crearReservaDTO(reservasDominio) {
    if (!Array.isArray(reservasDominio) || reservasDominio.length === 0) {
      throw new Error("No hay reservas en el modelo de dominio.");
    }

    return reservasDominio.map(r => ({
      fechaInicio: r.fechaInicio,
      fechaFin: r.fechaFin,
      titular: this.crearTitularDTO(r.titular),
      habitaciones: r.habitaciones.map(h => ({
        numero: h.numero
      }))
    }));
  }

  // DTO del titular para backend
  crearTitularDTO(t) {
    if (!t) return null;
    return {
      nombre: t.nombre,
      apellido: t.apellido,
      telefono: t.telefono
    };
  }

  // -----------------------------------------------------------
  // 4) Guardar en la BD (backend REST)
  //    Hace el POST de CADA reserva DTO
  // -----------------------------------------------------------
  async guardarEnBD(reservasDTO) {
    if (!Array.isArray(reservasDTO) || reservasDTO.length === 0) {
      throw new Error("No hay reservas para guardar.");
    }

    console.log("💾 Enviando reservas al backend…", reservasDTO);

    for (const reserva of reservasDTO) {
      const respuesta = await fetch("http://localhost:8080/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva)
      });

      if (!respuesta.ok) {
        // Podrías inspeccionar respuesta.status / respuesta.text()
        throw new Error("No se pudo crear la reserva en el backend.");
      }
    }

    // Si llegamos hasta acá, se crearon todas correctamente
    if (typeof mensajeCorrecto === "function") {
      mensajeCorrecto("Reservas creadas correctamente.");
    }

    // Limpiar selección y ocultar panel de resultados
    if (typeof limpiarHabitacionesSeleccionadas === "function") {
      limpiarHabitacionesSeleccionadas();
    }

    const cont = document.querySelector(".contenedor-resultados");
    if (cont) {
      cont.style.display = "none";
    }
  }

  // -----------------------------------------------------------
  // Utilidad: obtener número desde "TIPO-410"
  // -----------------------------------------------------------
  extraerNumero(nombreHabitacion) {
    // Si ya tenés la función global, podrías reutilizarla:
    if (typeof obtenerNumeroDesdeNombre === "function") {
      return obtenerNumeroDesdeNombre(nombreHabitacion);
    }

    const partes = (nombreHabitacion || "").split("-");
    const num = parseInt(partes[1]);
    return isNaN(num) ? null : num;
  }
}

// ---------------------------------------------------------------
// Exponer en window para poder jugar en consola si querés
// ---------------------------------------------------------------
window.GestorRealizarReserva = GestorRealizarReserva;
