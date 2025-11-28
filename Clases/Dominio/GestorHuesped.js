import {Huesped} from "./Huesped.js";
import {HuespedDTO} from "../DTO/dto.js";



export default class GestorHuesped {
  constructor() { 
    this.huespedes = []; 
    this._rutaBD = '/Datos/huespedes.json';
    this._gestorAlta = null;
    this._gestorBuscar = null;
    this._gestorModificar = null;
  }

  
  
  static async darAltaHuesped() {
      try {
          

          if(!GestorAltaHuesped.validarTodosLosCampos()) return;

          const datosFormulario = GestorAltaHuesped.extraerDatosFormulario();
          console.log('Datos extraídos del formulario:', datosFormulario);

          
          const huespedDominio = GestorAltaHuesped.crearHuespedDominio(datosFormulario);
          
          
          console.log('Huesped de dominio creado:', huespedDominio);

          
          const huespedDTO = GestorAltaHuesped.crearHuespedDTO(huespedDominio);
          
          
          console.log('HuespedDTO creado:', huespedDTO);

          
          const jsonParaBD = JSON.stringify(huespedDTO);
          
          
          await GestorAltaHuesped.guardarEnBD(jsonParaBD, 'alta');

          

          return true;
      } catch (error) {
          console.error('Error al procesar el alta de huésped:', error);
          mensajeError('Error al procesar el alta de huésped: ' + error.message);
          return false;
      }
  }

  
  async buscarHuespedes() {
    try {
      
      if (!this._gestorBuscar) {
        if (window.gestorBuscarHuesped) {
          this._gestorBuscar = window.gestorBuscarHuesped;
        } else {
          const { GestorBuscarHuesped } = await import('../../BuscarHuesped/JS/gestor-buscar-huesped.js');
          this._gestorBuscar = new GestorBuscarHuesped();
        }
      }

      
      if (this._gestorBuscar._datosHuespedes.length === 0) {
        await this._gestorBuscar.cargarHuespedes();
        if (this._gestorBuscar._datosHuespedes.length === 0) {
          mensajeError('No se pudieron cargar los datos. Por favor, recarga la página.');
          return false;
        }
      }

      
      const datosFormulario = this._gestorBuscar.extraerDatosFormulario();
      console.log('Datos extraídos del formulario:', datosFormulario);

      
      const resultados = this._gestorBuscar.filtrarHuespedes(
        datosFormulario.apellido,
        datosFormulario.nombres,
        datosFormulario.tipoDocumento,
        datosFormulario.numeroDocumento
      );

      console.log(`Se encontraron ${resultados.length} resultados`);

      
      this._gestorBuscar.renderizarResultados(resultados);

      
      this._gestorBuscar.mostrarResultados();

      
      setTimeout(() => {
        if (typeof inicializarTablaResultados === 'function') {
          inicializarTablaResultados();
        } else {
          console.error('La función inicializarTablaResultados no está disponible');
        }
      }, 200);

      return true;
    } catch (error) {
      console.error('Error al procesar la búsqueda:', error);
      mensajeError('Error al procesar la búsqueda: ' + error.message);
      return false;
    }
  }

  
  async modificarHuespedCompleto(callbackCerrar = null) {
    try {
      
      if (!this._gestorModificar) {
        if (window.gestorModificarHuesped) {
          this._gestorModificar = window.gestorModificarHuesped;
        } else {
          const { GestorModificarHuesped } = await import('../../ModificarHuesped/JS/gestor-modificar-huesped.js');
          this._gestorModificar = new GestorModificarHuesped();
        }
      }

      
      const datosFormulario = this._gestorModificar.extraerDatosFormulario();
      console.log('Datos extraídos del formulario:', datosFormulario);

      
      const huespedDominio = this._gestorModificar.crearHuespedDominio(datosFormulario);
      console.log('Huesped de dominio creado:', huespedDominio);

      
      if (!huespedDominio.verificarMayorEdad()) {
        mensajeError('El huésped debe ser mayor de edad');
        return false;
      }

      
      const huespedDTO = this._gestorModificar.crearHuespedDTO(huespedDominio);
      const direccionDTO = huespedDTO.direccion;
      console.log('HuespedDTO creado:', huespedDTO);

      
      const jsonParaBD = this._gestorModificar.convertirDTOAJSON(huespedDTO, direccionDTO, datosFormulario);

      
      mostrarJSONModificacionEnPantalla(jsonParaBD, this._gestorModificar.obtenerHuespedOriginal(), callbackCerrar);

      
      await this.guardarEnBD(jsonParaBD, 'modificacion');

      
      this.modificarHuesped(huespedDominio.numeroDocumento || huespedDominio.nroDocumento, {
        nombre: huespedDominio.nombre,
        apellido: huespedDominio.apellido,
        telefono: huespedDominio.telefono,
        tipoDocumento: huespedDominio.tipoDocumento,
        fechaNacimiento: huespedDominio.fechaNacimiento,
        ocupacion: huespedDominio.ocupacion,
        nacionalidad: huespedDominio.nacionalidad,
        cuit: huespedDominio.cuit,
        email: huespedDominio.email,
        direccion: huespedDominio.direccion
      });

      return true;
    } catch (error) {
      console.error('Error al procesar la modificación de huésped:', error);
      mensajeError('Error al procesar la modificación de huésped: ' + error.message);
      return false;
    }
  }
  darDeAlta(huesped) {
    if (!huesped.verificarMayorEdad()) throw new Error("El huésped debe ser mayor de edad");
    this.huespedes.push(huesped);
  }

  darDeBaja(nroDoc) { 
    this.huespedes = this.huespedes.filter(h => h.numeroDocumento !== nroDoc && h.nroDocumento !== nroDoc); 
  }
  
  buscarHuesped(nroDoc) { 
    return this.huespedes.find(h => h.numeroDocumento === nroDoc || h.nroDocumento === nroDoc) || null; 
  }

  modificarHuesped(nroDoc, datos) {
    const h = this.buscarHuesped(nroDoc);
    if (h) Object.assign(h, datos);
  }

  
}

window.GestorHuesped = GestorHuesped;
