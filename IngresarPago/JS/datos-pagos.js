/* Gestión de datos de pagos desde pagos.json */

let pagos = [];
let siguienteIdPago = 1;

/**
 * Carga los pagos desde el archivo JSON
 * @returns {Promise<void>}
 */
export async function cargarPagos() {
  try {
    const respuesta = await fetch('/Datos/pagos.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    pagos = datos.pagos || [];
    
    // Calcular el siguiente ID
    if (pagos.length > 0) {
      siguienteIdPago = Math.max(...pagos.map(p => p.id || 0)) + 1;
    }
    
    console.log('Pagos cargados:', pagos.length);
  } catch (error) {
    console.error('Error al cargar pagos:', error);
    pagos = [];
  }
}

/**
 * Obtiene todos los pagos cargados
 * @returns {Array} - Array de pagos
 */
export function obtenerPagos() {
  return pagos;
}

/**
 * Obtiene los pagos de una factura específica
 * @param {number} idFactura - ID de la factura
 * @returns {Array} - Array de pagos de la factura
 */
export function obtenerPagosPorFactura(idFactura) {
  return pagos.filter(p => p.idFactura === idFactura);
}

/**
 * Calcula el total pagado de una factura
 * @param {number} idFactura - ID de la factura
 * @returns {number} - Total pagado
 */
export function calcularTotalPagado(idFactura) {
  const pagosFactura = obtenerPagosPorFactura(idFactura);
  return pagosFactura.reduce((total, pago) => total + (pago.monto || 0), 0);
}

/**
 * Crea un nuevo pago
 * @param {Object} datosPago - Datos del pago
 * @returns {Promise<Object>} - Pago creado
 */
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
  
  // En un entorno real, aquí se guardaría en el servidor
  console.log('Pago creado:', nuevoPago);
  
  return nuevoPago;
}

/**
 * Guarda los pagos en el archivo JSON (simulado)
 * @returns {Promise<void>}
 */
export async function guardarPagos() {
  try {
    // En un entorno real, esto se haría con una llamada al servidor
    console.log('Guardando pagos:', pagos);
    // Simulación: solo se guarda en memoria
  } catch (error) {
    console.error('Error al guardar pagos:', error);
    throw error;
  }
}

// Cargar pagos al inicializar el módulo
cargarPagos();

