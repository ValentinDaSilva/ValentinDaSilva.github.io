// ==========================
// ENUMS
// ==========================
const EstadoHabitacion = {
    DISPONIBLE: "Disponible",
    RESERVADA: "Reservada",
    OCUPADA: "Ocupada",
    FUERA_DE_SERVICIO: "FueraDeServicio"
  };
  
  const EstadoReserva = {
    PENDIENTE: "Pendiente",
    CONFIRMADA: "Confirmada",
    CANCELADA: "Cancelada",
    FINALIZADA: "Finalizada"
  };
  
  const EstadoEstadia = {
    EN_CURSO: "EnCurso",
    FINALIZADA: "Finalizada"
  };
  
  const TipoDocumento = {
    DNI: "DNI",
    PASAPORTE: "Pasaporte",
    CUIL: "CUIL",
    LIBRETA_CIVICA: "LibretaCivica"
  };
  
  // ==========================
  // CLASES DE DOMINIO
  // ==========================
  
  class Direccion {
    constructor(calle, numero, piso, departamento, localidad, provincia, codigoPostal) {
      this._calle = calle;
      this._numero = numero;
      this._piso = piso;
      this._departamento = departamento;
      this._localidad = localidad;
      this._provincia = provincia;
      this._codigoPostal = codigoPostal;
    }
  
    get calle() { return this._calle; }
    set calle(v) { this._calle = v; }
  
    get numero() { return this._numero; }
    set numero(v) { this._numero = v; }
  
    get piso() { return this._piso; }
    set piso(v) { this._piso = v; }
  
    get departamento() { return this._departamento; }
    set departamento(v) { this._departamento = v; }
  
    get localidad() { return this._localidad; }
    set localidad(v) { this._localidad = v; }
  
    get provincia() { return this._provincia; }
    set provincia(v) { this._provincia = v; }
  
    get codigoPostal() { return this._codigoPostal; }
    set codigoPostal(v) { this._codigoPostal = v; }
  }
  
  // --------------------------
  
  class Persona {
    constructor(nombre, apellido, telefono) {
      this._nombre = nombre;
      this._apellido = apellido;
      this._telefono = telefono;
    }
  
    get nombre() { return this._nombre; }
    set nombre(v) { this._nombre = v; }
  
    get apellido() { return this._apellido; }
    set apellido(v) { this._apellido = v; }

    get telefono() { return this._telefono; }
    set telefono(v) { this._telefono = v; }
  }
  
  // --------------------------
  
  class Huesped extends Persona {
    constructor(nombre, apellido, tipoDocumento, nroDocumento, fechaNacimiento, condicionIVA, ocupacion, nacionalidad, cuit, email) {
      super(nombre, apellido);
      this._tipoDocumento = tipoDocumento;
      this._nroDocumento = nroDocumento;
      this._fechaNacimiento = new Date(fechaNacimiento);
      this._condicionIVA = condicionIVA;
      this._ocupacion = ocupacion;
      this._nacionalidad = nacionalidad;
      this._cuit = cuit;
      this._email = email;
    }
  
    get tipoDocumento() { return this._tipoDocumento; }
    set tipoDocumento(v) { this._tipoDocumento = v; }
  
    get nroDocumento() { return this._nroDocumento; }
    set nroDocumento(v) { this._nroDocumento = v; }
  
    get fechaNacimiento() { return this._fechaNacimiento; }
    set fechaNacimiento(v) { this._fechaNacimiento = new Date(v); }
  
    get condicionIVA() { return this._condicionIVA; }
    set condicionIVA(v) { this._condicionIVA = v; }
  
    get ocupacion() { return this._ocupacion; }
    set ocupacion(v) { this._ocupacion = v; }
  
    get nacionalidad() { return this._nacionalidad; }
    set nacionalidad(v) { this._nacionalidad = v; }
  
    get cuit() { return this._cuit; }
    set cuit(v) { this._cuit = v; }
  
    get email() { return this._email; }
    set email(v) { this._email = v; }
  
    verificarMayorEdad() {
      const hoy = new Date();
      const edad = hoy.getFullYear() - this._fechaNacimiento.getFullYear();
      return edad >= 18;
    }
  }
  
  // --------------------------
  
  class Acompaniante extends Persona {
    constructor(nombre, apellido, fechaNacimiento, tipoDocumento, nroDocumento) {
      super(nombre, apellido);
      this._fechaNacimiento = new Date(fechaNacimiento);
      this._tipoDocumento = tipoDocumento;
      this._nroDocumento = nroDocumento;
    }
  
    get fechaNacimiento() { return this._fechaNacimiento; }
    set fechaNacimiento(v) { this._fechaNacimiento = new Date(v); }
  
    get tipoDocumento() { return this._tipoDocumento; }
    set tipoDocumento(v) { this._tipoDocumento = v; }
  
    get nroDocumento() { return this._nroDocumento; }
    set nroDocumento(v) { this._nroDocumento = v; }
  
    verificarMayorEdad() {
      const hoy = new Date();
      const edad = hoy.getFullYear() - this._fechaNacimiento.getFullYear();
      return edad >= 18;
    }
  }
  
  // --------------------------
  
  class Habitacion {
    constructor(numero, tipo, categoria, costoPorNoche, estadoHabitacion = EstadoHabitacion.DISPONIBLE) {
      this._numero = numero;
      this._tipo = tipo;
      this._categoria = categoria;
      this._costoPorNoche = costoPorNoche;
      this._estadoHabitacion = estadoHabitacion;
    }
  
    get numero() { return this._numero; }
    set numero(v) { this._numero = v; }
  
    get tipo() { return this._tipo; }
    set tipo(v) { this._tipo = v; }
  
    get categoria() { return this._categoria; }
    set categoria(v) { this._categoria = v; }
  
    get costoPorNoche() { return this._costoPorNoche; }
    set costoPorNoche(v) { this._costoPorNoche = v; }
  
    get estadoHabitacion() { return this._estadoHabitacion; }
    set estadoHabitacion(v) { this._estadoHabitacion = v; }
  
    devolverEstado() { return this._estadoHabitacion; }
  }
  
  // --------------------------
  
  class Reserva {
    constructor(id, fechaInicio, fechaFin, titular, estado = EstadoReserva.PENDIENTE) {
      this._id = id;
      this._fechaInicio = new Date(fechaInicio);
      this._fechaFin = new Date(fechaFin);
      this._titular = titular;
      this._estado = estado;
      this._habitaciones = [];
    }
  
    get id() { return this._id; }
    set id(v) { this._id = v; }
  
    get fechaInicio() { return this._fechaInicio; }
    set fechaInicio(v) { this._fechaInicio = new Date(v); }
  
    get fechaFin() { return this._fechaFin; }
    set fechaFin(v) { this._fechaFin = new Date(v); }
  
    get titular() { return this._titular; }
    set titular(v) { this._titular = v; }
  
    get estado() { return this._estado; }
    set estado(v) { this._estado = v; }
  
    get habitaciones() { return this._habitaciones; }
    set habitaciones(v) { this._habitaciones = v; }
  }
  
  // --------------------------
  
  class Estadia {
    constructor(id, fechaCheckIn, fechaCheckOut, estado = EstadoEstadia.EN_CURSO) {
      this._id = id;
      this._fechaCheckIn = new Date(fechaCheckIn);
      this._fechaCheckOut = new Date(fechaCheckOut);
      this._estado = estado;
      this._consumos = [];
    }
  
    get id() { return this._id; }
    set id(v) { this._id = v; }
  
    get fechaCheckIn() { return this._fechaCheckIn; }
    set fechaCheckIn(v) { this._fechaCheckIn = new Date(v); }
  
    get fechaCheckOut() { return this._fechaCheckOut; }
    set fechaCheckOut(v) { this._fechaCheckOut = new Date(v); }
  
    get estado() { return this._estado; }
    set estado(v) { this._estado = v; }
  
    get consumos() { return this._consumos; }
    set consumos(v) { this._consumos = v; }
  
    registrarCheckIn(fecha) {
      this._fechaCheckIn = new Date(fecha);
      this._estado = EstadoEstadia.EN_CURSO;
    }
  
    registrarCheckOut(fecha) {
      this._fechaCheckOut = new Date(fecha);
      this._estado = EstadoEstadia.FINALIZADA;
    }
  
    agregarConsumos(descripcion, monto) {
      this._consumos.push({ descripcion, monto, fecha: new Date() });
    }
  
    verConsumos() {
      return this._consumos;
    }
  }
  
  // ==========================
  // GESTORES
  // ==========================
  
  class GestorHuesped {
    constructor() { this.huespedes = []; }
  
    darDeAlta(huesped) {
      if (!huesped.verificarMayorEdad()) throw new Error("El huésped debe ser mayor de edad");
      this.huespedes.push(huesped);
    }
  
    darDeBaja(nroDoc) { this.huespedes = this.huespedes.filter(h => h.nroDocumento !== nroDoc); }
  
    buscarHuesped(nroDoc) { return this.huespedes.find(h => h.nroDocumento === nroDoc) || null; }
  
    modificarHuesped(nroDoc, datos) {
      const h = this.buscarHuesped(nroDoc);
      if (h) Object.assign(h, datos);
    }
  }
  
  class GestorReserva {
    constructor() { 
      this.reservas = [];
      this._rutaBD = '/reservas.json';
      this._siguienteId = null; // Cache para el siguiente ID
    }

    /**
     * Obtiene el siguiente ID disponible leyendo desde BD si es necesario
     * @returns {Promise<number>} - El siguiente ID disponible
     */
    async _obtenerSiguienteId() {
      if (this._siguienteId === null) {
        const reservasExistentes = await this._leerReservasDesdeBD();
        // El ID se genera basado en la cantidad de reservas existentes
        // En un sistema real, debería buscar el máximo ID
        this._siguienteId = reservasExistentes.length + 1;
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

      return new ReservaDTO(
        reserva.id,
        reserva.fechaInicio.toISOString().split('T')[0], // Formato YYYY-MM-DD
        reserva.fechaFin.toISOString().split('T')[0],
        titularDTO,
        reserva.estado,
        habitacionesDTO
      );
    }

    /**
     * Convierte un ReservaDTO a Reserva de dominio
     * @param {ReservaDTO} reservaDTO - Objeto ReservaDTO
     * @returns {Reserva} - Objeto Reserva de dominio
     */
    _convertirDTOAReserva(reservaDTO) {
      // Convertir el titular DTO a Persona o Huesped
      let titular = null;
      if (reservaDTO.titular) {
        // Si el titular tiene más campos, crear un Huesped completo
        if (reservaDTO.titular.tipoDocumento) {
          titular = new Huesped(
            reservaDTO.titular.nombre,
            reservaDTO.titular.apellido,
            reservaDTO.titular.tipoDocumento,
            reservaDTO.titular.nroDocumento,
            reservaDTO.titular.fechaNacimiento || '2000-01-01',
            reservaDTO.titular.condicionIVA || '',
            reservaDTO.titular.ocupacion || '',
            reservaDTO.titular.nacionalidad || '',
            reservaDTO.titular.cuit || '',
            reservaDTO.titular.email || ''
          );
          titular.telefono = reservaDTO.titular.telefono || '';
        } else {
          // Crear una Persona básica solo con nombre, apellido y teléfono
          titular = new Persona(
            reservaDTO.titular.nombre,
            reservaDTO.titular.apellido,
            reservaDTO.titular.telefono || ''
          );
        }
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
     * @returns {Promise<Array>} - Array de objetos ReservaDTO
     */
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

    /**
     * Guarda una reserva en el archivo JSON (base de datos)
     * @param {ReservaDTO} reservaDTO - Objeto ReservaDTO a guardar
     * @returns {Promise<void>}
     */
    async _guardarReservaEnBD(reservaDTO) {
      try {
        // Leer todas las reservas existentes
        const reservasExistentes = await this._leerReservasDesdeBD();
        
        // Convertir el formato nuevo al formato antiguo del JSON para compatibilidad
        // Si hay múltiples habitaciones, crear una entrada por cada habitación
        const reservasFormatoJSON = [];
        
        if (reservaDTO.habitaciones && reservaDTO.habitaciones.length > 0) {
          // Crear una entrada por cada habitación
          reservaDTO.habitaciones.forEach(habitacion => {
            reservasFormatoJSON.push({
              numeroHabitacion: habitacion.numero,
              desde: reservaDTO.fechaInicio,
              hasta: reservaDTO.fechaFin,
              responsable: reservaDTO.titular 
                ? `${reservaDTO.titular.apellido || ''}, ${reservaDTO.titular.nombre || ''}`.trim()
                : '',
              telefono: reservaDTO.titular ? reservaDTO.titular.telefono || '' : ''
            });
          });
        } else {
          // Si no hay habitaciones, crear una entrada básica
          reservasFormatoJSON.push({
            numeroHabitacion: null,
            desde: reservaDTO.fechaInicio,
            hasta: reservaDTO.fechaFin,
            responsable: reservaDTO.titular 
              ? `${reservaDTO.titular.apellido || ''}, ${reservaDTO.titular.nombre || ''}`.trim()
              : '',
            telefono: reservaDTO.titular ? reservaDTO.titular.telefono || '' : ''
          });
        }

        // Agregar las nuevas reservas
        reservasExistentes.push(...reservasFormatoJSON);

        // Guardar en el archivo JSON
        // Nota: En un entorno real, esto se haría con una llamada al servidor
        // Por ahora, solo simulamos el guardado
        console.log('=== FORMATO FINAL PARA JSON ===');
        console.log('Entradas a agregar al JSON (una por cada habitación):', reservasFormatoJSON);
        console.log('Total de entradas:', reservasFormatoJSON.length);
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
  
  class GestorHabitacion {
    constructor() {
      this._rutaBD = '/habitaciones.json';
    }

    /**
     * Convierte una Habitacion de dominio a HabitacionDTO
     * @param {Habitacion} habitacion - Objeto Habitacion de dominio
     * @returns {HabitacionDTO} - Objeto HabitacionDTO
     */
    _convertirHabitacionADTO(habitacion) {
      return new HabitacionDTO(
        habitacion.numero,
        habitacion.tipo,
        habitacion.categoria,
        habitacion.costoPorNoche,
        habitacion.estadoHabitacion
      );
    }

    /**
     * Convierte un HabitacionDTO a Habitacion de dominio
     * @param {HabitacionDTO} habitacionDTO - Objeto HabitacionDTO
     * @returns {Habitacion} - Objeto Habitacion de dominio
     */
    _convertirDTOAHabitacion(habitacionDTO) {
      return new Habitacion(
        habitacionDTO.numero,
        habitacionDTO.tipo,
        habitacionDTO.categoria || '',
        habitacionDTO.costoPorNoche,
        habitacionDTO.estadoHabitacion || EstadoHabitacion.DISPONIBLE
      );
    }

    /**
     * Lee las habitaciones desde el archivo JSON (base de datos)
     * @returns {Promise<Array>} - Array de objetos HabitacionDTO
     */
    async _leerHabitacionesDesdeBD() {
      try {
        const respuesta = await fetch(this._rutaBD);
        if (!respuesta.ok) {
          throw new Error(`Error al leer habitaciones: ${respuesta.status}`);
        }
        const datos = await respuesta.json();
        return datos.habitaciones || [];
      } catch (error) {
        console.error('Error al leer habitaciones desde BD:', error);
        throw error;
      }
    }

    /**
     * Carga las habitaciones desde la base de datos y las convierte a objetos de dominio
     * @returns {Promise<Array<Habitacion>>} - Array de objetos Habitacion de dominio
     */
    async cargarHabitacionesDesdeBD() {
      try {
        const habitacionesDTO = await this._leerHabitacionesDesdeBD();
        return habitacionesDTO.map(dto => this._convertirDTOAHabitacion(dto));
      } catch (error) {
        console.error('Error al cargar habitaciones desde BD:', error);
        throw error;
      }
    }
  }
  
  class GestorEstadia {
    constructor() { this.estadias = []; }
  
    registrarCheckIn(fecha, habitaciones) {
      const e = new Estadia(this.estadias.length + 1, fecha, null);
      e.habitaciones = habitaciones;
      this.estadias.push(e);
    }
  
    registrarCheckOut(id, fecha) {
      const e = this.estadias.find(est => est.id === id);
      if (e) e.registrarCheckOut(fecha);
    }
  
    agregarConsumos(id, descripcion, monto) {
      const e = this.estadias.find(est => est.id === id);
      if (e) e.agregarConsumos(descripcion, monto);
    }
  
    verConsumos(id) {
      const e = this.estadias.find(est => est.id === id);
      return e ? e.verConsumos() : [];
    }
  }

