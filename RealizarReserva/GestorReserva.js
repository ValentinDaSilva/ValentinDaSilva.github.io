// GestorReserva.js
// =====================================================================
//  GestorReserva.js
//  ✔ Orquestador del proceso de reserva
//  ✔ Solo tiene un método: realizarReserva()
//  ✔ Toda la lógica REAL la hace GestorRealizarReserva
// =====================================================================

import { GestorRealizarReserva } from "./JS/gestor-realizar-reserva.js";

export default class GestorReserva {

  /**
   * Método ÚNICO del orquestador.
   *
   * @param {Array} listaSeleccion  [{habitacion: 'IND-101', fechaDesde:..., fechaHasta:...}, ...]
   * @param {Object} datosTitular   {nombre, apellido, telefono}
   */
  static async realizarReserva(listaSeleccion, datosTitular) {
    try {
      console.log("▶ Iniciando GestorReserva.realizarReserva()");

      const gestor = new GestorRealizarReserva();

      // 1) Extraer datos desde la selección de la UI
      const datosSeleccion = gestor.extraerDatosSeleccion(listaSeleccion);
      console.log("1️⃣ Datos de selección:", datosSeleccion);

      // 2) Crear dominio interno
      const reservasDominio = gestor.crearReservaDominio(datosSeleccion, datosTitular);
      console.log("2️⃣ Modelo de dominio:", reservasDominio);

      // 3) Crear DTO final para el backend
      const reservasDTO = gestor.crearReservaDTO(reservasDominio);
      console.log("3️⃣ DTO final:", reservasDTO);

      // 4) Guardar cada reserva en el backend
      await gestor.guardarEnBD(reservasDTO);

      console.log("✔ Reserva(s) creada(s) correctamente.");
      return true;

    } catch (error) {
      console.error("❌ Error en realizarReserva():", error);
      mensajeError("No se pudo completar la reserva: " + error.message);
      return false;
    }
  }

}

window.GestorReserva = GestorReserva;
