

let facturas = [];


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


export function obtenerFacturas() {
  return facturas;
}


export function obtenerFacturasNoAnuladasPorResponsable(dniCuit) {
  
  const dniCuitNormalizado = dniCuit.replace(/[-\s]/g, '');
  
  console.log('Buscando facturas para DNI/CUIT:', dniCuitNormalizado);
  console.log('Total de facturas cargadas:', facturas.length);
  
  return facturas.filter(factura => {
    
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
      const coincide = responsableCuitNormalizado === dniCuitNormalizado;
      if (coincide) {
        console.log('Factura encontrada (tercero):', factura.id);
      }
      return coincide;
    }
    
    
    if (tipoNormalizado === 'HUESPED') {
      const documentoNormalizado = (responsable.documento || '').replace(/[-\s]/g, '');
      const cuitNormalizado = (responsable.cuit || '').replace(/[-\s]/g, '');
      const coincide = documentoNormalizado === dniCuitNormalizado || cuitNormalizado === dniCuitNormalizado;
      if (coincide) {
        console.log('Factura encontrada (huésped):', factura.id);
      }
      return coincide;
    }
    
    return false;
  });
}


export async function actualizarFactura(facturaActualizada) {
  const index = facturas.findIndex(f => f.id === facturaActualizada.id);
  if (index !== -1) {
    facturas[index] = facturaActualizada;
    console.log('Factura actualizada:', facturaActualizada);
  }
}


export async function actualizarFacturas(facturasActualizadas) {
  facturasActualizadas.forEach(factura => {
    const index = facturas.findIndex(f => f.id === factura.id);
    if (index !== -1) {
      facturas[index] = factura;
    }
  });
  console.log('Facturas actualizadas:', facturasActualizadas.length);
}


cargarFacturas();




