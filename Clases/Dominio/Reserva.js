import { EstadoReserva } from "./Enums.js";

/**
 * Reserva - Clase que representa una reserva del hotel.
 * 
 * MÉTODOS PÚBLICOS (sin getters y setters):
 * - calcularNumeroNoches()
 *   → Calcula el número de noches entre fechaInicio y fechaFin.
 * 
 * - generarArrayFechas()
 *   → Genera un array con todas las fechas entre fechaInicio y fechaFin en formato YYYY-MM-DD.
 * 
 * - incluyeFecha(fecha)
 *   → Verifica si una fecha específica está dentro del rango de la reserva.
 * 
 * - seSolapaCon(fechaInicioOtra, fechaFinOtra)
 *   → Verifica si la reserva se solapa con otro rango de fechas.
 * 
 * - incluyeHabitacion(numeroHabitacion)
 *   → Verifica si la reserva incluye una habitación específica por su número.
 * 
 * - agregarHabitacion(habitacion)
 *   → Agrega una habitación a la lista de habitaciones de la reserva.
 * 
 * - formatearFechaInicio(formato = 'YYYY-MM-DD')
 *   → Formatea la fecha de inicio según el formato especificado.
 * 
 * - formatearFechaFin(formato = 'YYYY-MM-DD')
 *   → Formatea la fecha de fin según el formato especificado.
 * 
 * - compararFechas(fecha1, fecha2)
 *   → Método estático para comparar dos fechas en formato YYYY-MM-DD.
 */
class Reserva {
  constructor(id, fechaInicio, fechaFin, titular, estado = EstadoReserva.PENDIENTE) {
    this._id = id; //Tipo number
    this._fechaInicio = new Date(fechaInicio); //Tipo Date
    this._fechaFin = new Date(fechaFin); //Tipo Date
    this._titular = titular; //Tipo Huesped
    this._estado = estado; //Tipo EstadoReserva
    this._habitaciones = []; //Tipo Habitacion
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

  /**
   * Calcula el número de noches entre fechaInicio y fechaFin
   * @returns {number} Número de noches
   */
  calcularNumeroNoches() {
    if (!this._fechaInicio || !this._fechaFin) return 0;
    
    const inicio = new Date(this._fechaInicio);
    const fin = new Date(this._fechaFin);
    
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    const diffTime = Math.abs(fin - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Genera un array con todas las fechas entre fechaInicio y fechaFin
   * @returns {Array<string>} Array de fechas en formato YYYY-MM-DD
   */
  generarArrayFechas() {
    if (!this._fechaInicio || !this._fechaFin) return [];
    
    const fechas = [];
    const inicio = new Date(this._fechaInicio);
    const fin = new Date(this._fechaFin);
    
    inicio.setHours(0, 0, 0, 0);
    fin.setHours(0, 0, 0, 0);
    
    const fechaActual = new Date(inicio);
    
    while (fechaActual <= fin) {
      const año = fechaActual.getFullYear();
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaActual.getDate()).padStart(2, '0');
      fechas.push(`${año}-${mes}-${dia}`);
      
      fechaActual.setDate(fechaActual.getDate() + 1);
    }
    
    return fechas;
  }

  /**
   * Verifica si una fecha específica está dentro del rango de la reserva
   * @param {string|Date} fecha - Fecha a verificar en formato YYYY-MM-DD o Date
   * @returns {boolean} true si la fecha está dentro del rango
   */
  incluyeFecha(fecha) {
    if (!this._fechaInicio || !this._fechaFin || !fecha) return false;
    
    const fechaInicio = new Date(this._fechaInicio);
    const fechaFin = new Date(this._fechaFin);
    const fechaVerificar = fecha instanceof Date ? fecha : new Date(fecha);
    
    fechaInicio.setHours(0, 0, 0, 0);
    fechaFin.setHours(0, 0, 0, 0);
    fechaVerificar.setHours(0, 0, 0, 0);
    
    return fechaVerificar >= fechaInicio && fechaVerificar <= fechaFin;
  }

  /**
   * Verifica si la reserva se solapa con otro rango de fechas
   * @param {string|Date} fechaInicioOtra - Fecha de inicio del otro rango
   * @param {string|Date} fechaFinOtra - Fecha de fin del otro rango
   * @returns {boolean} true si hay solapamiento
   */
  seSolapaCon(fechaInicioOtra, fechaFinOtra) {
    if (!this._fechaInicio || !this._fechaFin || !fechaInicioOtra || !fechaFinOtra) return false;
    
    const inicio1 = new Date(this._fechaInicio);
    const fin1 = new Date(this._fechaFin);
    const inicio2 = fechaInicioOtra instanceof Date ? fechaInicioOtra : new Date(fechaInicioOtra);
    const fin2 = fechaFinOtra instanceof Date ? fechaFinOtra : new Date(fechaFinOtra);
    
    inicio1.setHours(0, 0, 0, 0);
    fin1.setHours(0, 0, 0, 0);
    inicio2.setHours(0, 0, 0, 0);
    fin2.setHours(0, 0, 0, 0);
    
    // Verificar solapamiento: las fechas se solapan si hay intersección
    return (inicio1 <= fin2 && fin1 >= inicio2);
  }

  /**
   * Verifica si la reserva incluye una habitación específica
   * @param {number|string} numeroHabitacion - Número de la habitación a verificar
   * @returns {boolean} true si la habitación está incluida
   */
  incluyeHabitacion(numeroHabitacion) {
    if (!this._habitaciones || this._habitaciones.length === 0) return false;
    
    const numero = typeof numeroHabitacion === 'string' ? parseInt(numeroHabitacion, 10) : numeroHabitacion;
    
    return this._habitaciones.some(hab => {
      const numHab = typeof hab === 'object' ? (hab.numero || hab.getNumero) : null;
      if (numHab) {
        const num = typeof numHab === 'function' ? numHab() : numHab;
        return num === numero;
      }
      return false;
    });
  }

  /**
   * Agrega una habitación a la lista de habitaciones de la reserva
   * @param {Object} habitacion - Instancia de Habitacion o objeto habitación
   */
  agregarHabitacion(habitacion) {
    if (habitacion) {
      this._habitaciones.push(habitacion);
    }
  }

  /**
   * Formatea la fecha de inicio según el formato especificado
   * @param {string} formato - Formato deseado: 'YYYY-MM-DD' o 'DD/MM/YYYY'
   * @returns {string} Fecha formateada
   */
  formatearFechaInicio(formato = 'YYYY-MM-DD') {
    if (!this._fechaInicio) return '';
    
    const fecha = new Date(this._fechaInicio);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    
    if (formato === 'DD/MM/YYYY') {
      return `${dia}/${mes}/${año}`;
    }
    
    return `${año}-${mes}-${dia}`;
  }

  /**
   * Formatea la fecha de fin según el formato especificado
   * @param {string} formato - Formato deseado: 'YYYY-MM-DD' o 'DD/MM/YYYY'
   * @returns {string} Fecha formateada
   */
  formatearFechaFin(formato = 'YYYY-MM-DD') {
    if (!this._fechaFin) return '';
    
    const fecha = new Date(this._fechaFin);
    const año = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    
    if (formato === 'DD/MM/YYYY') {
      return `${dia}/${mes}/${año}`;
    }
    
    return `${año}-${mes}-${dia}`;
  }

  /**
   * Método estático para comparar dos fechas en formato YYYY-MM-DD o DD/MM/YYYY
   * @param {string} fecha1 - Primera fecha
   * @param {string} fecha2 - Segunda fecha
   * @returns {number} Negativo si fecha1 < fecha2, 0 si son iguales, positivo si fecha1 > fecha2
   */
  static compararFechas(fecha1, fecha2) {
    if (!fecha1 || !fecha2) return 0;
    
    // Detectar formato
    const formato1 = fecha1.includes('/') ? 'DD/MM/YYYY' : 'YYYY-MM-DD';
    const formato2 = fecha2.includes('/') ? 'DD/MM/YYYY' : 'YYYY-MM-DD';
    
    let partes1, partes2;
    
    if (formato1 === 'DD/MM/YYYY') {
      partes1 = fecha1.split('/').map(Number);
    } else {
      partes1 = fecha1.split('-').map(Number);
    }
    
    if (formato2 === 'DD/MM/YYYY') {
      partes2 = fecha2.split('/').map(Number);
    } else {
      partes2 = fecha2.split('-').map(Number);
    }
    
    // Normalizar a YYYY-MM-DD para comparar
    const año1 = formato1 === 'DD/MM/YYYY' ? partes1[2] : partes1[0];
    const mes1 = formato1 === 'DD/MM/YYYY' ? partes1[1] : partes1[1];
    const dia1 = formato1 === 'DD/MM/YYYY' ? partes1[0] : partes1[2];
    
    const año2 = formato2 === 'DD/MM/YYYY' ? partes2[2] : partes2[0];
    const mes2 = formato2 === 'DD/MM/YYYY' ? partes2[1] : partes2[1];
    const dia2 = formato2 === 'DD/MM/YYYY' ? partes2[0] : partes2[2];
    
    if (año1 !== año2) return año1 - año2;
    if (mes1 !== mes2) return mes1 - mes2;
    return dia1 - dia2;
  }
}

export default Reserva;

