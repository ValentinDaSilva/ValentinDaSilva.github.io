

import { GestorReserva } from "../../Clases/Dominio/dominio.js";


class GestorCancelarReserva extends GestorReserva {
    constructor() {
        super();
        this._reservas = [];
    }

    
    extraerDatosFormulario() {
        const apellido = document.getElementById('apellido')?.value.trim().toUpperCase() || '';
        const nombres = document.getElementById('nombres')?.value.trim().toUpperCase() || '';
        
        return { apellido, nombres };
    }

    
    async cargarReservas() {
        try {
            const respuesta = await fetch(this._rutaBD);
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            const datos = await respuesta.json();
            this._reservas = datos.reservas || [];
            console.log('Reservas cargadas:', this._reservas.length);
            return this._reservas;
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            this._reservas = [];
            return [];
        }
    }

    
    obtenerReservas() {
        return this._reservas;
    }

    
    extraerApellido(reserva) {
        if (!reserva) return '';
        
        if (typeof reserva === 'object' && reserva.titular && reserva.titular.apellido) {
            return reserva.titular.apellido.toUpperCase();
        }
        
        if (typeof reserva === 'string') {
            const partes = reserva.split(',');
            return partes[0] ? partes[0].trim().toUpperCase() : '';
        }
        
        if (typeof reserva === 'object' && reserva.responsable) {
            const partes = reserva.responsable.split(',');
            return partes[0] ? partes[0].trim().toUpperCase() : '';
        }
        return '';
    }

    
    extraerNombre(reserva) {
        if (!reserva) return '';
        
        if (typeof reserva === 'object' && reserva.titular && reserva.titular.nombre) {
            return reserva.titular.nombre.toUpperCase();
        }
        
        if (typeof reserva === 'string') {
            const partes = reserva.split(',');
            return partes[1] ? partes[1].trim().toUpperCase() : '';
        }
        
        if (typeof reserva === 'object' && reserva.responsable) {
            const partes = reserva.responsable.split(',');
            return partes[1] ? partes[1].trim().toUpperCase() : '';
        }
        return '';
    }

    
    filtrarReservas(apellido, nombres) {
        if (!apellido && !nombres) {
            return [];
        }

        return this._reservas.filter(reserva => {
            const apellidoReserva = this.extraerApellido(reserva);
            const nombresReserva = this.extraerNombre(reserva);
            
            const cumpleApellido = !apellido || apellidoReserva.startsWith(apellido);
            const cumpleNombres = !nombres || nombresReserva.startsWith(nombres);
            
            return cumpleApellido && cumpleNombres;
        });
    }

    
    procesarReservasParaCancelar(reservasSeleccionadas) {
        return reservasSeleccionadas.map(reserva => {
            const reservaCompleta = JSON.parse(JSON.stringify(reserva));
            
            if (!reservaCompleta.titular) {
                reservaCompleta.titular = {};
            }
            
            const titularCompleto = {
                nombre: reservaCompleta.titular.nombre || '',
                apellido: reservaCompleta.titular.apellido || '',
                telefono: reservaCompleta.titular.telefono || ''
            };
            
            if (!reservaCompleta.habitaciones || !Array.isArray(reservaCompleta.habitaciones)) {
                reservaCompleta.habitaciones = [];
            }
            
            const habitacionesCompletas = reservaCompleta.habitaciones.map(habitacion => ({
                numero: habitacion.numero || null,
                tipo: habitacion.tipo || null,
                categoria: habitacion.categoria || '',
                costoPorNoche: habitacion.costoPorNoche || null,
                estadoHabitacion: habitacion.estadoHabitacion || null
            }));
            
            return {
                id: reservaCompleta.id || null,
                fechaInicio: reservaCompleta.fechaInicio || reservaCompleta.desde || null,
                fechaFin: reservaCompleta.fechaFin || reservaCompleta.hasta || null,
                titular: titularCompleto,
                estado: reservaCompleta.estado || null,
                habitaciones: habitacionesCompletas
            };
        });
    }

    
    async cancelarReservasEnBD(reservasParaCancelar) {
        try {
            const respuesta = await fetch(this._rutaBD);
            let datos = { reservas: [] };
            
            if (respuesta.ok) {
                datos = await respuesta.json();
            }

            
            const idsParaCancelar = reservasParaCancelar.map(r => r.id);
            datos.reservas = datos.reservas.filter(r => !idsParaCancelar.includes(r.id));

            
            console.log('Simulando cancelación en BD. Reservas canceladas:', reservasParaCancelar.length);
            console.log('Reservas restantes:', datos.reservas.length);

            
        } catch (error) {
            console.error('Error al cancelar reservas en BD:', error);
            throw error;
        }
    }

    
    async buscarReservas() {
        try {
            
            await this.cargarReservas();

            
            const datosFormulario = this.extraerDatosFormulario();

            
            const reservasFiltradas = this.filtrarReservas(datosFormulario.apellido, datosFormulario.nombres);

            console.log(`Se encontraron ${reservasFiltradas.length} reservas`);

            
            if (typeof window.mostrarResultados === 'function') {
                window.reservasFiltradas = reservasFiltradas;
                window.mostrarResultados();
            }

            return reservasFiltradas;
        } catch (error) {
            console.error('Error al buscar reservas:', error);
            mensajeError('Error al buscar reservas: ' + error.message);
            return [];
        }
    }
}


export { GestorCancelarReserva };

const gestorCancelarReserva = new GestorCancelarReserva();


window.gestorCancelarReserva = gestorCancelarReserva;

