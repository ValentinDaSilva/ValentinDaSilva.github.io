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
 * Obtiene las facturas pendientes para una habitación específica
 * @param {number} numeroHabitacion - Número de habitación
 * @returns {Array} - Array de facturas pendientes
 */
export function obtenerFacturasPendientesPorHabitacion(numeroHabitacion) {
  return facturas.filter(factura => {
    // Obtener número de habitación (puede estar en estadia.habitacion.numero)
    const habitacionFactura = factura.estadia?.habitacion?.numero;
    
    // Verificar que la habitación coincida (comparar como números)
    const habitacionCoincide = habitacionFactura === parseInt(numeroHabitacion) || habitacionFactura === numeroHabitacion;
    
    // Verificar estado pendiente (acepta diferentes formatos: "Pendiente", "PENDIENTE", etc.)
    const estadoNormalizado = (factura.estado || '').toUpperCase().trim();
    const estadoPendiente = estadoNormalizado === 'PENDIENTE';
    
    return habitacionCoincide && estadoPendiente;
  });
}

/**
 * Obtiene una factura por su ID
 * @param {number} idFactura - ID de la factura
 * @returns {Object|null} - Factura encontrada o null
 */
export function obtenerFacturaPorId(idFactura) {
  return facturas.find(f => f.id === idFactura) || null;
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
    // En un entorno real, aquí se guardaría en el servidor
    console.log('Factura actualizada:', facturaActualizada);
  }
}

/**
 * Guarda las facturas en el archivo JSON (simulado)
 * @returns {Promise<void>}
 */
export async function guardarFacturas() {
  try {
    // En un entorno real, esto se haría con una llamada al servidor
    console.log('Guardando facturas:', facturas);
    // Simulación: solo se guarda en memoria
  } catch (error) {
    console.error('Error al guardar facturas:', error);
    throw error;
  }
}

// Cargar facturas al inicializar el módulo
cargarFacturas();

