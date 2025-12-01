// OcuparHabitacion/JS/GestorEstadia.js
// ===========================================================
//       GESTOR ESTADIA  (CU07 – OCUPAR HABITACIÓN)
//       Sigue el diagrama de secuencia propuesto
//       Coordina: HabitacionDAO, ReservaDAO, HuespedDAO, EstadiaDAO
// ===========================================================

import { EstadiaDAO } from "./EstadiaDAO.js";
import { HabitacionDAO } from "./HabitacionDAO.js";
import { ReservaDAO } from "./ReservaDAO.js";
import { HuespedDAO } from "./HuespedDAO.js";

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
            console.log("🔍 GestorEstadia.obtenerEstadoHabitaciones - Fechas:", { desde, hasta });
            
            const habitaciones = await HabitacionDAO.listarHabitaciones();
            console.log("🔍 GestorEstadia - Habitaciones obtenidas:", habitaciones.length);
            
            const reservas = await ReservaDAO.buscarReservasEntre(desde, hasta);
            console.log("🔍 GestorEstadia - Reservas obtenidas:", reservas.length);
            console.log("🔍 GestorEstadia - Reservas completas:", reservas);

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
        // NUEVA RESTRICCIÓN: Las fechas deben coincidir EXACTAMENTE con la reserva
        const reservasAsociadas = reservas.filter(r => {
            const tieneHabitacion = r.habitaciones && r.habitaciones.some(h => h.numero === habitacion.numero);
            const fechaDesdeEnRango = compararFechas(fechasRango[0], r.fechaInicio) >= 0;
            const fechaHastaEnRango = compararFechas(fechasRango.at(-1), r.fechaFin) <= 0;
            const estadoReserva = (r.estado || "").toLowerCase().trim();
            
            // Solo considerar reservas que no estén finalizadas (Pendiente, Confirmada, etc.)
            return tieneHabitacion && fechaDesdeEnRango && fechaHastaEnRango && estadoReserva !== "finalizada";
        });

        if (reservasAsociadas.length > 0) {
            // Verificar que las fechas coincidan EXACTAMENTE con la reserva
            const reserva = reservasAsociadas[0];
            const fechaInicioReserva = reserva.fechaInicio || reserva.desde;
            const fechaFinReserva = reserva.fechaFin || reserva.hasta;
            const fechaInicioSeleccion = fechasRango[0];
            const fechaFinSeleccion = fechasRango.at(-1);
            
            // Comparar fechas exactas
            const inicioExacto = compararFechas(fechaInicioSeleccion, fechaInicioReserva) === 0;
            const finExacto = compararFechas(fechaFinSeleccion, fechaFinReserva) === 0;
            
            if (!inicioExacto || !finExacto) {
                console.log("❌ Las fechas seleccionadas no coinciden exactamente con la reserva");
                return {
                    ok: false,
                    tipo: "fechas-no-exactas",
                    reserva: reserva,
                    fechaInicioReserva: fechaInicioReserva,
                    fechaFinReserva: fechaFinReserva
                };
            }
            
            console.log("✅ Engloba reservas y fechas coinciden exactamente:", reservasAsociadas);
            return {
                ok: true,
                tipo: "engloba-reservada",
                reservas: reservasAsociadas
            };
        }

        // Totalmente disponible (sin reservas en ese rango)
        // Ahora SÍ se permite ocupar, pero se debe crear una reserva primero
        console.log("✅ Habitación disponible (sin reserva) - Se puede ocupar creando reserva");
        return { 
            ok: true, 
            tipo: "disponible-sin-reserva",
            requiereCrearReserva: true
        };
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
    // CREAR RESERVA (para habitaciones libres)
    // Crea una reserva con el titular simplificado (solo nombre, apellido, teléfono)
    // -------------------------------------------------------
    static async crearReserva(habitacion, desde, hasta, titularSimplificado) {
        try {
            // Construir DTO de reserva según el formato del backend
            const reservaDTO = {
                fechaInicio: desde,
                fechaFin: hasta,
                titular: {
                    nombre: titularSimplificado.nombre || "",
                    apellido: titularSimplificado.apellido || "",
                    telefono: titularSimplificado.telefono || ""
                },
                habitaciones: [{
                    numero: habitacion.numero,
                    tipo: habitacion.tipo,
                    categoria: habitacion.categoria || "",
                    costoPorNoche: habitacion.costoPorNoche || habitacion.costoNoche || 0,
                    estado: habitacion.estado || "Disponible"
                }],
                estado: "Pendiente"
            };

            console.log("📤 Creando reserva:", reservaDTO);

            const respuesta = await ReservaDAO.guardarReserva(reservaDTO);
            
            if (!respuesta || !respuesta.ok) {
                console.error("❌ Error al crear reserva:", respuesta?.error);
                return { ok: false, mensaje: respuesta?.error || "No se pudo crear la reserva." };
            }

            console.log("✅ Reserva creada:", respuesta.data);
            return { ok: true, reserva: respuesta.data };

        } catch (e) {
            console.error("❌ Error creando reserva:", e);
            return { ok: false, mensaje: "No se pudo crear la reserva." };
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
