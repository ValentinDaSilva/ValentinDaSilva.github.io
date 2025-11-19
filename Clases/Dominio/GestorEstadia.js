import Estadia from "./Estadia.js";
import { EstadoEstadia } from "./Enums.js";

/**
 * GestorEstadia - Coordinador central para todas las operaciones relacionadas con estadías.
 * 
 * MÉTODOS PÚBLICOS:
 * - async ocuparHabitacion(reservaSeleccionada, titularSeleccionado, acompaniantesSeleccionados)
 *   → Procesa la ocupación de una habitación creando una estadía a partir de una reserva.
 * 
 * - crearEstadia(reserva, titular, acompaniantes = [], fechaCheckIn, fechaCheckOut = null)
 *   → Crea una nueva instancia de estadía con los datos proporcionados.
 * 
 * - registrarCheckIn(fecha, habitaciones)
 *   → Registra el check-in de una estadía en una fecha específica.
 * 
 * - registrarCheckOut(id, fecha)
 *   → Registra el check-out de una estadía por ID.
 * 
 * - agregarConsumos(id, descripcion, monto)
 *   → Agrega consumos a una estadía existente por ID.
 * 
 * - verConsumos(id)
 *   → Retorna los consumos asociados a una estadía por ID.
 * 
 * - async guardarEstadiaEnBD(estadiaJSON)
 *   → Guarda una estadía en la base de datos.
 */
class GestorEstadia {
  constructor() { 
    this.estadias = [];
    this._rutaBD = '/Datos/estadia.json';
    this._gestorOcupar = null;
  }

  
  _obtenerSiguienteId() {
    if (this.estadias.length === 0) {
      return 1;
    }
    const maxId = Math.max(...this.estadias.map(e => e.id));
    return maxId + 1;
  }

  
  crearEstadia(reserva, titular, acompaniantes = [], fechaCheckIn, fechaCheckOut = null) {
    const siguienteId = this._obtenerSiguienteId();
    const estadia = new Estadia(
      siguienteId,
      fechaCheckIn,
      fechaCheckOut,
      EstadoEstadia.EN_CURSO,
      reserva,
      titular,
      acompaniantes
    );
    this.estadias.push(estadia);
    return estadia;
  }

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

  
  async guardarEstadiaEnBD(estadiaJSON) {
    try {
      const respuesta = await fetch(this._rutaBD);
      let estadiasExistentes = [];
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        estadiasExistentes = datos.estadias || [];
      }

      estadiasExistentes.push(estadiaJSON);

      console.log('Simulando guardado en BD. Total de estadías:', estadiasExistentes.length);
      console.log('Nueva estadía a guardar:', estadiaJSON);

      
    } catch (error) {
      console.error('Error al guardar estadía en BD:', error);
      throw error;
    }
  }

  
  async ocuparHabitacion(reservaSeleccionada, titularSeleccionado, acompaniantesSeleccionados) {
    try {
      
      if (!this._gestorOcupar) {
        if (window.gestorOcuparHabitacion) {
          this._gestorOcupar = window.gestorOcuparHabitacion;
        } else {
          const { GestorOcuparHabitacion } = await import('../../OcuparHabitacion/JS/gestor-ocupar-habitacion.js');
          this._gestorOcupar = new GestorOcuparHabitacion();
        }
      }

      
      await this._gestorOcupar.cargarReservas();

      
      const datosEstadia = this._gestorOcupar.procesarDatosEstadia(
        reservaSeleccionada,
        titularSeleccionado,
        acompaniantesSeleccionados || []
      );

      
      const estadia = this.crearEstadia(
        datosEstadia.reserva,
        datosEstadia.titular,
        datosEstadia.acompaniantes,
        datosEstadia.fechaCheckIn,
        datosEstadia.fechaCheckOut
      );

      
      if (typeof window.convertirEstadiaAJSON === 'function') {
        const estadiaJSON = window.convertirEstadiaAJSON(estadia);
        
        if (typeof window.mostrarJSONEstadiaEnPantalla === 'function') {
          window.mostrarJSONEstadiaEnPantalla(estadia, function() {
            mensajeCorrecto(`Estadía creada exitosamente.<br>Presione cualquier tecla para continuar.`);
            
            document.addEventListener('keydown', function limpiarEstadia() {
              const modalCorrecto = document.getElementById('modal-correcto');
              if (modalCorrecto) {
                modalCorrecto.style.display = 'none';
              }
              
              const contenedorJSON = document.getElementById('contenedor-json-estadia');
              if (contenedorJSON) {
                contenedorJSON.style.display = 'none';
              }
              
              location.reload();
              document.removeEventListener('keydown', limpiarEstadia);
            }, { once: true });
          });
        }

        
        await this.guardarEstadiaEnBD(estadiaJSON);
      }

      return true;
    } catch (error) {
      console.error('Error al ocupar habitación:', error);
      mensajeError('Error al ocupar la habitación: ' + error.message);
      return false;
    }
  }
}

export default GestorEstadia;


const gestorEstadia = new GestorEstadia();


window.gestorEstadia = gestorEstadia;

