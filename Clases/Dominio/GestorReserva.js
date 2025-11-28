import Reserva from "./Reserva.js";
import { EstadoReserva, EstadoHabitacion } from "./Enums.js";
import Persona from "./Persona.js";
import {Huesped} from "./Huesped.js";
import Habitacion from "./Habitacion.js";

/**
 * GestorReserva - Coordinador central para todas las operaciones relacionadas con reservas.
 * 
 * MÉTODOS PÚBLICOS:
 * - async realizarReserva(habitacionesSeleccionadas, datosTitular)
 *   → Procesa la creación de una nueva reserva con habitaciones y titular.
 * 
 * - async cancelarReservas(reservasSeleccionadas)
 *   → Cancela múltiples reservas seleccionadas y actualiza su estado.
 * 
 * - async guardarReservasEnBD(reservasJSON)
 *   → Guarda múltiples reservas en la base de datos.
 * 
 * - _convertirReservaADTO(reserva)
 *   → Convierte un objeto Reserva de dominio a un DTO para la persistencia/transferencia de datos.
 * 
 * - _convertirDTOAReserva(reservaDTO)
 *   → Convierte un DTO de reserva (desde la base de datos o transferencia) a un objeto Reserva de dominio.
 * 
 */


export class GestorReserva {
  constructor() { 
    this.reservas = [];
    this._rutaBD = '/Datos/reservas.json';
    this._siguienteId = null; 
    this._gestorRealizar = null;
    this._gestorCancelar = null;
  }

  async realizarReserva(habitacionesSeleccionadas, datosTitular) {
    try {
      
      if (!this._gestorRealizar) {
        if (window.gestorRealizarReserva) {
          this._gestorRealizar = window.gestorRealizarReserva;
        } else {
          const { GestorRealizarReserva } = await import('../../RealizarReserva/JS/gestor-realizar-reserva.js');
          this._gestorRealizar = new GestorRealizarReserva();
        }
      }

      
      const resultado = await this._gestorRealizar.procesarReserva(habitacionesSeleccionadas);
      if (!resultado) {
        return false;
      }

      
      const { nombre, apellido, telefono } = datosTitular;
      const titular = new Persona(nombre, apellido, telefono);

      
      const reserva = this._gestorRealizar.crearReservaConTitular(
        resultado.id,
        resultado.fechaInicio,
        resultado.fechaFin,
        titular,
        resultado.habitacionesReserva
      );

      
      const reservaDTO = this._convertirReservaADTO(reserva);

      
      const jsonParaBD = await this._gestorRealizar.generarReservasIndividuales(
        reservaDTO,
        resultado.habitacionesConFechas,
        resultado.id
      );

      
      if (typeof window.mostrarJSONReservaEnPantalla === 'function') {
        window.mostrarJSONReservaEnPantalla(jsonParaBD, reservaDTO, function() {
          
          if (typeof window.mostrarModalExitoReserva === 'function') {
            window.mostrarModalExitoReserva(nombre, apellido);
          }
        });
      } else {
        
        if (typeof window.mostrarModalExitoReserva === 'function') {
          window.mostrarModalExitoReserva(nombre, apellido);
        }
      }

      
      await this.guardarReservasEnBD(jsonParaBD);

      
      this.reservas.push(reserva);

      return true;
    } catch (error) {
      console.error('Error al realizar reserva:', error);
      mensajeError('Error al realizar la reserva: ' + error.message);
      return false;
    }
  }

  async cancelarReservas(reservasSeleccionadas) {
    try {
      
      if (!this._gestorCancelar) {
        if (window.gestorCancelarReserva) {
          this._gestorCancelar = window.gestorCancelarReserva;
        } else {
          const { GestorCancelarReserva } = await import('../../CancelarReserva/JS/gestor-cancelar-reserva.js');
          this._gestorCancelar = new GestorCancelarReserva();
        }
      }

      
      await this._gestorCancelar.cargarReservas();

      
      const reservasParaCancelar = this._gestorCancelar.procesarReservasParaCancelar(reservasSeleccionadas);

      
      if (typeof window.mostrarJSONCancelacionEnPantalla === 'function') {
        window.mostrarJSONCancelacionEnPantalla(reservasParaCancelar, function() {
          if (typeof window.mostrarModalExito === 'function') {
            window.mostrarModalExito();
          }
        });
      }

      
      await this._gestorCancelar.cancelarReservasEnBD(reservasParaCancelar);

      
      reservasParaCancelar.forEach(reserva => {
        this.cancelarReserva(reserva.id);
      });

      return true;
    } catch (error) {
      console.error('Error al cancelar reservas:', error);
      mensajeError('Error al cancelar las reservas: ' + error.message);
      return false;
    }
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
  
  cancelarReserva(id) {
    const r = this.reservas.find(res => res.id === id);
    if (r) r.estado = EstadoReserva.CANCELADA;
  }

  verHabitacionesAsociadas(id) {
    const r = this.reservas.find(res => res.id === id);
    return r ? r.habitaciones : [];
  }

  
  async guardarReservasEnBD(reservasJSON) {
    try {
      const respuesta = await fetch("http://localhost:8080/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonReserva)
      });
  
      if (!respuesta.ok) {
        mensajeError("No se pudo registrar la reserva.");
        return false;
      }
  
      return true;
    } catch (e) {
      console.error(e);
      mensajeError("Error al intentar crear la reserva.");
      return false;
    }
  }

  
  

  
  async buscarReservasParaCancelar() {
    try {
      
      if (!this._gestorCancelar) {
        if (window.gestorCancelarReserva) {
          this._gestorCancelar = window.gestorCancelarReserva;
        } else {
          const { GestorCancelarReserva } = await import('../../CancelarReserva/JS/gestor-cancelar-reserva.js');
          this._gestorCancelar = new GestorCancelarReserva();
        }
      }

      
      return await this._gestorCancelar.buscarReservas();
    } catch (error) {
      console.error('Error al buscar reservas:', error);
      mensajeError('Error al buscar reservas: ' + error.message);
      return [];
    }
  }

  
  
}

let ReservaDTO;
if (typeof window !== 'undefined') {
  ReservaDTO = window.ReservaDTO || class {
    constructor(id, fechaInicio, fechaFin, titular, estado, habitaciones, estadia = null) {
      this._id = id;
      this._fechaInicio = fechaInicio;
      this._fechaFin = fechaFin;
      this._titular = titular;
      this._estado = estado;
      this._habitaciones = habitaciones;
      this._estadia = estadia;
    }
    get id() { return this._id; } set id(v) { this._id = v; }
    get fechaInicio() { return this._fechaInicio; } set fechaInicio(v) { this._fechaInicio = v; }
    get fechaFin() { return this._fechaFin; } set fechaFin(v) { this._fechaFin = v; }
    get titular() { return this._titular; } set titular(v) { this._titular = v; }
    get estado() { return this._estado; } set estado(v) { this._estado = v; }
    get habitaciones() { return this._habitaciones; } set habitaciones(v) { this._habitaciones = v; }
    get estadia() { return this._estadia; } set estadia(v) { this._estadia = v; }
  };
}


export default GestorReserva;


const gestorReserva = new GestorReserva();


window.gestorReserva = gestorReserva;

