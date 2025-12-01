

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


export function obtenerFacturasPendientesPorHabitacion(numeroHabitacion) {
  return facturas.filter(factura => {
    
    const habitacionFactura = factura.estadia?.habitacion?.numero;
    
    
    const habitacionCoincide = habitacionFactura === parseInt(numeroHabitacion) || habitacionFactura === numeroHabitacion;
    
    
    const estadoNormalizado = (factura.estado || '').toUpperCase().trim();
    const estadoPendiente = estadoNormalizado === 'PENDIENTE';
    
    return habitacionCoincide && estadoPendiente;
  });
}


export function obtenerFacturaPorId(idFactura) {
  return facturas.find(f => f.id === idFactura) || null;
}


export async function actualizarFactura(facturaActualizada) {
  const index = facturas.findIndex(f => f.id === facturaActualizada.id);
  if (index !== -1) {
    facturas[index] = facturaActualizada;
    
    console.log('Factura actualizada:', facturaActualizada);
  }
}


export async function guardarFacturas() {
  try {
    
    console.log('Guardando facturas:', facturas);
    
  } catch (error) {
    console.error('Error al guardar facturas:', error);
    throw error;
  }
}


cargarFacturas();

