/* Carga y gestión de datos de facturas */

let todasLasFacturas = [];
let facturasCargadas = false;

/**
 * Carga las facturas desde el archivo JSON
 * @returns {Promise<Array>} - Array de facturas
 */
export async function cargarFacturas() {
  if (facturasCargadas) {
    return todasLasFacturas;
  }

  try {
    const respuesta = await fetch('../Datos/facturas.json');
    if (!respuesta.ok) {
      throw new Error('Error al cargar facturas');
    }
    const datos = await respuesta.json();
    todasLasFacturas = datos.facturas || [];
    facturasCargadas = true;
    return todasLasFacturas;
  } catch (error) {
    console.error('Error al cargar facturas:', error);
    throw error;
  }
}

/**
 * Obtiene todas las facturas cargadas
 * @returns {Array} - Array de facturas
 */
export function obtenerFacturas() {
  return todasLasFacturas;
}

