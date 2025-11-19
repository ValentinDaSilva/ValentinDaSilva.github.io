

import { GestorReserva, Persona, Habitacion, Reserva, EstadoHabitacion, EstadoReserva } from "../../Clases/Dominio/dominio.js";


class GestorRealizarReserva extends GestorReserva {
    constructor() {
        super();
    }

    
    extraerDatosFormulario() {
        const nombre = document.getElementById('nombre')?.value.trim() || '';
        const apellido = document.getElementById('apellido')?.value.trim() || '';
        const telefono = document.getElementById('telefono')?.value.trim() || '';
        
        return { nombre, apellido, telefono };
    }

    
    obtenerHabitacionesSeleccionadas() {
        
        if (typeof window.obtenerHabitacionesSeleccionadas === 'function') {
            return window.obtenerHabitacionesSeleccionadas();
        }
        return [];
    }

    
    obtenerHabitaciones() {
        
        if (typeof window.obtenerHabitaciones === 'function') {
            return window.obtenerHabitaciones();
        }
        return [];
    }

    
    obtenerNumeroDesdeNombre(nombreHabitacion) {
        
        if (typeof window.obtenerNumeroDesdeNombre === 'function') {
            return window.obtenerNumeroDesdeNombre(nombreHabitacion);
        }
        return null;
    }

    
    procesarHabitacionesSeleccionadas(habitacionesSeleccionadas, todasLasHabitacionesData) {
        const habitacionesConFechas = [];

        for (const seleccion of habitacionesSeleccionadas) {
            const numeroHabitacion = this.obtenerNumeroDesdeNombre(seleccion.habitacion);
            if (!numeroHabitacion) continue;

            const habitacionData = todasLasHabitacionesData.find(h => h.numero === numeroHabitacion);
            if (!habitacionData) {
                console.warn(`No se encontró la habitación ${numeroHabitacion} en los datos cargados`);
                continue;
            }

            const habitacion = new Habitacion(
                habitacionData.numero,
                habitacionData.tipo,
                '',
                habitacionData.costoNoche,
                EstadoHabitacion.DISPONIBLE
            );

            habitacionesConFechas.push({
                habitacion: habitacion,
                fechaDesde: seleccion.fechaDesde,
                fechaHasta: seleccion.fechaHasta
            });
        }

        return habitacionesConFechas;
    }

    
    calcularFechasReserva(habitacionesConFechas) {
        if (habitacionesConFechas.length === 0) {
            return { fechaInicio: null, fechaFin: null };
        }

        let fechaInicioMinima = habitacionesConFechas[0].fechaDesde;
        let fechaFinMaxima = habitacionesConFechas[0].fechaHasta;

        habitacionesConFechas.forEach(item => {
            if (this.compararFechas(item.fechaDesde, fechaInicioMinima) < 0) {
                fechaInicioMinima = item.fechaDesde;
            }
            if (this.compararFechas(item.fechaHasta, fechaFinMaxima) > 0) {
                fechaFinMaxima = item.fechaHasta;
            }
        });

        return { fechaInicio: fechaInicioMinima, fechaFin: fechaFinMaxima };
    }

    
    compararFechas(fecha1, fecha2) {
        const partes1 = fecha1.split('/').map(Number);
        const partes2 = fecha2.split('/').map(Number);
        if (partes1[1] !== partes2[1]) return partes1[1] - partes2[1];
        if (partes1[0] !== partes2[0]) return partes1[0] - partes2[0];
        return partes1[2] - partes2[2];
    }

    
    async procesarReserva(habitacionesSeleccionadas) {
        try {
            
            const todasLasHabitacionesData = this.obtenerHabitaciones();
            if (!todasLasHabitacionesData || todasLasHabitacionesData.length === 0) {
                mensajeError("Error: No se pudieron cargar las habitaciones.");
                return null;
            }

            
            const habitacionesConFechas = this.procesarHabitacionesSeleccionadas(habitacionesSeleccionadas, todasLasHabitacionesData);
            if (habitacionesConFechas.length === 0) {
                mensajeError("Error: No se pudieron procesar las habitaciones seleccionadas.");
                return null;
            }

            
            const { fechaInicio, fechaFin } = this.calcularFechasReserva(habitacionesConFechas);

            
            const siguienteId = await this._obtenerSiguienteId();
            const habitacionesReserva = habitacionesConFechas.map(item => item.habitacion);

            return {
                id: siguienteId,
                fechaInicio,
                fechaFin,
                habitacionesReserva,
                habitacionesConFechas
            };
        } catch (error) {
            console.error('Error al procesar reserva:', error);
            throw error;
        }
    }

    
    crearReservaConTitular(id, fechaInicio, fechaFin, titular, habitacionesReserva) {
        const reserva = new Reserva(id, fechaInicio, fechaFin, titular, EstadoReserva.PENDIENTE);
        reserva.habitaciones = habitacionesReserva;
        return reserva;
    }

    
    async generarReservasIndividuales(reservaDTO, habitacionesConFechas, siguienteId) {
        
        if (typeof window.convertirReservaDTOAJSONConFechasIndividuales === 'function') {
            const jsonParaBD = window.convertirReservaDTOAJSONConFechasIndividuales(habitacionesConFechas, reservaDTO);

            
            const idsReservas = [];
            let idActual = siguienteId;
            for (let i = 0; i < jsonParaBD.length; i++) {
                idsReservas.push(idActual);
                if (i < jsonParaBD.length - 1) {
                    idActual = await this._obtenerSiguienteId();
                }
            }

            jsonParaBD.forEach((reserva, index) => {
                reserva.id = idsReservas[index];
            });

            return jsonParaBD;
        }
        return [];
    }
}


export { GestorRealizarReserva };

const gestorRealizarReserva = new GestorRealizarReserva();


window.gestorRealizarReserva = gestorRealizarReserva;

