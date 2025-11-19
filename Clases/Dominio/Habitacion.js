import { EstadoHabitacion } from "./Enums.js";

/**
 * Habitacion - Clase que representa una habitación del hotel.
 * 
 * MÉTODOS PÚBLICOS (sin getters y setters):
 * - formatearNombre()
 *   → Formatea el nombre de la habitación en formato "TIPO-NUMERO" (ej: "IND-101").
 * 
 * - esDisponible()
 *   → Verifica si la habitación está disponible.
 * 
 * - estaReservada()
 *   → Verifica si la habitación está reservada.
 * 
 * - estaOcupada()
 *   → Verifica si la habitación está ocupada.
 * 
 * - estaFueraDeServicio()
 *   → Verifica si la habitación está fuera de servicio.
 * 
 * - cambiarEstado(nuevoEstado)
 *   → Cambia el estado de la habitación al estado especificado.
 * 
 * - calcularCostoTotal(numeroNoches)
 *   → Calcula el costo total de la habitación para un número específico de noches.
 * 
 * - coincideConTipo(tipo)
 *   → Verifica si la habitación coincide con un tipo específico.
 * 
 * - coincideConNumero(numero)
 *   → Verifica si la habitación coincide con un número específico.
 * 
 * - devolverEstado()
 *   → Retorna el estado actual de la habitación (método de compatibilidad).
 */
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

  /**
   * Formatea el nombre de la habitación en formato "TIPO-NUMERO"
   * @returns {string} Nombre formateado (ej: "IND-101")
   */
  formatearNombre() {
    return `${this._tipo}-${this._numero}`;
  }

  /**
   * Verifica si la habitación está disponible
   * @returns {boolean} true si está disponible
   */
  esDisponible() {
    return this._estadoHabitacion === EstadoHabitacion.DISPONIBLE;
  }

  /**
   * Verifica si la habitación está reservada
   * @returns {boolean} true si está reservada
   */
  estaReservada() {
    return this._estadoHabitacion === EstadoHabitacion.RESERVADA;
  }

  /**
   * Verifica si la habitación está ocupada
   * @returns {boolean} true si está ocupada
   */
  estaOcupada() {
    return this._estadoHabitacion === EstadoHabitacion.OCUPADA;
  }

  /**
   * Verifica si la habitación está fuera de servicio
   * @returns {boolean} true si está fuera de servicio
   */
  estaFueraDeServicio() {
    return this._estadoHabitacion === EstadoHabitacion.FUERA_DE_SERVICIO;
  }

  /**
   * Cambia el estado de la habitación al estado especificado
   * @param {string} nuevoEstado - Nuevo estado (debe ser un valor de EstadoHabitacion)
   * @returns {boolean} true si el estado se cambió correctamente
   */
  cambiarEstado(nuevoEstado) {
    // Validar que el estado sea uno de los estados válidos
    const estadosValidos = Object.values(EstadoHabitacion);
    if (!estadosValidos.includes(nuevoEstado)) {
      console.warn(`Estado inválido: ${nuevoEstado}. Estados válidos: ${estadosValidos.join(', ')}`);
      return false;
    }
    
    this._estadoHabitacion = nuevoEstado;
    return true;
  }

  /**
   * Calcula el costo total de la habitación para un número específico de noches
   * @param {number} numeroNoches - Número de noches
   * @returns {number} Costo total (costoPorNoche * numeroNoches)
   */
  calcularCostoTotal(numeroNoches) {
    if (!numeroNoches || numeroNoches <= 0) return 0;
    if (!this._costoPorNoche || this._costoPorNoche <= 0) return 0;
    
    return this._costoPorNoche * numeroNoches;
  }

  /**
   * Verifica si la habitación coincide con un tipo específico
   * @param {string} tipo - Tipo a comparar
   * @returns {boolean} true si coincide el tipo
   */
  coincideConTipo(tipo) {
    if (!tipo) return false;
    return this._tipo && this._tipo.toString().toUpperCase() === tipo.toString().toUpperCase();
  }

  /**
   * Verifica si la habitación coincide con un número específico
   * @param {number|string} numero - Número a comparar
   * @returns {boolean} true si coincide el número
   */
  coincideConNumero(numero) {
    if (!numero) return false;
    const numeroHabitacion = typeof this._numero === 'number' ? this._numero : parseInt(this._numero, 10);
    const numeroComparar = typeof numero === 'number' ? numero : parseInt(numero, 10);
    
    if (isNaN(numeroHabitacion) || isNaN(numeroComparar)) return false;
    
    return numeroHabitacion === numeroComparar;
  }

  /**
   * Retorna el estado actual de la habitación (método de compatibilidad)
   * @returns {string} Estado actual
   */
  devolverEstado() { 
    return this._estadoHabitacion; 
  }
}

export default Habitacion;

