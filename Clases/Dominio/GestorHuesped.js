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

          
          
          
          await GestorAltaHuesped.guardarEnBD(huespedDTO, 'alta');

          

          return true;
      } catch (error) {
          console.error('Error al procesar el alta de huésped:', error);
          mensajeError('Error al procesar el alta de huésped: ' + error.message);
          return false;
      }
  }

  
  static async buscarHuespedes() {
        try {
                
          const datosFormulario = GestorBuscarHuesped.extraerDatosFormulario();
          console.log('Datos extraídos del formulario:', datosFormulario);
          
          
          const resultado = await GestorBuscarHuesped.buscarHuespedesEnAPI(
              datosFormulario.apellido,
              datosFormulario.nombre,
              datosFormulario.tipoDocumento,
              datosFormulario.numeroDocumento
          );

          if (resultado.error) {
              throw new Error(resultado.error);
          }

          
          const resultados = Array.isArray(resultado.data) ? resultado.data : [];
          console.log(`Se encontraron ${resultados.length} resultados`);
          
          
          GestorBuscarHuesped.renderizarResultados(resultados);
          
          
          GestorBuscarHuesped.mostrarResultados();
          
          
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
