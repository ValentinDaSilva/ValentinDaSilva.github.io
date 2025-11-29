// GestorReserva.js
// =====================================================================
//  GestorReserva.js
//  ✔ Orquestador del proceso de reserva
//  ✔ Solo tiene un método: realizarReserva()
//  ✔ Toda la lógica REAL la hace GestorRealizarReserva
// =====================================================================

import { GestorRealizarReserva } from "./JS/gestor-realizar-reserva.js";

  export default class GestorReserva {

      static async buscarReservaEntreDosFechas() {
        try {
                const desde = document.getElementById("fecha-desde").value;
                const hasta = document.getElementById("fecha-hasta").value;

                exito = GestorRealizarReserva.validaarFechas(desde, hasta);

                if(exito === false) return;
                else{
                    await asegurarHabitaciones();
                    await cargarReservasEntre(desde, hasta);
                    generarTablaHabitaciones(desde, hasta);
                    const cont = document.querySelector(".contenedor-resultados");
                    if (cont) cont.style.display = "block";
                }


        } catch (error) {
          console.error("❌ Error en buscarReservaEntreDosFechas():", error);
          mensajeError("No se pudo buscar las reservas: " + error.message);
        }
      }
      
      static async realizarReserva(listaSeleccion, datosTitular) {
        try {

          const gestor = new GestorRealizarReserva();

          buscarReservaEntreDosFechas();

          // 1) Extraer datos desde la selección de la UI
          const datosSeleccion = gestor.extraerDatosSeleccion(listaSeleccion);

          // 2) Crear dominio interno
          const reservasDominio = gestor.crearReservaDominio(datosSeleccion, datosTitular);

          // 3) Crear DTO final para el backend
          const reservasDTO = gestor.crearReservaDTO(reservasDominio);

          // 4) Guardar cada reserva en el backend
          await gestor.guardarEnBD(reservasDTO);

          return true;

        } catch (error) {
          console.error("❌ Error en realizarReserva():", error);
          mensajeError("No se pudo completar la reserva: " + error.message);
          return false;
        }
      }

}

window.GestorReserva = GestorReserva;
