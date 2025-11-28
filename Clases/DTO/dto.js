// =====================================================
// DIRECCION DTO
// =====================================================
export class DireccionDTO {
  constructor(calle, numero, piso, departamento, localidad, provincia, codigoPostal, pais) {
    this.calle = calle;
    this.numero = numero;
    this.piso = piso;
    this.departamento = departamento;
    this.localidad = localidad;
    this.provincia = provincia;
    this.codigoPostal = codigoPostal;
    this.pais = pais;
  }

  getCalle() { return this.calle; }       setCalle(v) { this.calle = v; }
  getNumero() { return this.numero; }     setNumero(v) { this.numero = v; }
  getPiso() { return this.piso; }         setPiso(v) { this.piso = v; }
  getDepartamento() { return this.departamento; } setDepartamento(v) { this.departamento = v; }
  getLocalidad() { return this.localidad; } setLocalidad(v) { this.localidad = v; }
  getProvincia() { return this.provincia; } setProvincia(v) { this.provincia = v; }
  getCodigoPostal() { return this.codigoPostal; } setCodigoPostal(v) { this.codigoPostal = v; }
  getPais() { return this.pais; } setPais(v) { this.pais = v; }
}

// =====================================================
// PERSONA DTO
// =====================================================
export class PersonaDTO {
  constructor(nombre, apellido, telefono) {
    this.nombre = nombre;
    this.apellido = apellido;
    this.telefono = telefono;
  }

  getNombre() { return this.nombre; }     setNombre(v) { this.nombre = v; }
  getApellido() { return this.apellido; } setApellido(v) { this.apellido = v; }
  getTelefono() { return this.telefono; } setTelefono(v) { this.telefono = v; }
}

// =====================================================
// HUESPED DTO
// =====================================================
export class HuespedDTO {
  constructor(
      nombre,
      apellido,
      telefono,
      tipoDocumento,
      numeroDocumento,
      fechaNacimiento,
      ocupacion,
      nacionalidad,
      cuit,
      email,
      direccion = null
  ) {
      this.apellido = apellido;
      this.nombre = nombre;
      this.tipoDocumento = tipoDocumento;
      this.numeroDocumento = numeroDocumento;
      this.cuit = cuit || "";
      this.fechaNacimiento = fechaNacimiento;
      this.telefono = telefono || "";
      this.email = email || "";
      this.ocupacion = ocupacion;
      this.nacionalidad = nacionalidad;
      this.direccion = direccion;
  }

  getApellido() { return this.apellido; }     setApellido(v) { this.apellido = v; }
  getNombre() { return this.nombre; }         setNombre(v) { this.nombre = v; }
  getTipoDocumento() { return this.tipoDocumento; } setTipoDocumento(v) { this.tipoDocumento = v; }
  getNumeroDocumento() { return this.numeroDocumento; } setNumeroDocumento(v) { this.numeroDocumento = v; }
  getCuit() { return this.cuit; }             setCuit(v) { this.cuit = v; }
  getFechaNacimiento() { return this.fechaNacimiento; } setFechaNacimiento(v) { this.fechaNacimiento = v; }
  getTelefono() { return this.telefono; }     setTelefono(v) { this.telefono = v; }
  getEmail() { return this.email; }           setEmail(v) { this.email = v; }
  getOcupacion() { return this.ocupacion; }   setOcupacion(v) { this.ocupacion = v; }
  getNacionalidad() { return this.nacionalidad; } setNacionalidad(v) { this.nacionalidad = v; }
  getDireccion() { return this.direccion; }   setDireccion(v) { this.direccion = v; }
}

// =====================================================
// HABITACION DTO
// =====================================================
export class HabitacionDTO {
  constructor(numero, tipo, categoria, costoPorNoche, estadoHabitacion) {
    this.numero = numero;
    this.tipo = tipo;
    this.categoria = categoria;
    this.costoPorNoche = costoPorNoche;
    this.estadoHabitacion = estadoHabitacion;
  }

  getNumero() { return this.numero; }     setNumero(v) { this.numero = v; }
  getTipo() { return this.tipo; }         setTipo(v) { this.tipo = v; }
  getCategoria() { return this.categoria; } setCategoria(v) { this.categoria = v; }
  getCostoPorNoche() { return this.costoPorNoche; } setCostoPorNoche(v) { this.costoPorNoche = v; }
  getEstadoHabitacion() { return this.estadoHabitacion; } setEstadoHabitacion(v) { this.estadoHabitacion = v; }
}

// =====================================================
// RESERVA DTO
// =====================================================
export class ReservaDTO {
  constructor(id, fechaInicio, fechaFin, titular, estado, habitaciones, estadia = null) {
    this.id = id;
    this.fechaInicio = fechaInicio;
    this.fechaFin = fechaFin;
    this.titular = titular;
    this.estado = estado;
    this.habitaciones = habitaciones;
    this.estadia = estadia;
  }

  getId() { return this.id; }             setId(v) { this.id = v; }
  getFechaInicio() { return this.fechaInicio; } setFechaInicio(v) { this.fechaInicio = v; }
  getFechaFin() { return this.fechaFin; } setFechaFin(v) { this.fechaFin = v; }
  getTitular() { return this.titular; }   setTitular(v) { this.titular = v; }
  getEstado() { return this.estado; }     setEstado(v) { this.estado = v; }
  getHabitaciones() { return this.habitaciones; } setHabitaciones(v) { this.habitaciones = v; }
  getEstadia() { return this.estadia; }   setEstadia(v) { this.estadia = v; }
}

// =====================================================
// ESTADIA DTO
// =====================================================
export class EstadiaDTO {
  constructor(id, fechaCheckIn, fechaCheckOut, estado, reserva, titular, acompaniantes, consumos = []) {
    this.id = id;
    this.fechaCheckIn = fechaCheckIn;
    this.fechaCheckOut = fechaCheckOut;
    this.estado = estado;
    this.reserva = reserva;
    this.titular = titular;
    this.acompaniantes = acompaniantes;
    this.consumos = consumos;
  }

  getId() { return this.id; }                 setId(v) { this.id = v; }
  getFechaCheckIn() { return this.fechaCheckIn; } setFechaCheckIn(v) { this.fechaCheckIn = v; }
  getFechaCheckOut() { return this.fechaCheckOut; } setFechaCheckOut(v) { this.fechaCheckOut = v; }
  getEstado() { return this.estado; }         setEstado(v) { this.estado = v; }
  getConsumos() { return this.consumos; }     setConsumos(v) { this.consumos = v; }
  getReserva() { return this.reserva; }       setReserva(v) { this.reserva = v; }
  getTitular() { return this.titular; }       setTitular(v) { this.titular = v; }
  getAcompaniantes() { return this.acompaniantes; } setAcompaniantes(v) { this.acompaniantes = v; }
}

// =====================================================
// NOTA DE CREDITO DTO
// =====================================================
export class NotaDeCreditoDTO {
  constructor(idNota = null, fecha = null, responsable = null, facturas = [], tipo = null) {
    this.idNota = idNota;
    this.fecha = fecha;
    this.responsable = responsable;
    this.facturas = facturas;
    this.tipo = tipo;
  }

  getIdNota() { return this.idNota; }       setIdNota(v) { this.idNota = v; }
  getFecha() { return this.fecha; }         setFecha(v) { this.fecha = v; }
  getResponsable() { return this.responsable; } setResponsable(v) { this.responsable = v; }
  getFacturas() { return this.facturas; }   setFacturas(v) { this.facturas = v; }
  getTipo() { return this.tipo; }           setTipo(v) { this.tipo = v; }
}

// =====================================================
// FACTURA DTO
// =====================================================
export class FacturaDTO {
  constructor(id, hora, fecha, tipo, estado, responsableDePago, estadia, pagos = [], total = 0) {
    this.id = id;
    this.hora = hora;
    this.fecha = fecha;
    this.tipo = tipo;
    this.estado = estado;
    this.responsableDePago = responsableDePago;
    this.estadia = estadia;
    this.pagos = pagos;
    this.total = total;
  }

  getId() { return this.id; } setId(v) { this.id = v; }
  getHora() { return this.hora; } setHora(v) { this.hora = v; }
  getFecha() { return this.fecha; } setFecha(v) { this.fecha = v; }
  getTipo() { return this.tipo; } setTipo(v) { this.tipo = v; }
  getEstado() { return this.estado; } setEstado(v) { this.estado = v; }
  getResponsableDePago() { return this.responsableDePago; } setResponsableDePago(v) { this.responsableDePago = v; }
  getEstadia() { return this.estadia; } setEstadia(v) { this.estadia = v; }
  getPagos() { return this.pagos; } setPagos(v) { this.pagos = v; }
  getTotal() { return this.total; } setTotal(v) { this.total = v; }
}

// =====================================================
// PAGO DTO
// =====================================================
export class PagoDTO {
  constructor(id, fecha, hora, montoTotal, medioDePago) {
    this.id = id;
    this.fecha = fecha;
    this.hora = hora;
    this.montoTotal = montoTotal;
    this.medioDePago = medioDePago;
  }

  getId() { return this.id; }             setId(v) { this.id = v; }
  getFecha() { return this.fecha; }       setFecha(v) { this.fecha = v; }
  getHora() { return this.hora; }         setHora(v) { this.hora = v; }
  getMontoTotal() { return this.montoTotal; } setMontoTotal(v) { this.montoTotal = v; }
  getMedioDePago() { return this.medioDePago; } setMedioDePago(v) { this.medioDePago = v; }
}
