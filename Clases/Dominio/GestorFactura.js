import Factura from "./Factura.js";
import NotaDeCredito from "./NotaDeCredito.js";
import { EstadoFactura, TipoFactura } from "./Enums.js";

/**
 * GestorFactura - Coordinador central para todas las operaciones relacionadas con facturas.
 * 
 * MÉTODOS PÚBLICOS:
 * - async generarFactura(estadia, responsableDePago, horaSalida, tipoFactura = 'B')
 *   → Genera 
 *  nueva factura a partir de una estadía y responsable de pago.
 * 
 * - async ingresarNotaCredito(facturas, responsable)
 *   → Procesa el ingreso de una nota de crédito para facturas anuladas.
 * 
 * - async ingresarPago(factura, datosPago)
 *   → Registra un pago asociado a una factura y actualiza su estado.
 * 
 * - async guardarFacturasEnBD(facturasJSON)
 *   → Guarda o actualiza facturas en la base de datos.
 * 
 * - async guardarNotaCreditoEnBD(notaCreditoJSON, idsFacturas)
 *   → Guarda una nota de crédito y sus relaciones con facturas.
 * 
 * - async guardarPagosEnBD(pagosJSON) [DEPRECADO]
 *   → Deprecado: Los pagos se guardan como parte de las facturas.
 * 
 * - convertirFacturaADTO(factura)
 *   → Convierte un objeto Factura de dominio a un DTO para la persistencia/transferencia de datos.
 * 
 * - convertirDTOAFactura(facturaDTO)
 *   → Convierte un DTO de factura (desde la base de datos u origen externo) a un objeto Factura de dominio.
 */
class GestorFactura {
  constructor() {
    this._rutaBDFacturas = '/Datos/facturas.json';
    this._rutaBDNotasCredito = '/Datos/nota_credito.json';
    this._rutaBDNotasCreditoFactura = '/Datos/nota_credito_factura.json';
    this._rutaBDPagos = '/Datos/pagos.json';
    this._gestorGenerar = null;
    this._gestorNotaCredito = null;
    this._gestorPago = null;
  }

  async generarFactura(estadia, responsableDePago, horaSalida, tipoFactura = 'B') {
    try {
      console.log('GestorFactura.generarFactura - Iniciando con:', { 
        estadia: estadia ? { id: estadia.id, tieneReserva: !!estadia.reserva } : null, 
        responsableDePago: responsableDePago ? { tipo: responsableDePago.razonSocial ? 'tercero' : 'huesped' } : null, 
        horaSalida, 
        tipoFactura 
      });
      
      if (!this._gestorGenerar) {
        console.log('Cargando GestorGenerarFactura...');
        try {
          const module = await import('../../GenerarFactura/JS/gestor-generar-factura.js');
          const { GestorGenerarFactura } = module;
          console.log('GestorGenerarFactura importado:', GestorGenerarFactura);
          this._gestorGenerar = new GestorGenerarFactura();
          console.log('Instancia de GestorGenerarFactura creada:', this._gestorGenerar);
        } catch (importError) {
          console.error('Error al importar GestorGenerarFactura:', importError);
          throw new Error('No se pudo cargar el módulo de generación de factura: ' + importError.message);
        }
      }

      console.log('Llamando a procesarFactura...');
      const factura = await this._gestorGenerar.procesarFactura(estadia, responsableDePago, horaSalida, tipoFactura);
      
      if (!factura) {
        console.error('La factura generada es null o undefined');
        throw new Error('No se pudo generar la factura - resultado nulo');
      }

      console.log('Factura generada exitosamente:', factura);

      // Guardar en BD (esto es simulado, solo loguea)
      try {
        await this.guardarFacturasEnBD([factura]);
        console.log('Factura guardada en BD (simulado)');
      } catch (errorBD) {
        console.warn('Error al guardar en BD (continuando):', errorBD);
        // No lanzar error, solo loguear
      }

      return factura;
    } catch (error) {
      console.error('Error completo en GestorFactura.generarFactura:', error);
      console.error('Tipo de error:', error.constructor.name);
      console.error('Mensaje:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  async ingresarNotaCredito(facturas, responsable) {
    try {
      if (!this._gestorNotaCredito) {
        const { GestorIngresarNotaCredito } = await import('../../IngresarNotaCredito/JS/gestor-ingresar-nota-credito.js');
        this._gestorNotaCredito = new GestorIngresarNotaCredito();
      }

      const notaCredito = await this._gestorNotaCredito.procesarNotaCredito(facturas, responsable);
      
      if (notaCredito) {
        const idsFacturas = facturas.map(f => f.id);
        await this.guardarNotaCreditoEnBD(notaCredito, idsFacturas);
        
        
        const facturasActualizadas = facturas.map(factura => ({
          ...factura,
          estado: EstadoFactura.ANULADA,
          notaDeCredito: {
            idNota: notaCredito.idNota,
            fecha: notaCredito.fecha
          }
        }));
        await this.guardarFacturasEnBD(facturasActualizadas);
      }

      return notaCredito;
    } catch (error) {
      console.error('Error al ingresar nota de crédito:', error);
      throw error;
    }
  }

  
  async ingresarPago(factura, datosPago) {
    try {
      if (!this._gestorPago) {
        const { GestorIngresarPago } = await import('../../IngresarPago/JS/gestor-ingresar-pago.js');
        this._gestorPago = new GestorIngresarPago();
      }

      // Los pagos se procesan y se agregan directamente a la factura (instancia de clase)
      // No se guardan en un JSON separado
      const pagos = await this._gestorPago.procesarPago(factura, datosPago);
      
      if (pagos && pagos.length > 0) {
        // Los pagos son instancias de la clase Pago y se agregan a la factura
        // No necesitamos guardarlos en un JSON separado
        
        // Actualizar la factura en BD con los nuevos pagos
        const facturaActual = await this._obtenerFacturaActualizada(factura.id);
        
        if (facturaActual) {
          // Convertir pagos a formato JSON para guardar en BD
          const pagosJSON = pagos.map(pago => {
            // Si es instancia de Pago, convertir a JSON
            if (pago.montoTotal !== undefined || pago.getMontoTotal) {
              const monto = pago.montoTotal || (pago.getMontoTotal ? pago.getMontoTotal() : 0);
              const fecha = pago.fecha || (pago.getFecha ? pago.getFecha() : new Date().toISOString().split('T')[0]);
              const hora = pago.hora || (pago.getHora ? pago.getHora() : new Date().toTimeString().slice(0, 5));
              const medioDePago = pago.medioDePago || (pago.getMedioDePago ? pago.getMedioDePago() : null);
              
              return {
                id: pago.id || (pago.getId ? pago.getId() : null),
                idFactura: factura.id,
                fecha: fecha,
                hora: hora,
                monto: monto,
                medioDePago: medioDePago
              };
            }
            // Si ya es JSON, retornarlo tal cual
            return pago;
          });
          
          // Obtener pagos previos de la factura
          const pagosPrevios = facturaActual.pagos || [];
          
          // Calcular totales
          const total = facturaActual.detalle?.total || 0;
          const totalPagadoPrevios = pagosPrevios.reduce((sum, p) => sum + (p.monto || p.montoTotal || 0), 0);
          const totalNuevosPagos = pagosJSON.reduce((sum, p) => sum + (p.monto || 0), 0);
          const nuevoTotalPagado = totalPagadoPrevios + totalNuevosPagos;
          
          // Actualizar estado si está pagada
          if (nuevoTotalPagado >= total) {
            facturaActual.estado = EstadoFactura.PAGADA;
          }
          
          // Agregar nuevos pagos a los existentes
          facturaActual.pagos = [...pagosPrevios, ...pagosJSON];
          
          // Guardar factura actualizada en BD
          await this.guardarFacturasEnBD([facturaActual]);
        }
      }

      return pagos;
    } catch (error) {
      console.error('Error al ingresar pago:', error);
      throw error;
    }
  }

  
  async guardarFacturasEnBD(facturasJSON) {
    try {
      let facturasExistentes = [];
      try {
        const respuesta = await fetch(this._rutaBDFacturas);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          facturasExistentes = datos.facturas || [];
        }
      } catch (error) {
        console.warn('No se pudieron cargar facturas existentes, se creará un nuevo archivo');
      }

      
      const facturasActualizadas = [...facturasExistentes];
      
      
      facturasJSON.forEach(facturaNueva => {
        if (!facturaNueva.id) {
          
          const maxId = facturasActualizadas.length > 0
            ? Math.max(...facturasActualizadas.map(f => f.id || 0))
            : 0;
          facturaNueva.id = maxId + 1;
        }
        
        const indiceExistente = facturasActualizadas.findIndex(f => f.id === facturaNueva.id);
        if (indiceExistente !== -1) {
          facturasActualizadas[indiceExistente] = facturaNueva;
        } else {
          facturasActualizadas.push(facturaNueva);
        }
      });

      console.log('Facturas a guardar en BD:', facturasActualizadas);
      
      
      
    } catch (error) {
      console.error('Error al guardar facturas en BD:', error);
      throw error;
    }
  }
  

  
  async guardarNotaCreditoEnBD(notaCreditoJSON, idsFacturas) {
    try {
      
      let notasCreditoExistentes = [];
      try {
        const respuesta = await fetch(this._rutaBDNotasCredito);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          notasCreditoExistentes = datos.notasCredito || [];
        }
      } catch (error) {
        console.warn('No se pudieron cargar notas de crédito existentes');
      }

      
      if (!notaCreditoJSON.idNota) {
        const maxId = notasCreditoExistentes.length > 0
          ? Math.max(...notasCreditoExistentes.map(nc => nc.idNota || 0))
          : 0;
        notaCreditoJSON.idNota = maxId + 1;
      }

      notasCreditoExistentes.push(notaCreditoJSON);

      
      let relacionesExistentes = [];
      try {
        const respuesta = await fetch(this._rutaBDNotasCreditoFactura);
        if (respuesta.ok) {
          const datos = await respuesta.json();
          relacionesExistentes = datos.nota_credito_factura || [];
        }
      } catch (error) {
        console.warn('No se pudieron cargar relaciones nota_credito_factura existentes');
      }

      idsFacturas.forEach(idFactura => {
        relacionesExistentes.push({
          idNotaCredito: notaCreditoJSON.idNota,
          idFactura: idFactura
        });
      });

      console.log('Nota de crédito a guardar en BD:', notaCreditoJSON);
      console.log('Relaciones nota_credito_factura a guardar:', relacionesExistentes.length);
      
      
      
    } catch (error) {
      console.error('Error al guardar nota de crédito en BD:', error);
      throw error;
    }
  }

  
  // DEPRECADO: Los pagos se guardan como parte de las facturas
  // Este método se mantiene por compatibilidad pero ya no se usa
  async guardarPagosEnBD(pagosJSON) {
    console.warn('guardarPagosEnBD() está deprecado. Los pagos se guardan como parte de las facturas.');
    // Los pagos se guardan junto con las facturas, no en un JSON separado
  }

  
  
  
  

  
  async _obtenerFacturaActualizada(idFactura) {
    try {
      const respuesta = await fetch(this._rutaBDFacturas);
      if (!respuesta.ok) {
        return null;
      }
      const datos = await respuesta.json();
      const facturas = datos.facturas || [];
      return facturas.find(f => f.id === idFactura) || null;
    } catch (error) {
      console.error('Error al obtener factura actualizada:', error);
      return null;
    }
  }

  
  async buscarFacturasParaNotaCredito(dniCuit) {
    try {
      if (!this._gestorNotaCredito) {
        const { GestorIngresarNotaCredito } = await import('../../IngresarNotaCredito/JS/gestor-ingresar-nota-credito.js');
        this._gestorNotaCredito = new GestorIngresarNotaCredito();
      }

      return await this._gestorNotaCredito.buscarFacturasNoAnuladas(dniCuit);
    } catch (error) {
      console.error('Error al buscar facturas para nota de crédito:', error);
      throw error;
    }
  }

  
  async buscarResponsableParaNotaCredito(dniCuit) {
    try {
      if (!this._gestorNotaCredito) {
        const { GestorIngresarNotaCredito } = await import('../../IngresarNotaCredito/JS/gestor-ingresar-nota-credito.js');
        this._gestorNotaCredito = new GestorIngresarNotaCredito();
      }

      return await this._gestorNotaCredito.buscarResponsable(dniCuit);
    } catch (error) {
      console.error('Error al buscar responsable para nota de crédito:', error);
      throw error;
    }
  }

  
  async buscarFacturasParaPago(numeroHabitacion) {
    try {
      if (!this._gestorPago) {
        const { GestorIngresarPago } = await import('../../IngresarPago/JS/gestor-ingresar-pago.js');
        this._gestorPago = new GestorIngresarPago();
      }

      return await this._gestorPago.buscarFacturasPendientes(numeroHabitacion);
    } catch (error) {
      console.error('Error al buscar facturas para pago:', error);
      throw error;
    }
  }
}


const gestorFactura = new GestorFactura();
if (typeof window !== 'undefined') {
  window.gestorFactura = gestorFactura;
}

export default GestorFactura;

