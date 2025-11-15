import Reserva from "./Reserva.js";
import { EstadoReserva, EstadoHabitacion } from "./Enums.js";
import Persona from "./Persona.js";
import Huesped from "./Huesped.js";
import Habitacion from "./Habitacion.js";
// ReservaDTO se importa desde el archivo dto.js que se carga antes en los HTML

class GestorReserva {
  constructor() { 
    this.reservas = [];
    this._rutaBD = '/Datos/reservas.json';
    this._siguienteId = null; // Cache para el siguiente ID
  }

  /**
   * Obtiene el siguiente ID disponible leyendo desde BD si es necesario
   * @returns {Promise<number>} - El siguiente ID disponible
   */
  async _obtenerSiguienteId() {
    if (this._siguienteId === null) {
      const reservasExistentes = await this._leerReservasDesdeBD();
      // Buscar el máximo ID existente
      const maxId = reservasExistentes.length > 0
        ? Math.max(...reservasExistentes.map(r => r.id || 0))
        : 0;
      this._siguienteId = maxId + 1;
    }
    const id = this._siguienteId;
    this._siguienteId++; // Incrementar para la siguiente reserva
    return id;
  }

  /**
   * Convierte una Reserva de dominio a ReservaDTO
   * @param {Reserva} reserva - Objeto Reserva de dominio
   * @returns {ReservaDTO} - Objeto ReservaDTO
   */
  _convertirReservaADTO(reserva) {
    // Convertir el titular a un objeto simple si es un Huesped o Persona
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

    // Convertir habitaciones a objetos simples
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

    // Convertir estadia a DTO si existe
    let estadiaDTO = null;
    if (reserva.estadia) {
      // La estadia se convierte a DTO si es necesario
      // Por ahora, pasamos null ya que la conversión completa de Estadia a EstadiaDTO
      // requeriría más lógica (reserva, titular, acompañantes)
      estadiaDTO = null; // TODO: Implementar conversión completa de Estadia a EstadiaDTO si es necesario
    }

    return new ReservaDTO(
      reserva.id,
      reserva.fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
      reserva.fechaFin.toISOString().split('T')[0],
      titularDTO,
      reserva.estado,
      habitacionesDTO,
      estadiaDTO
    );
  }

  /**
   * Convierte un ReservaDTO a Reserva de dominio
   * @param {ReservaDTO} reservaDTO - Objeto ReservaDTO
   * @returns {Reserva} - Objeto Reserva de dominio
   */
  _convertirDTOAReserva(reservaDTO) {
    // Convertir el titular DTO a Persona (las reservas siempre usan Persona, no Huesped)
    let titular = null;
    if (reservaDTO.titular) {
      // Las reservas siempre usan Persona, no Huesped
      titular = new Persona(
        reservaDTO.titular.nombre || '',
        reservaDTO.titular.apellido || '',
        reservaDTO.titular.telefono || ''
      );
    }

    // Convertir habitaciones DTO a Habitacion
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

  /**
   * Lee las reservas desde el archivo JSON (base de datos)
   * @returns {Promise<Array>} - Array de objetos en formato JSON (nuevo formato)
   */
  async _leerReservasDesdeBD() {
    try {
      const respuesta = await fetch(this._rutaBD);
      if (!respuesta.ok) {
        throw new Error(`Error al leer reservas: ${respuesta.status}`);
      }
      const datos = await respuesta.json();
      // Retornar las reservas en el nuevo formato (ya vienen en el formato correcto)
      return datos.reservas || [];
    } catch (error) {
      console.error('Error al leer reservas desde BD:', error);
      throw error;
    }
  }

  /**
   * Guarda una reserva en el archivo JSON (base de datos)
   * @param {ReservaDTO} reservaDTO - Objeto ReservaDTO a guardar
   * @returns {Promise<void>}
   */
  async _guardarReservaEnBD(reservaDTO) {
    try {
      // Leer todas las reservas existentes
      const reservasExistentes = await this._leerReservasDesdeBD();
      
      // Convertir ReservaDTO al formato JSON del nuevo formato
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

      // Agregar la nueva reserva
      reservasExistentes.push(reservaJSON);

      // Guardar en el archivo JSON
      // Nota: En un entorno real, esto se haría con una llamada al servidor
      // Por ahora, solo simulamos el guardado
      console.log('=== FORMATO FINAL PARA JSON ===');
      console.log('Reserva a agregar al JSON:', reservaJSON);
      console.log('==============================');
      
      // TODO: Implementar guardado real cuando se tenga acceso al servidor
      // Por ahora, solo se simula el guardado
      
    } catch (error) {
      console.error('Error al guardar reserva en BD:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva reserva y la guarda en la base de datos
   * @param {Date|string} fechaInicio - Fecha de inicio de la reserva
   * @param {Date|string} fechaFin - Fecha de fin de la reserva
   * @param {Persona|Huesped|Object} titular - Persona o Huésped titular de la reserva
   * @param {Array<Habitacion>} habitaciones - Array de habitaciones reservadas
   * @returns {Promise<Reserva>} - La reserva creada
   */
  async crearReserva(fechaInicio, fechaFin, titular, habitaciones = []) {
    // Obtener el siguiente ID disponible
    const siguienteId = await this._obtenerSiguienteId();

    // Crear la reserva de dominio
    const reserva = new Reserva(siguienteId, fechaInicio, fechaFin, titular, EstadoReserva.PENDIENTE);
    reserva.habitaciones = habitaciones || [];

    // Convertir a DTO
    const reservaDTO = this._convertirReservaADTO(reserva);

    // Mostrar en consola lo que se está por pasar a la base de datos
    console.log('=== DATOS A GUARDAR EN BASE DE DATOS ===');
    console.log('ReservaDTO completo:', reservaDTO);
    console.log('Detalles de la reserva:', reservaDTO);
    console.log('Detalles de la reserva:', JSON.stringify(reservaDTO));
    
    console.log('=========================================');

    // Guardar en BD
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

