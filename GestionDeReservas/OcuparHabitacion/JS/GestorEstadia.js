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
    // Según diagrama: se puede ocupar si está LIBRE o RESERVADA
    // El estado se determina por las reservas, no por un campo de la habitación
    // -------------------------------------------------------
    static evaluarSeleccion(habitacion, fechasRango, reservas) {
        if (!habitacion) {
            return { ok: false, tipo: "sin-habitacion" };
        }

        console.log("🔍 Evaluando selección - Habitación:", habitacion);
        console.log("🔍 Fechas rango:", fechasRango);
        console.log("🔍 Reservas totales:", reservas.length);

        // ¿Engloba días OCUPADOS? (reservas con estado FINALIZADA)
        // Esto NO se permite ocupar
        const hayOcupado = fechasRango.some(f => 
            reservas.some(r => {
                const estadoReserva = (r.estado || "").toLowerCase().trim();
                const tieneHabitacion = r.habitaciones && r.habitaciones.some(h => h.numero === habitacion.numero);
                const fechaEnRango = compararFechas(f, r.fechaInicio) >= 0 && compararFechas(f, r.fechaFin) <= 0;
                
                return estadoReserva === "finalizada" && tieneHabitacion && fechaEnRango;
            })
        );

        if (hayOcupado) {
            console.log("❌ Hay días ocupados (reservas finalizadas)");
            return { ok: false, tipo: "dias-ocupados" };
        }

        // ¿Engloba días reservados? (reservas con estado PENDIENTE u otro)
        // Esto SÍ se permite ocupar, pero con confirmación
        // IMPORTANTE: Solo se puede ocupar si está RESERVADA (no disponible)
        const reservasAsociadas = reservas.filter(r => {
            const tieneHabitacion = r.habitaciones && r.habitaciones.some(h => h.numero === habitacion.numero);
            const fechaDesdeEnRango = compararFechas(fechasRango[0], r.fechaInicio) >= 0;
            const fechaHastaEnRango = compararFechas(fechasRango.at(-1), r.fechaFin) <= 0;
            const estadoReserva = (r.estado || "").toLowerCase().trim();
            
            // Solo considerar reservas que no estén finalizadas (Pendiente, Confirmada, etc.)
            return tieneHabitacion && fechaDesdeEnRango && fechaHastaEnRango && estadoReserva !== "finalizada";
        });

        if (reservasAsociadas.length > 0) {
            console.log("✅ Engloba reservas (se puede ocupar con confirmación):", reservasAsociadas);
            return {
                ok: true,
                tipo: "engloba-reservada",
                reservas: reservasAsociadas
            };
        }

        // Totalmente disponible (sin reservas en ese rango)
        // NO se permite ocupar habitaciones disponibles, solo reservadas
        console.log("❌ Habitación disponible (no reservada) - No se puede ocupar sin reserva");
        return { ok: false, tipo: "no-reservada" };
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
    // Crea el EstadiaDTO según el formato esperado por el backend
    // -------------------------------------------------------
    static async registrarOcupacion(habitacion, desde, hasta, titular, acompanantes, reservaAsociada) {
        // Validar que existe una reserva asociada (OBLIGATORIO)
        if (!reservaAsociada || !reservaAsociada.id) {
            console.error("❌ Error: La estadía debe tener una reserva asociada.");
            return { ok: false, mensaje: "La estadía debe estar asociada a una reserva." };
        }

        // Construir EstadiaDTO según el formato esperado por el backend
        // La reserva es OBLIGATORIA
        const estadiaDTO = {
            fechaCheckIn: desde,
            horaCheckIn: "14:00", // Hora por defecto para check-in
            fechaCheckOut: hasta,
            horaCheckOut: null,
            estado: "EnCurso",
            reserva: {
                id: reservaAsociada.id,
                fechaInicio: reservaAsociada.fechaInicio || reservaAsociada.desde,
                fechaFin: reservaAsociada.fechaFin || reservaAsociada.hasta,
                titular: reservaAsociada.titular || null,
                habitaciones: reservaAsociada.habitaciones || [],
                estado: reservaAsociada.estado || "Confirmada"
            },
            titular: titular, // Ya viene completo del backend con toda su estructura
            acompaniantes: acompanantes || [] // Ya vienen completos del backend
        };

        console.log("📤 EstadiaDTO a enviar:", estadiaDTO);

        try {
            const respuesta = await EstadiaDAO.guardarOcupacion(estadiaDTO);

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
