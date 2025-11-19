import { EstadoEstadia } from "./Enums.js";

/**
 * Estadia - Clase que representa una estadía en el hotel.
 * 
 * MÉTODOS PÚBLICOS (sin getters y setters):
 * - registrarCheckIn(fecha)
 *   → Registra el check-in de la estadía en una fecha específica.
 * 
 * - registrarCheckOut(fecha)
 *   → Registra el check-out de la estadía y finaliza la estadía.
 * 
 * - agregarConsumos(descripcion, monto)
 *   → Agrega un consumo a la estadía con descripción y monto.
 * 
 * - verConsumos()
 *   → Retorna la lista de consumos de la estadía.
 * 
 * - calcularNumeroNoches(fechaFin = null)
 *   → Calcula el número de noches entre fechaCheckIn y fechaCheckOut.
 * 
 * - calcularValorEstadia()
 *   → Calcula el valor total de la estadía basado en el costo por noche y número de noches.
 * 
 * - obtenerCostoPorNoche()
 *   → Obtiene el costo por noche de la habitación asociada.
 */
class Estadia {
  constructor(id, fechaCheckIn, fechaCheckOut, estado = EstadoEstadia.EN_CURSO, reserva, titular, acompaniantes) {
    this._id = id;
    this._fechaCheckIn = new Date(fechaCheckIn);
    this._fechaCheckOut = new Date(fechaCheckOut);
    this._estado = estado;
    this._consumos = []; 
    this._reserva = reserva; 
    this._titular = titular; 
    this._acompaniantes = acompaniantes; 
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


  get reserva() { return this._reserva; }
  set reserva(v) { this._reserva = v; }

  get titular() { return this._titular; }
  set titular(v) { this._titular = v; }

  get acompaniantes() { return this._acompaniantes; }
  set acompaniantes(v) { this._acompaniantes = v; }

  
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

  /**
   * Calcula el número de noches entre fechaCheckIn y fechaCheckOut
   * @param {string|Date} fechaFin - Fecha de fin (opcional, usa fechaCheckOut si no se proporciona)
   * @returns {number} Número de noches
   */
  calcularNumeroNoches(fechaFin = null) {
    if (!this._fechaCheckIn) return 0;
    
    const inicio = new Date(this._fechaCheckIn);
    const fin = fechaFin ? new Date(fechaFin) : (this._fechaCheckOut ? new Date(this._fechaCheckOut) : new Date());
    
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(fin - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Calcula el valor de la estadía basado en el costo por noche y número de noches
   * @returns {number} Valor total de la estadía
   */
  calcularValorEstadia() {
    if (!this._reserva || !this._reserva.habitaciones || this._reserva.habitaciones.length === 0) {
      return 0;
    }
    
    const habitacion = this._reserva.habitaciones[0];
    const costoPorNoche = habitacion.costoPorNoche || habitacion.costoNoche || 0;
    const numeroNoches = this.calcularNumeroNoches();
    
    return costoPorNoche * numeroNoches;
  }

  /**
   * Obtiene el costo por noche de la habitación asociada
   * @returns {number} Costo por noche
   */
  obtenerCostoPorNoche() {
    if (!this._reserva || !this._reserva.habitaciones || this._reserva.habitaciones.length === 0) {
      return 0;
    }
    
    const habitacion = this._reserva.habitaciones[0];
    return habitacion.costoPorNoche || habitacion.costoNoche || 0;
  }
}

export default Estadia;

