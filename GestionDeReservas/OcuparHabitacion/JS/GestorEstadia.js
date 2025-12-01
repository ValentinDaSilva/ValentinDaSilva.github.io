// OcuparHabitacion/JS/GestorEstadia.js
// ===========================================================
//       GESTOR ESTADIA  (CU07 – OCUPAR HABITACIÓN)
//       Sigue el diagrama de secuencia propuesto
//       Coordina: HabitacionDAO, ReservaDAO, HuespedDAO, EstadiaDAO
// ===========================================================

import { EstadiaDAO } from "../../EstadiaDAO.js";
import { HabitacionDAO } from "../../HabitacionDAO.js";
import { ReservaDAO } from "../../ReservaDAO.js";
import { HuespedDAO } from "../../HuespedDAO.js";

// OJO: usa compararFechas y generarArrayFechas de datos-habitaciones.js

class GestorEstadia {
    
    // -------------------------------------------------------
    // VALIDAR RANGO DE FECHAS
    // -------------------------------------------------------
    static validarRangoFechas(desde, hasta) {
        if (!desde || !hasta) {
            return { ok: false, mensaje: "Debe ingresar ambas fechas." };
        }

        const d1 = new Date(desde);
        const d2 = new Date(hasta);

        if (d1 >= d2) {
            return { ok: false, mensaje: "La fecha de egreso debe ser posterior a la de ingreso." };
        }

        return { ok: true };
    }

    // -------------------------------------------------------
    // OBTENER ESTADO HABITACIONES (CU05)
    // -------------------------------------------------------
    static async obtenerEstadoHabitaciones(desde, hasta) {
        try {
            const habitaciones = await HabitacionDAO.listarHabitaciones();
            const reservas     = await ReservaDAO.buscarReservasEntre(desde, hasta);

            return {
                ok: true,
                listaHabitaciones: habitaciones,
                listaReservas: reservas
            };

        } catch (e) {
            console.error("❌ Error obteniendo estado de habitaciones:", e);
            return { ok: false, mensaje: "No se pudo obtener el estado de habitaciones." };
        }
    }

    // -------------------------------------------------------
    // EVALUAR HABITACIÓN SELECCIONADA
    // -------------------------------------------------------
    static evaluarSeleccion(habitacion, fechasRango, reservas) {
        if (!habitacion) {
            return { ok: false, tipo: "sin-habitacion" };
        }

        let estado = (habitacion.estado || "")
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "")
            .replace(/_/g, "");

        // Solo se permite ocupar si está LIBRE o RESERVADA
        if (estado !== "libre" && estado !== "reservada") {
            return { ok: false, tipo: "estado-no-permitido" };
        }

        // ¿Engloba días OCUPADOS? (r.estado FINALIZADA)
        const hayOcupado = fechasRango.some(f => 
            reservas.some(r =>
                (r.estado || "").toLowerCase() === "finalizada" &&
                compararFechas(f, r.fechaInicio) >= 0 &&
                compararFechas(f, r.fechaFin)   <= 0 &&
                r.habitaciones.some(h => h.numero === habitacion.numero)
            )
        );

        if (hayOcupado) {
            return { ok: false, tipo: "dias-ocupados" };
        }

        // ¿Engloba días reservados? (válido, pero con reserva asociada)
        const reservasAsociadas = reservas.filter(r =>
            r.habitaciones.some(h => h.numero === habitacion.numero) &&
            compararFechas(fechasRango[0],       r.fechaInicio) >= 0 &&
            compararFechas(fechasRango.at(-1),   r.fechaFin)    <= 0
        );

        if (reservasAsociadas.length > 0) {
            return {
                ok: true,
                tipo: "engloba-reservada",
                reservas: reservasAsociadas
            };
        }

        // Totalmente disponible
        return { ok: true, tipo: "disponible" };
    }

    // -------------------------------------------------------
    // BUSCAR HUÉSPEDES (para titular y acompañantes)
    // -------------------------------------------------------
    static async buscarHuespedes(criterios) {
        try {
            const huespedes = await HuespedDAO.buscarHuespedes(criterios);
            return {
                ok: true,
                listaHuespedes: huespedes
            };
        } catch (e) {
            console.error("❌ Error buscando huéspedes:", e);
            return { ok: false, mensaje: "No se pudieron buscar los huéspedes." };
        }
    }

    // -------------------------------------------------------
    // REGISTRAR OCUPACIÓN (CU07)
    // -------------------------------------------------------
    static async registrarOcupacion(habitacion, desde, hasta, titular, acompanantes, reservaAsociada) {
        const estadiaDominio = {
            fechaInicio: desde,
            fechaFin:   hasta,
            habitacion: { numero: habitacion.numero },
            titular: titular,
            acompanantes: acompanantes || [],
            reservaAsociada: reservaAsociada ? reservaAsociada.id : null
        };

        try {
            const respuesta = await EstadiaDAO.guardarOcupacion(estadiaDominio);

            if (!respuesta || !respuesta.ok) {
                console.error("❌ Error al registrar ocupación en backend:", respuesta?.error);
                return { ok: false, mensaje: respuesta?.error || "Fallo al registrar ocupación." };
            }

            return { ok: true, data: respuesta.data };

        } catch (e) {
            console.error("❌ Error registrando ocupación:", e);
            return { ok: false, mensaje: "No se pudo registrar la ocupación." };
        }
    }
}

export { GestorEstadia };
window.GestorEstadia = GestorEstadia;
