

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
    console.log('Evaluando factura ID:', factura.id);
    
    const estadoNormalizado = (factura.estado || '').toUpperCase().trim();
    if (estadoNormalizado === 'ANULADA') {
      console.log('  - Factura anulada, saltando');
      return false;
    }
    
    
    const responsable = factura.responsableDePago;
    if (!responsable) {
      console.log('  - Sin responsable, saltando');
      return false;
    }
    
    
    const tipoNormalizado = (responsable.tipo || '').toUpperCase().trim();
    console.log('  - Tipo responsable:', tipoNormalizado);
    
    
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
      console.log('  - Documento responsable:', documentoNormalizado, 'vs buscado:', dniCuitNormalizado);
      console.log('  - CUIT responsable:', cuitNormalizado, 'vs buscado:', dniCuitNormalizado);
      
      let cuitEstadiaNormalizado = '';
      let documentoEstadiaNormalizado = '';
      if (factura.estadia && factura.estadia.titular) {
        if (factura.estadia.titular.cuit) {
          cuitEstadiaNormalizado = (factura.estadia.titular.cuit || '').replace(/[-\s]/g, '');
          console.log('  - CUIT estadía:', cuitEstadiaNormalizado);
        }
        if (factura.estadia.titular.numeroDocumento) {
          documentoEstadiaNormalizado = (factura.estadia.titular.numeroDocumento || '').replace(/[-\s]/g, '');
          console.log('  - Documento estadía:', documentoEstadiaNormalizado);
        }
      }
      
      const coincide = documentoNormalizado === dniCuitNormalizado || 
                       cuitNormalizado === dniCuitNormalizado || 
                       documentoEstadiaNormalizado === dniCuitNormalizado ||
                       cuitEstadiaNormalizado === dniCuitNormalizado;
      if (coincide) {
        console.log('  ✓ Factura encontrada (huésped):', factura.id);
      } else {
        console.log('  ✗ No coincide');
      }
      return coincide;
    }
    
    return false;
  });
}


export function extraerResponsableDesdeFacturas(facturasEncontradas) {
  if (!facturasEncontradas || facturasEncontradas.length === 0) {
    return null;
  }
  
  const primeraFactura = facturasEncontradas[0];
  const responsableFactura = primeraFactura.responsableDePago;
  
  if (!responsableFactura) {
    return null;
  }
  
  const tipoNormalizado = (responsableFactura.tipo || '').toUpperCase().trim();
  
  if (tipoNormalizado === 'TERCERO') {
    return {
      tipo: 'tercero',
      razonSocial: responsableFactura.razonSocial || '',
      cuit: responsableFactura.cuit || '',
      telefono: responsableFactura.telefono || null,
      direccion: responsableFactura.direccion || null
    };
  }
  
  if (tipoNormalizado === 'HUESPED') {
    let documento = responsableFactura.documento || '';
    let cuit = responsableFactura.cuit || null;
    
    if (primeraFactura.estadia && primeraFactura.estadia.titular) {
      if (!documento && primeraFactura.estadia.titular.numeroDocumento) {
        documento = primeraFactura.estadia.titular.numeroDocumento;
      }
      if (!cuit && primeraFactura.estadia.titular.cuit) {
        cuit = primeraFactura.estadia.titular.cuit;
      }
      if (!responsableFactura.apellido && primeraFactura.estadia.titular.apellido) {
        responsableFactura.apellido = primeraFactura.estadia.titular.apellido;
      }
      if (!responsableFactura.nombres && primeraFactura.estadia.titular.nombre) {
        responsableFactura.nombres = primeraFactura.estadia.titular.nombre;
      }
    }
    
    return {
      tipo: 'huesped',
      apellido: responsableFactura.apellido || '',
      nombres: responsableFactura.nombres || '',
      documento: documento,
      cuit: cuit
    };
  }
  
  return null;
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




