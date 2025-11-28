export class DireccionDTO {
  constructor(calle, numero, piso, departamento, localidad, provincia, codigoPostal, pais) {
    this._calle = calle;
    this._numero = numero;
    this._piso = piso;
    this._departamento = departamento;
    this._localidad = localidad;
    this._provincia = provincia;
    this._codigoPostal = codigoPostal;
    this._pais = pais;
  }

  get calle() { return this._calle; } set calle(v) { this._calle = v; }
  get numero() { return this._numero; } set numero(v) { this._numero = v; }
  get piso() { return this._piso; } set piso(v) { this._piso = v; }
  get departamento() { return this._departamento; } set departamento(v) { this._departamento = v; }
  get localidad() { return this._localidad; } set localidad(v) { this._localidad = v; }
  get ciudad() { return this._localidad; } set ciudad(v) { this._localidad = v; }
  get provincia() { return this._provincia; } set provincia(v) { this._provincia = v; }
  get codigoPostal() { return this._codigoPostal; } set codigoPostal(v) { this._codigoPostal = v; }
  get pais() { return this._pais; } set pais(v) { this._pais = v; }
}

export class PersonaDTO {
  constructor(nombre, apellido, telefono) {
    this._nombre = nombre;
    this._apellido = apellido;
    this._telefono = telefono;
  }
  get nombre() { return this._nombre; } set nombre(v) { this._nombre = v; }
  get apellido() { return this._apellido; } set apellido(v) { this._apellido = v; }
  get telefono() { return this._telefono; } set telefono(v) { this._telefono = v; }
}

export class HuespedDTO {
  constructor(
      apellido,
      nombre,
      tipoDocumento,
      numeroDocumento,
      cuit,
      fechaNacimiento,
      telefono,
      email,
      ocupacion,
      nacionalidad,
      direccion = null
  ) {
      this._apellido = apellido;
      this._nombre = nombre;
      this._tipoDocumento = tipoDocumento;
      this._nroDocumento = numeroDocumento;
      this._cuit = cuit || '';
      this._fechaNacimiento = fechaNacimiento;
      this._telefono = telefono || '';
      this._email = email || '';
      this._ocupacion = ocupacion;
      this._nacionalidad = nacionalidad;
      this._direccion = direccion; // DireccionDTO
  }

  // ======== GETTERS ========
  getApellido() { return this._apellido; }
  getNombre() { return this._nombre; }
  getTipoDocumento() { return this._tipoDocumento; }
  getNumeroDocumento() { return this._nroDocumento; }
  getNroDocumento() { return this._nroDocumento; }
  getCuit() { return this._cuit; }
  getFechaNacimiento() { return this._fechaNacimiento; }
  getTelefono() { return this._telefono; }
  getEmail() { return this._email; }
  getOcupacion() { return this._ocupacion; }
  getNacionalidad() { return this._nacionalidad; }
  getDireccion() { return this._direccion; }

  // ======== SETTERS ========
  setApellido(v) { this._apellido = v; }
  setNombre(v) { this._nombre = v; }
  setTipoDocumento(v) { this._tipoDocumento = v; }
  setNumeroDocumento(v) { this._nroDocumento = v; }
  setNroDocumento(v) { this._nroDocumento = v; }
  setCuit(v) { this._cuit = v; }
  setFechaNacimiento(v) { this._fechaNacimiento = v; }
  setTelefono(v) { this._telefono = v; }
  setEmail(v) { this._email = v; }
  setOcupacion(v) { this._ocupacion = v; }
  setNacionalidad(v) { this._nacionalidad = v; }
  setDireccion(v) { this._direccion = v; }
}

export class HabitacionDTO {
  constructor(numero, tipo, categoria, costoPorNoche, estadoHabitacion) {
    this._numero = numero;
    this._tipo = tipo;
    this._categoria = categoria;
    this._costoPorNoche = costoPorNoche;
    this._estadoHabitacion = estadoHabitacion;
  }

  get numero() { return this._numero; } set numero(v) { this._numero = v; }
  get tipo() { return this._tipo; } set tipo(v) { this._tipo = v; }
  get categoria() { return this._categoria; } set categoria(v) { this._categoria = v; }
  get costoPorNoche() { return this._costoPorNoche; } set costoPorNoche(v) { this._costoPorNoche = v; }
  get estadoHabitacion() { return this._estadoHabitacion; } set estadoHabitacion(v) { this._estadoHabitacion = v; }
}

export class ReservaDTO {
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
}

export class EstadiaDTO {
  constructor(id, fechaCheckIn, fechaCheckOut, estado, reserva, titular, acompaniantes, consumos = []) {
    this._id = id;
    this._fechaCheckIn = fechaCheckIn;
    this._fechaCheckOut = fechaCheckOut;
    this._estado = estado;
    this._reserva = reserva;
    this._titular = titular;
    this._acompaniantes = acompaniantes;
    this._consumos = consumos;
  }

  get id() { return this._id; } set id(v) { this._id = v; }
  get fechaCheckIn() { return this._fechaCheckIn; } set fechaCheckIn(v) { this._fechaCheckIn = v; }
  get fechaCheckOut() { return this._fechaCheckOut; } set fechaCheckOut(v) { this._fechaCheckOut = v; }
  get estado() { return this._estado; } set estado(v) { this._estado = v; }
  get consumos() { return this._consumos; } set consumos(v) { this._consumos = v; }
  get reserva() { return this._reserva; } set reserva(v) { this._reserva = v; }
  get titular() { return this._titular; } set titular(v) { this._titular = v; }
  get acompaniantes() { return this._acompaniantes; } set acompaniantes(v) { this._acompaniantes = v; }
}

export class NotaDeCreditoDTO {
  constructor(idNota = null, fecha = null, responsable = null, facturas = [], tipo = null) {
    this._idNota = idNota;
    this._fecha = fecha;
    this._responsable = responsable;
    this._facturas = facturas;
    this._tipo = tipo;
  }

  get idNota() { return this._idNota; } set idNota(v) { this._idNota = v; }
  get fecha() { return this._fecha; } set fecha(v) { this._fecha = v; }
  get responsable() { return this._responsable; } set responsable(v) { this._responsable = v; }
  get facturas() { return this._facturas; } set facturas(v) { this._facturas = v; }
  get tipo() { return this._tipo; } set tipo(v) { this._tipo = v; }
}

export class FacturaDTO {
  constructor(id, hora, fecha, tipo, estado, responsableDePago, estadia, pagos = [], total = 0) {
    this._id = id;
    this._hora = hora;
    this._fecha = fecha;
    this._tipo = tipo;
    this._estado = estado;
    this._responsableDePago = responsableDePago;
    this._estadia = estadia;
    this._pagos = pagos;
    this._total = total;
  }

  get id() { return this._id; } set id(v) { this._id = v; }
  get hora() { return this._hora; } set hora(v) { this._hora = v; }
  get fecha() { return this._fecha; } set fecha(v) { this._fecha = v; }
  get tipo() { return this._tipo; } set tipo(v) { this._tipo = v; }
  get estado() { return this._estado; } set estado(v) { this._estado = v; }
  get responsableDePago() { return this._responsableDePago; } set responsableDePago(v) { this._responsableDePago = v; }
  get estadia() { return this._estadia; } set estadia(v) { this._estadia = v; }
  get pagos() { return this._pagos; } set pagos(v) { this._pagos = v; }
  get total() { return this._total; } set total(v) { this._total = v; }
}

export class PagoDTO {
  constructor(id, fecha, hora, montoTotal, medioDePago) {
    this._id = id;
    this._fecha = fecha;
    this._hora = hora;
    this._montoTotal = montoTotal;
    this._medioDePago = medioDePago;
  }

  get id() { return this._id; } set id(v) { this._id = v; }
  get fecha() { return this._fecha; } set fecha(v) { this._fecha = v; }
  get hora() { return this._hora; } set hora(v) { this._hora = v; }
  get montoTotal() { return this._montoTotal; } set montoTotal(v) { this._montoTotal = v; }
  get medioDePago() { return this._medioDePago; } set medioDePago(v) { this._medioDePago = v; }
}

