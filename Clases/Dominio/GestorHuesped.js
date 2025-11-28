import Huesped from "./Huesped.js";

/**
/**
 * GestorHuesped - Coordinador central para todas las operaciones relacionadas con huéspedes.
 * 
 * MÉTODOS PÚBLICOS:
 * - async darAltaHuesped()
 *   → Procesa el alta de un nuevo huésped extrayendo datos de la UI y guardándolos.
 * 
 * - async buscarHuespedes()
 *   → Busca huéspedes según los criterios ingresados en el formulario de búsqueda.
 * 
 * - async modificarHuespedCompleto()
 *   → Procesa la modificación de un huésped existente con validaciones y persistencia.
 * 
 * - async guardarEnBD(jsonData, operacion = 'alta')
 *   → Guarda o actualiza un huésped en la base de datos (alta o modificación).
 * 
 * - convertirHuespedADTO(huesped)
 *   → Convierte un objeto Huesped de dominio a un DTO para la persistencia/transferencia de datos.
 * 
 * - convertirDTOAHuesped(huespedDTO)
 *   → Convierte un DTO de huésped (desde la base de datos u origen externo) a un objeto Huesped de dominio.
 * 
 */
class GestorHuesped {
  constructor() { 
    this.huespedes = []; 
    this._rutaBD = '/Datos/huespedes.json';
    this._gestorAlta = null;
    this._gestorBuscar = null;
    this._gestorModificar = null;
  }

  
  normalizarHuesped(huesped) {
    if (!huesped || typeof huesped !== 'object') {
      return null;
    }

    const nombres = (huesped.nombres ?? huesped.nombre ?? '').toString().trim();
    const numeroDocumentoRaw = huesped.numeroDocumento ?? huesped.nroDocumento ?? huesped.documento ?? '';
    const numeroDocumento = numeroDocumentoRaw === null || numeroDocumentoRaw === undefined
      ? ''
      : String(numeroDocumentoRaw).trim();
    const tipoDocumento = (huesped.tipoDocumento ?? huesped.tipoDoc ?? '').toString().trim();

    return {
      ...huesped,
      apellido: (huesped.apellido ?? '').toString().trim(),
      nombres,
      nombre: huesped.nombre ?? nombres,
      numeroDocumento,
      nroDocumento: huesped.nroDocumento ?? numeroDocumento,
      tipoDocumento
    };
  }

  
  normalizarDatosHuespedes(datosCrudos) {
    if (!datosCrudos) {
      return [];
    }

    const lista = Array.isArray(datosCrudos)
      ? datosCrudos
      : (Array.isArray(datosCrudos.huespedes) ? datosCrudos.huespedes : []);

    return lista
      .map(huesped => this.normalizarHuesped(huesped))
      .filter(Boolean);
  }

  
  
  async guardarEnBD(jsonData, operacion = 'alta') {
    try {
      const respuesta = await fetch(this._rutaBD);
      let huespedesExistentes = [];
      
      if (respuesta.ok) {
        const datos = await respuesta.json();
        huespedesExistentes = this.normalizarDatosHuespedes(datos);
      }

      if (operacion === 'alta') {
        huespedesExistentes.push(jsonData);
        console.log('Simulando guardado en BD. Total de huéspedes:', huespedesExistentes.length);
        console.log('Nuevo huésped a guardar:', jsonData);
      } else if (operacion === 'modificacion') {
        const indice = huespedesExistentes.findIndex(h => 
          h.tipoDocumento === jsonData.tipoDocumento && 
          h.numeroDocumento === jsonData.numeroDocumento
        );

        if (indice !== -1) {
          huespedesExistentes[indice] = jsonData;
          console.log('Simulando guardado en BD. Total de huéspedes:', huespedesExistentes.length);
          console.log('Huésped modificado a guardar:', jsonData);
        } else {
          huespedesExistentes.push(jsonData);
          console.log('Huésped no encontrado, se agregó como nuevo:', jsonData);
    }
      }

      
      
    } catch (error) {
      console.error('Error al guardar en BD:', error);
      throw error;
  }
  }
  
  
  async darAltaHuesped() {
    try {
      
      if (!this._gestorAlta) {
        if (window.gestorAltaHuesped) {
          this._gestorAlta = window.gestorAltaHuesped;
        } else {
          const { GestorAltaHuesped } = await import('../../AltaHuesped/JS/gestor-huesped.js');
          this._gestorAlta = new GestorAltaHuesped();
        }
      }

      
      const datosFormulario = this._gestorAlta.extraerDatosFormulario();
      console.log('Datos extraídos del formulario:', datosFormulario);

      
      const huespedDominio = this._gestorAlta.crearHuespedDominio(datosFormulario);
      console.log('Huesped de dominio creado:', huespedDominio);

      
      if (!huespedDominio.verificarMayorEdad()) {
        mensajeError('El huésped debe ser mayor de edad');
        return false;
      }

      
      const huespedDTO = this._gestorAlta.crearHuespedDTO(huespedDominio);
      const direccionDTO = huespedDTO.direccion;
      console.log('HuespedDTO creado:', huespedDTO);

      
      const jsonParaBD = this._gestorAlta.convertirDTOAJSON(huespedDTO, direccionDTO, datosFormulario);

      
      this._gestorAlta.mostrarJSONEnPantalla(jsonParaBD);

      
      await this.guardarEnBD(jsonParaBD, 'alta');

      
      this.darDeAlta(huespedDominio);

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

export default GestorHuesped;


const gestorHuesped = new GestorHuesped();


window.gestorHuesped = gestorHuesped;

