

let pagos = [];
let siguienteIdPago = 1;


export async function cargarPagos() {
  try {
    const respuesta = await fetch('/Datos/pagos.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    pagos = datos.pagos || [];
    
    
    if (pagos.length > 0) {
      siguienteIdPago = Math.max(...pagos.map(p => p.id || 0)) + 1;
    }
    
    console.log('Pagos cargados:', pagos.length);
  } catch (error) {
    console.error('Error al cargar pagos:', error);
    pagos = [];
  }
}


export function obtenerPagos() {
  return pagos;
}


export function obtenerPagosPorFactura(idFactura) {
  return pagos.filter(p => p.idFactura === idFactura);
}


export function calcularTotalPagado(idFactura) {
  const pagosFactura = obtenerPagosPorFactura(idFactura);
  return pagosFactura.reduce((total, pago) => total + (pago.monto || 0), 0);
}


export async function crearPago(datosPago) {
  const nuevoPago = {
    id: siguienteIdPago++,
    idFactura: datosPago.idFactura,
    fecha: datosPago.fecha || new Date().toISOString().split('T')[0],
    hora: datosPago.hora || new Date().toTimeString().slice(0, 5),
    medioPago: datosPago.medioPago,
    monto: datosPago.monto,
    detalles: datosPago.detalles || {}
  };
  
  pagos.push(nuevoPago);
  
  
  console.log('Pago creado:', nuevoPago);
  
  return nuevoPago;
}


export async function guardarPagos() {
  try {
    
    console.log('Guardando pagos:', pagos);
    
  } catch (error) {
    console.error('Error al guardar pagos:', error);
    throw error;
  }
}


cargarPagos();

