

import { GestorEstadia } from "./GestorEstadia.js";
import { 
    convertirReservaJSONADominio, 
    convertirHuespedJSONADominio,
    buscarReservasParaHabitaciones
} from "./conversor-datos.js";


class GestorOcuparHabitacion extends GestorEstadia {
    constructor() {
        super();
        this._rutaBD = '/Datos/estadia.json';
        this._reservasJSON = [];
        this._habitacionesData = [];
    }

    
    async cargarReservas() {
        try {
            const respuesta = await fetch('/Datos/reservas.json');
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }
            const datos = await respuesta.json();
            this._reservasJSON = datos.reservas || [];
            return this._reservasJSON;
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            this._reservasJSON = [];
            return [];
        }
    }

    
    obtenerReservas() {
        return this._reservasJSON;
    }

    
    obtenerHabitaciones() {
        if (typeof window.obtenerHabitaciones === 'function') {
            return window.obtenerHabitaciones();
        }
        return [];
    }

    
    obtenerHabitacionesSeleccionadas() {
        if (typeof window.obtenerHabitacionesSeleccionadas === 'function') {
            return window.obtenerHabitacionesSeleccionadas();
        }
        return [];
    }

    
    buscarReservasParaHabitaciones(habitacionesSeleccionadas) {
        return buscarReservasParaHabitaciones(habitacionesSeleccionadas, this._reservasJSON);
    }

    
    procesarDatosEstadia(reservaSeleccionada, titularSeleccionado, acompaniantesSeleccionados) {
        const habitacionesData = this.obtenerHabitaciones();
        const idReserva = reservaSeleccionada.id || (this._reservasJSON.indexOf(reservaSeleccionada) + 1);
        
        const reserva = convertirReservaJSONADominio(reservaSeleccionada, idReserva, habitacionesData);
        const titular = convertirHuespedJSONADominio(titularSeleccionado);
        const acompaniantes = acompaniantesSeleccionados.map(acompJSON => 
            convertirHuespedJSONADominio(acompJSON)
        );
        
        const fechaCheckIn = reservaSeleccionada.fechaInicio || reservaSeleccionada.desde;
        const fechaCheckOut = reservaSeleccionada.fechaFin || reservaSeleccionada.hasta;

        return {
            reserva,
            titular,
            acompaniantes,
            fechaCheckIn,
            fechaCheckOut
        };
    }

    
    async guardarEstadiaEnBD(estadiaJSON) {
        try {
            const respuesta = await fetch(this._rutaBD);
            let estadiasExistentes = [];
            
            if (respuesta.ok) {
                const datos = await respuesta.json();
                estadiasExistentes = datos.estadias || [];
            }

            estadiasExistentes.push(estadiaJSON);

            console.log('Simulando guardado en BD. Total de estadías:', estadiasExistentes.length);
            console.log('Nueva estadía a guardar:', estadiaJSON);

            
        } catch (error) {
            console.error('Error al guardar estadía en BD:', error);
            throw error;
        }
    }
}


export { GestorOcuparHabitacion };

const gestorOcuparHabitacion = new GestorOcuparHabitacion();


window.gestorOcuparHabitacion = gestorOcuparHabitacion;

