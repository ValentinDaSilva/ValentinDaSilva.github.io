import { EstadoHabitacion } from "./Enums.js";

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

export default Habitacion;

