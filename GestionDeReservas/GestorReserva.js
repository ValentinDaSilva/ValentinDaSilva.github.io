// GestorReserva.js
// =======================================================
// GestorReserva
//  - Valida rango de fechas
//  - Obtiene estado de habitaciones (HabitacionDAO, ReservaDAO)
//  - Crea reservas (dominio + DTO)
//  - Llama a ReservaDAO para guardar
// =======================================================

import { HabitacionDAO } from "./HabitacionDAO.js";
import { ReservaDAO } from "./ReservaDAO.js";

class GestorReserva {

  // ---------------------------------------------------
  // Validar rango de fechas
  // ---------------------------------------------------
  static validarRangoFechas(desde, hasta, ui) {
    if (!desde || !hasta) {
      ui.mostrarError("Debes completar ambas fechas.");
      return false;
    }

    const d1 = new Date(desde);
    const d2 = new Date(hasta);

    if (d1 >= d2) {
      ui.mostrarError("La fecha de salida debe ser posterior a la de entrada.");
      const checkinInput = document.getElementById("fecha-desde");
      const checkoutInput = document.getElementById("fecha-hasta");
      if (checkinInput) checkinInput.value = "";
      if (checkoutInput) checkoutInput.value = "";
      if (checkinInput) checkinInput.focus();
      return false;
    }

    if (typeof limpiarHabitacionesSeleccionadas === "function") {
      limpiarHabitacionesSeleccionadas();
    }

    return true;
  }

  // ---------------------------------------------------
  // Obtener estado de habitaciones (CU05)
  // ---------------------------------------------------
  static async obtenerEstadoHabitaciones(desde, hasta, ui) {
    console.log("🔍 Obteniendo estado de habitaciones entre", desde, "y", hasta);
    try {
      let listaReservas = await HabitacionDAO.listarHabitaciones();

      let listarHabitaciones = await ReservaDAO.buscarReservasEntre(desde, hasta);
      let huboLibre = false; 
      if (typeof generarTablaHabitaciones === "function") {
          huboLibre = generarTablaHabitaciones(desde, hasta);
      }
      if(huboLibre === false){
        ui.mostrarError("No hay habitaciones disponibles en el rango de fechas seleccionado.");
        return;
      }
      ui.mostrarGrilla();

    } catch (error) {
      console.error("❌ Error en obtenerEstadoHabitaciones():", error);
      ui.mostrarError("No se pudo mostrar el estado de las habitaciones.");
    }

  }

  // ---------------------------------------------------
  // Crear reserva (CU04)
  // listaSeleccion = [{ habitacion: "IND-101", fechaDesde, fechaHasta }]
  // ---------------------------------------------------
  static async crearReserva(listaSeleccion, titular, desde, hasta, ui) {
    try {
      if (!Array.isArray(listaSeleccion) || listaSeleccion.length === 0) {
        ui.mostrarError("Debe seleccionar al menos una habitación.");
        return;
      }

      if (!titular || !titular.nombre || !titular.apellido || !titular.telefono) {
        ui.mostrarError("Debe completar los datos obligatorios del titular.");
        return;
      }

      const seleccionNormalizada = GestorReserva.extraerDatosSeleccion(listaSeleccion);
      const reservasDominio = GestorReserva.crearReservaDominio(seleccionNormalizada, titular);
      const reservasDTO = GestorReserva.crearReservaDTO(reservasDominio);

      await GestorReserva.guardarEnBD(reservasDTO);

      ui.mostrarReservaExitosa();

    } catch (error) {
      console.error("❌ Error en crearReserva():", error);
      ui.mostrarError("No se pudo completar la reserva: " + error.message);
    }
  }

  // ---------------------------------------------------
  // Helpers internos (sin guiones bajos en el nombre)
  // ---------------------------------------------------
  static extraerDatosSeleccion(listaSeleccion) {
    return listaSeleccion.map(item => {
      const { habitacion, fechaDesde, fechaHasta } = item || {};

      if (!habitacion || !fechaDesde || !fechaHasta) {
        throw new Error("La selección de habitaciones es inválida.");
      }

      const numero = GestorReserva.extraerNumero(habitacion);
      if (numero === null) {
        throw new Error(`No se pudo obtener el número de habitación desde "${habitacion}".`);
      }

      return {
        habitacion,
        numero,
        fechaDesde,
        fechaHasta
      };
    });
  }

  static crearReservaDominio(seleccionNormalizada, titular) {
    const titularDominio = {
      nombre: titular.nombre,
      apellido: titular.apellido,
      telefono: titular.telefono
    };

    return seleccionNormalizada.map(sel => ({
      fechaInicio: sel.fechaDesde,
      fechaFin: sel.fechaHasta,
      titular: titularDominio,
      estado: "PENDIENTE",
      habitaciones: [
        { numero: sel.numero }
      ]
    }));
  }

  static crearReservaDTO(reservasDominio) {
    if (!Array.isArray(reservasDominio) || reservasDominio.length === 0) {
      throw new Error("No hay reservas en el modelo de dominio.");
    }

    return reservasDominio.map(r => ({
      fechaInicio: r.fechaInicio,
      fechaFin: r.fechaFin,
      titular: {
        nombre: r.titular.nombre,
        apellido: r.titular.apellido,
        telefono: r.titular.telefono
      },
      habitaciones: r.habitaciones.map(h => ({
        numero: h.numero
      }))
    }));
  }

  static async guardarEnBD(reservasDTO) {
    if (!Array.isArray(reservasDTO) || reservasDTO.length === 0) {
      throw new Error("No hay reservas para guardar.");
    }

    for (const reserva of reservasDTO) {
      await ReservaDAO.guardarReserva(reserva);
    }
  }

  static extraerNumero(nombreHabitacion) {
    if (typeof obtenerNumeroDesdeNombre === "function") {
      return obtenerNumeroDesdeNombre(nombreHabitacion);
    }

    const partes = (nombreHabitacion || "").split("-");
    const num = parseInt(partes[1]);
    return isNaN(num) ? null : num;
  }
}

export { GestorReserva };
window.GestorReserva = GestorReserva;
