import Reserva from "./Reserva.js";
import { EstadoReserva, EstadoHabitacion } from "./Enums.js";
import Persona from "./Persona.js";
import Huesped from "./Huesped.js";
import Habitacion from "./Habitacion.js";


class GestorReserva {
  constructor() { 
    this.reservas = [];
    this._rutaBD = '/Datos/reservas.json';
    this._siguienteId = null; 
  }

  
  async _obtenerSiguienteId() {
    if (this._siguienteId === null) {
      const reservasExistentes = await this._leerReservasDesdeBD();
      
      const maxId = reservasExistentes.length > 0
        ? Math.max(...reservasExistentes.map(r => r.id || 0))
        : 0;
      this._siguienteId = maxId + 1;
    }
    const id = this._siguienteId;
    this._siguienteId++; 
    return id;
  }

  
  _convertirReservaADTO(reserva) {
    
    let titularDTO = null;
    if (reserva.titular) {
      if (reserva.titular instanceof Huesped || reserva.titular instanceof Persona) {
        titularDTO = {
          nombre: reserva.titular.nombre,
          apellido: reserva.titular.apellido,
          telefono: reserva.titular.telefono
        };
      } else {
        titularDTO = reserva.titular;
      }
    }

    
    const habitacionesDTO = reserva.habitaciones.map(hab => {
      if (hab instanceof Habitacion) {
        return {
          numero: hab.numero,
          tipo: hab.tipo,
          categoria: hab.categoria,
          costoPorNoche: hab.costoPorNoche,
          estadoHabitacion: hab.estadoHabitacion
        };
      }
      return hab;
    });

    
    let estadiaDTO = null;
    if (reserva.estadia) {
      
      
      
      estadiaDTO = null; 
    }

    return new ReservaDTO(
      reserva.id,
      reserva.fechaInicio.toISOString().split('T')[0], 
      reserva.fechaFin.toISOString().split('T')[0],
      titularDTO,
      reserva.estado,
      habitacionesDTO,
      estadiaDTO
    );
  }

  
  _convertirDTOAReserva(reservaDTO) {
    
    let titular = null;
    if (reservaDTO.titular) {
      
      titular = new Persona(
        reservaDTO.titular.nombre || '',
        reservaDTO.titular.apellido || '',
        reservaDTO.titular.telefono || ''
      );
    }

    
    const habitaciones = reservaDTO.habitaciones.map(habDTO => {
      if (habDTO instanceof Habitacion) {
        return habDTO;
      }
      return new Habitacion(
        habDTO.numero,
        habDTO.tipo,
        habDTO.categoria || '',
        habDTO.costoPorNoche,
        habDTO.estadoHabitacion || EstadoHabitacion.DISPONIBLE
      );
    });

    const reserva = new Reserva(
      reservaDTO.id,
      reservaDTO.fechaInicio,
      reservaDTO.fechaFin,
      titular,
      reservaDTO.estado
    );
    reserva.habitaciones = habitaciones;
    return reserva;
  }

  
  async _leerReservasDesdeBD() {
    try {
      const respuesta = await fetch(this._rutaBD);
      if (!respuesta.ok) {
        throw new Error(`Error al leer reservas: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      
      return datos.reservas || [];
    } catch (error) {
      console.error('Error al leer reservas desde BD:', error);
      throw error;
    }
  }

  
  async _guardarReservaEnBD(reservaDTO) {
    try {
      
      const reservasExistentes = await this._leerReservasDesdeBD();
      
      
      const reservaJSON = {
        id: reservaDTO.id,
        fechaInicio: reservaDTO.fechaInicio,
        fechaFin: reservaDTO.fechaFin,
        titular: {
          nombre: reservaDTO.titular ? reservaDTO.titular.nombre || '' : '',
          apellido: reservaDTO.titular ? reservaDTO.titular.apellido || '' : '',
          telefono: reservaDTO.titular ? reservaDTO.titular.telefono || '' : ''
        },
        estado: reservaDTO.estado || 'Pendiente',
        habitaciones: (reservaDTO.habitaciones || []).map(hab => ({
          numero: hab.numero,
          tipo: hab.tipo || '',
          categoria: hab.categoria || '',
          costoPorNoche: hab.costoPorNoche || hab.costoNoche || 0,
          estadoHabitacion: hab.estadoHabitacion || 'Disponible'
        }))
      };

      
      reservasExistentes.push(reservaJSON);

      
      
      
      console.log('=== FORMATO FINAL PARA JSON ===');
      console.log('Reserva a agregar al JSON:', reservaJSON);
      console.log('==============================');
      
      
      
      
    } catch (error) {
      console.error('Error al guardar reserva en BD:', error);
      throw error;
    }
  }

  
  async crearReserva(fechaInicio, fechaFin, titular, habitaciones = []) {
    
    const siguienteId = await this._obtenerSiguienteId();

    
    const reserva = new Reserva(siguienteId, fechaInicio, fechaFin, titular, EstadoReserva.PENDIENTE);
    reserva.habitaciones = habitaciones || [];

    
    const reservaDTO = this._convertirReservaADTO(reserva);

    
    console.log('=== DATOS A GUARDAR EN BASE DE DATOS ===');
    console.log('ReservaDTO completo:', reservaDTO);
    console.log('Detalles de la reserva:', reservaDTO);
    console.log('Detalles de la reserva:', JSON.stringify(reservaDTO));
    
    console.log('=========================================');

    
    await this._guardarReservaEnBD(reservaDTO);

    return reserva;
  }

  cancelarReserva(id) {
    const r = this.reservas.find(res => res.id === id);
    if (r) r.estado = EstadoReserva.CANCELADA;
  }

  verHabitacionesAsociadas(id) {
    const r = this.reservas.find(res => res.id === id);
    return r ? r.habitaciones : [];
  }
}

export default GestorReserva;

