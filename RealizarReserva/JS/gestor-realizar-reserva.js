
// [JS/gestor-realizar-reserva.js]
// ===============================================================
//   gestor-realizar-reserva.js — Opción B (versión nueva y limpia)
//   Se encarga SOLO de armar el DTO correctamente
// ===============================================================

// ---------------------------------------------------------------
// Clase para gestionar reservas
// ---------------------------------------------------------------
export class GestorRealizarReserva {

  // -----------------------------
  // Crear DTO principal
  // -----------------------------
  crearReservaDTO(seleccion, titular) {
    // selección viene así:
    // [
    //   { habitacion: "DOBLE-103", fechaDesde: "2025-01-10", fechaHasta: "2025-01-12" }
    // ]

    return seleccion.map(sel => ({
      fechaInicio: sel.fechaDesde,
      fechaFin: sel.fechaHasta,
      titular: this.crearTitularDTO(titular),
      habitaciones: [
        {
          numero: this.extraerNumero(sel.habitacion)
        }
      ]
    }));
  }

  // -----------------------------
  // DTO del titular
  // -----------------------------
  crearTitularDTO(t) {
    return {
      nombre: t.nombre,
      apellido: t.apellido,
      telefono: t.telefono
    };
  }

  // -----------------------------
  // obtener número desde "TIPO-410"
  // -----------------------------
  extraerNumero(nombreHabitacion) {
    const partes = nombreHabitacion.split("-");
    const num = parseInt(partes[1]);
    return isNaN(num) ? null : num;
  }
}

// ---------------------------------------------------------------
// Exponer en window para acceso externo (opcional)
// ---------------------------------------------------------------
window.GestorRealizarReserva = GestorRealizarReserva;



