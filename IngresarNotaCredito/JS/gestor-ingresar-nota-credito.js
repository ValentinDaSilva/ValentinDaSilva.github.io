
import GestorFactura from "../../Clases/Dominio/GestorFactura.js";
import { TipoFactura } from "../../Clases/Dominio/Enums.js";


class GestorIngresarNotaCredito extends GestorFactura {
  constructor() {
    super();
    this._facturas = [];
    this._notasCredito = [];
    this._notasCreditoFactura = [];
    this._responsables = [];
  }

  
  async cargarDatos() {
    try {
      await this._cargarFacturas();
      await this._cargarNotasCredito();
      await this._cargarNotasCreditoFactura();
      await this._cargarResponsables();
    } catch (error) {
      console.error('Error al cargar datos:', error);
      throw error;
    }
  }

  
  async _cargarFacturas() {
    try {
      const respuesta = await fetch('/Datos/facturas.json');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        this._facturas = datos.facturas || [];
      } else {
        this._facturas = [];
      }
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      this._facturas = [];
    }
  }

  
  async _cargarNotasCredito() {
    try {
      const respuesta = await fetch('/Datos/nota_credito.json');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        this._notasCredito = datos.notasCredito || [];
      } else {
        this._notasCredito = [];
      }
    } catch (error) {
      console.error('Error al cargar notas de crédito:', error);
      this._notasCredito = [];
    }
  }

  
  async _cargarNotasCreditoFactura() {
    try {
      const respuesta = await fetch('/Datos/nota_credito_factura.json');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        this._notasCreditoFactura = datos.nota_credito_factura || [];
      } else {
        this._notasCreditoFactura = [];
      }
    } catch (error) {
      console.error('Error al cargar relaciones nota_credito_factura:', error);
      this._notasCreditoFactura = [];
    }
  }

  
  async _cargarResponsables() {
    try {
      const respuesta = await fetch('/Datos/responsables_pago.json');
      if (respuesta.ok) {
        const datos = await respuesta.json();
        this._responsables = datos.responsables || [];
      } else {
        this._responsables = [];
      }
    } catch (error) {
      console.error('Error al cargar responsables:', error);
      this._responsables = [];
    }
  }

  
  async buscarFacturasNoAnuladas(dniCuit) {
    try {
      await this._cargarFacturas();
      
      const dniCuitNormalizado = dniCuit.replace(/[-\s]/g, '');
      
      return this._facturas.filter(factura => {
        
        const estadoNormalizado = (factura.estado || '').toUpperCase().trim();
        if (estadoNormalizado === 'ANULADA') {
          return false;
        }
        
        
        const responsable = factura.responsableDePago;
        if (!responsable) {
          return false;
        }
        
        
        const tipoNormalizado = (responsable.tipo || '').toUpperCase().trim();
        
        
        if (tipoNormalizado === 'TERCERO') {
          const responsableCuitNormalizado = (responsable.cuit || '').replace(/[-\s]/g, '');
          return responsableCuitNormalizado === dniCuitNormalizado;
        }
        
        
        if (tipoNormalizado === 'HUESPED') {
          const documentoNormalizado = (responsable.documento || '').replace(/[-\s]/g, '');
          const cuitNormalizado = (responsable.cuit || '').replace(/[-\s]/g, '');
          return documentoNormalizado === dniCuitNormalizado || cuitNormalizado === dniCuitNormalizado;
        }
        
        return false;
      });
    } catch (error) {
      console.error('Error al buscar facturas no anuladas:', error);
      throw error;
    }
  }

  
  async buscarResponsable(dniCuit) {
    try {
      await this._cargarResponsables();
      
      const dniCuitNormalizado = dniCuit.replace(/[-\s]/g, '');
      
      return this._responsables.find(responsable => {
        if (responsable.cuit) {
          const cuitNormalizado = responsable.cuit.replace(/[-\s]/g, '');
          return cuitNormalizado === dniCuitNormalizado;
        }
        if (responsable.numeroDocumento) {
          const documentoNormalizado = responsable.numeroDocumento.replace(/[-\s]/g, '');
          return documentoNormalizado === dniCuitNormalizado;
        }
        return false;
      }) || null;
    } catch (error) {
      console.error('Error al buscar responsable:', error);
      throw error;
    }
  }

  
  async procesarNotaCredito(facturas, responsable) {
    try {
      if (!facturas || facturas.length === 0) {
        throw new Error('Debe seleccionar al menos una factura');
      }

      if (!responsable) {
        throw new Error('Debe seleccionar un responsable');
      }

      
      const total = facturas.reduce((acc, factura) => {
        return acc + (factura.detalle?.total || 0);
      }, 0);

      
      const esInscripto = this.esResponsableInscripto(responsable);
      let subtotal, iva;
      
      if (esInscripto) {
        
        subtotal = total / 1.21;
        iva = this.calcularIVA(subtotal);
      } else {
        
        subtotal = total;
        iva = 0;
      }

      
      const tipo = esInscripto ? TipoFactura.A : TipoFactura.B;

      
      const fecha = new Date().toISOString().split('T')[0];

      
      const notaCredito = {
        idNota: null, 
        fecha: fecha,
        tipo: tipo,
        total: total,
        subtotal: subtotal,
        iva: iva,
        responsable: responsable,
        facturas: facturas
      };

      
      if (typeof window.mostrarNotaCreditoEnPantalla === 'function') {
        window.mostrarNotaCreditoEnPantalla(notaCredito);
      }

      return notaCredito;
    } catch (error) {
      console.error('Error al procesar nota de crédito:', error);
      throw error;
    }
  }

  
  calcularIVA(subtotal) {
    return subtotal * 0.21;
  }

  
  esResponsableInscripto(responsable) {
    if (!responsable) return false;
    
    if (responsable.condicionIVA) {
      const condicionNormalizada = (responsable.condicionIVA || '').toUpperCase().trim();
      return condicionNormalizada === 'RESPONSABLE_INSCRIPTO' || 
             condicionNormalizada === 'RESPONSABLE INSCRIPTO' ||
             condicionNormalizada === 'INSCRIPTO';
    }
    
    if (responsable.tipo === 'tercero') {
      return true;
    }
    
    return false;
  }
}


export { GestorIngresarNotaCredito };

const gestorIngresarNotaCredito = new GestorIngresarNotaCredito();
if (typeof window !== 'undefined') {
  window.gestorIngresarNotaCredito = gestorIngresarNotaCredito;
}

