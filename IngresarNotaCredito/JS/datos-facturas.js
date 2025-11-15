/* Gestión de datos de facturas desde facturas.json */

let facturas = [];

/**
 * Carga las facturas desde el archivo JSON
 * @returns {Promise<void>}
 */
export async function cargarFacturas() {
  try {
    const respuesta = await fetch('/Datos/facturas.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    facturas = datos.facturas || [];
    console.log('Facturas cargadas:', facturas.length);
  } catch (error) {
    console.error('Error al cargar facturas:', error);
    facturas = [];
  }
}

/**
 * Obtiene todas las facturas cargadas
 * @returns {Array} - Array de facturas
 */
export function obtenerFacturas() {
  return facturas;
}

/**
 * Obtiene las facturas no anuladas de un responsable de pago
 * @param {string} dniCuit - DNI o CUIT del responsable
 * @returns {Array} - Array de facturas no anuladas
 */
export function obtenerFacturasNoAnuladasPorResponsable(dniCuit) {
  // Normalizar el DNI/CUIT (remover guiones y espacios)
  const dniCuitNormalizado = dniCuit.replace(/[-\s]/g, '');
  
  return facturas.filter(factura => {
    // Verificar que no esté anulada
    if (factura.estado === 'Anulada') {
      return false;
    }
    
    // Buscar por responsable de pago
    const responsable = factura.responsableDePago;
    if (!responsable) {
      return false;
    }
    
    // Si es un tercero (empresa)
    if (responsable.tipo === 'tercero') {
      const responsableCuitNormalizado = (responsable.cuit || '').replace(/[-\s]/g, '');
      return responsableCuitNormalizado === dniCuitNormalizado;
    }
    
    // Si es un huésped
    if (responsable.tipo === 'huesped') {
      const documentoNormalizado = (responsable.documento || '').replace(/[-\s]/g, '');
      const cuitNormalizado = (responsable.cuit || '').replace(/[-\s]/g, '');
      return documentoNormalizado === dniCuitNormalizado || cuitNormalizado === dniCuitNormalizado;
    }
    
    return false;
  });
}

/**
 * Actualiza una factura en el array
 * @param {Object} facturaActualizada - Factura con datos actualizados
 * @returns {Promise<void>}
 */
export async function actualizarFactura(facturaActualizada) {
  const index = facturas.findIndex(f => f.id === facturaActualizada.id);
  if (index !== -1) {
    facturas[index] = facturaActualizada;
    console.log('Factura actualizada:', facturaActualizada);
  }
}

/**
 * Actualiza múltiples facturas
 * @param {Array} facturasActualizadas - Array de facturas actualizadas
 * @returns {Promise<void>}
 */
export async function actualizarFacturas(facturasActualizadas) {
  facturasActualizadas.forEach(factura => {
    const index = facturas.findIndex(f => f.id === factura.id);
    if (index !== -1) {
      facturas[index] = factura;
    }
  });
  console.log('Facturas actualizadas:', facturasActualizadas.length);
}

// Cargar facturas al inicializar el módulo
cargarFacturas();


