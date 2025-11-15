/* Gestión de datos de notas de crédito */

let notasCredito = [];
let notasCreditoFactura = [];

/**
 * Carga las notas de crédito desde el archivo JSON
 * @returns {Promise<void>}
 */
export async function cargarNotasCredito() {
  try {
    const respuesta = await fetch('/Datos/nota_credito.json');
    if (!respuesta.ok) {
      // Si el archivo no existe, inicializar con array vacío
      notasCredito = [];
      return;
    }
    const datos = await respuesta.json();
    notasCredito = datos.notasCredito || [];
    console.log('Notas de crédito cargadas:', notasCredito.length);
  } catch (error) {
    console.error('Error al cargar notas de crédito:', error);
    notasCredito = [];
  }
}

/**
 * Carga las relaciones nota_credito_factura desde el archivo JSON
 * @returns {Promise<void>}
 */
export async function cargarNotasCreditoFactura() {
  try {
    const respuesta = await fetch('/Datos/nota_credito_factura.json');
    if (!respuesta.ok) {
      // Si el archivo no existe, inicializar con array vacío
      notasCreditoFactura = [];
      return;
    }
    const datos = await respuesta.json();
    notasCreditoFactura = datos.notaCreditoFactura || [];
    console.log('Relaciones nota_credito_factura cargadas:', notasCreditoFactura.length);
  } catch (error) {
    console.error('Error al cargar relaciones nota_credito_factura:', error);
    notasCreditoFactura = [];
  }
}

/**
 * Obtiene el próximo ID para una nota de crédito
 * @returns {number} - Próximo ID disponible
 */
function obtenerProximoIdNotaCredito() {
  if (notasCredito.length === 0) {
    return 1;
  }
  const maxId = Math.max(...notasCredito.map(nc => nc.idNota || 0));
  return maxId + 1;
}

/**
 * Guarda una nueva nota de crédito
 * @param {Object} notaCredito - Objeto nota de crédito a guardar
 * @returns {Promise<Object>} - Nota de crédito guardada con ID asignado
 */
export async function guardarNotaCredito(notaCredito) {
  // Asignar ID si no tiene
  if (!notaCredito.idNota) {
    notaCredito.idNota = obtenerProximoIdNotaCredito();
  }
  
  // Agregar a la lista
  notasCredito.push(notaCredito);
  
  console.log('Nota de crédito guardada:', notaCredito);
  
  return notaCredito;
}

/**
 * Guarda las relaciones nota_credito_factura
 * @param {number} idNotaCredito - ID de la nota de crédito
 * @param {Array<number>} idsFacturas - Array de IDs de facturas
 * @returns {Promise<void>}
 */
export async function guardarNotasCreditoFactura(idNotaCredito, idsFacturas) {
  idsFacturas.forEach(idFactura => {
    notasCreditoFactura.push({
      idNotaCredito: idNotaCredito,
      idFactura: idFactura
    });
  });
  
  console.log('Relaciones nota_credito_factura guardadas:', idsFacturas.length);
}

/**
 * Obtiene todas las notas de crédito
 * @returns {Array} - Array de notas de crédito
 */
export function obtenerNotasCredito() {
  return notasCredito;
}

/**
 * Obtiene todas las relaciones nota_credito_factura
 * @returns {Array} - Array de relaciones
 */
export function obtenerNotasCreditoFactura() {
  return notasCreditoFactura;
}

// Cargar datos al inicializar el módulo
cargarNotasCredito();
cargarNotasCreditoFactura();




