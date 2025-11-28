// GestorReserva.js
// =====================================================================
//  GestorReserva.js
//  ✔ Orquestador del proceso de reserva
//  ✔ Tiene un único método público: realizarReserva(listaSeleccion, datosTitular)
//  ✔ Toda la lógica REAL la hace GestorRealizarReserva
// =====================================================================

import { GestorRealizarReserva } from "./JS/gestor-realizar-reserva.js";

export default class GestorReserva {

  
  static async realizarReserva(listaSeleccion, datosTitular) {

    try {
      const gestorRealizarReserva = new GestorRealizarReserva();

      
      const seleccionNormalizada = gestorRealizarReserva.extraerDatosSeleccion(listaSeleccion);

      const reservasDominio = gestorRealizarReserva.crearReservaDominio(seleccionNormalizada, datosTitular);

      const reservasDTO = gestorRealizarReserva.crearReservaDTO(reservasDominio);

      await gestor.guardarEnBD(reservasDTO);

      return true;

    } catch (error) {
      
      if (typeof mensajeError === "function") {
        mensajeError("No se pudo completar la reserva: " + (error.message || error));
      }
      return false;

    }
  }
}

// Lo dejo también accesible desde window por si querés usarlo en consola
window.GestorReserva = GestorReserva;
