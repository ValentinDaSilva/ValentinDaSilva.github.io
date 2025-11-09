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

export default Persona;

