// ==========================
// DTOs (solo atributos + getters/setters)
// ==========================

class DireccionDTO {
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
  get provincia() { return this._provincia; } set provincia(v) { this._provincia = v; }
  get codigoPostal() { return this._codigoPostal; } set codigoPostal(v) { this._codigoPostal = v; }
  get pais() { return this._pais; } set pais(v) { this._pais = v; }
}

class PersonaDTO {
  constructor(nombre, apellido, telefono) {
    this._nombre = nombre;
    this._apellido = apellido;
    this._telefono = telefono;
  }
  get nombre() { return this._nombre; } set nombre(v) { this._nombre = v; }
  get apellido() { return this._apellido; } set apellido(v) { this._apellido = v; }
  get telefono() { return this._telefono; } set telefono(v) { this._telefono = v; }
}

class HuespedDTO extends PersonaDTO {
  constructor(nombre, apellido, telefono, tipoDocumento, nroDocumento, fechaNacimiento, ocupacion, nacionalidad, cuit, email, direccion = null, condicionIVA = null) {
    super(nombre, apellido, telefono);
    this._tipoDocumento = tipoDocumento;
    this._nroDocumento = nroDocumento;
    this._fechaNacimiento = fechaNacimiento;
    this._ocupacion = ocupacion;
    this._nacionalidad = nacionalidad;
    this._cuit = cuit;
    this._email = email;
    this._direccion = direccion;
    this._condicionIVA = condicionIVA;
  }

  get tipoDocumento() { return this._tipoDocumento; } set tipoDocumento(v) { this._tipoDocumento = v; }
  get nroDocumento() { return this._nroDocumento; } set nroDocumento(v) { this._nroDocumento = v; }
  get fechaNacimiento() { return this._fechaNacimiento; } set fechaNacimiento(v) { this._fechaNacimiento = v; }
  get ocupacion() { return this._ocupacion; } set ocupacion(v) { this._ocupacion = v; }
  get nacionalidad() { return this._nacionalidad; } set nacionalidad(v) { this._nacionalidad = v; }
  get cuit() { return this._cuit; } set cuit(v) { this._cuit = v; }
  get email() { return this._email; } set email(v) { this._email = v; }
  get direccion() { return this._direccion; } set direccion(v) { this._direccion = v; }
  get condicionIVA() { return this._condicionIVA; } set condicionIVA(v) { this._condicionIVA = v; }
}

class HabitacionDTO {
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

class ReservaDTO {
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

class EstadiaDTO {
  constructor(id, fechaCheckIn, fechaCheckOut, estado, consumos, reserva, titular, acompaniantes) {
    this._id = id;
    this._fechaCheckIn = fechaCheckIn;
    this._fechaCheckOut = fechaCheckOut;
    this._estado = estado;
    this._consumos = consumos;
    this._reserva = reserva;
    this._titular = titular;
    this._acompaniantes = acompaniantes;
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

