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

  
  static async modificarHuespedCompleto(event) {
    try {
      // Determinar qué botón generó el evento
      const botonGuardar = document.getElementById('boton-guardar');
      const botonBorrar = document.getElementById('boton-borrar');
      let operacion = null;

      
      const datosFormulario = GestorModificarHuesped.extraerDatosFormulario();
      console.log('Datos extraídos del formulario:', datosFormulario);

      const huespedDominio = GestorModificarHuesped.crearHuespedDominio(datosFormulario);
      console.log('Huesped de dominio creado:', huespedDominio);

      const huespedDTO = GestorModificarHuesped.crearHuespedDTO(huespedDominio);
      console.log('HuespedDTO creado:', huespedDTO);

      
      if (event && event.target) {
        if (botonGuardar && event.target === botonGuardar) {
          operacion = 'modificacion';
        } else if (botonBorrar && event.target === botonBorrar) {
          operacion = 'eliminar';
        } else {
          throw new Error('Evento generado por un botón desconocido');
        }
      } else {
        throw new Error('No se pasó un evento válido');
      }

      await GestorModificarHuesped.guardarEnBD(huespedDTO, operacion);

      return true;
    } catch (error) {
      console.error('Error al procesar la operación de huésped:', error);
      mensajeError('Error al procesar la operación de huésped: ' + error.message);
      return false;
    }
  }
}

window.GestorHuesped = GestorHuesped;
