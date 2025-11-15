/* Gestión de datos de responsables de pago */

let responsables = [];
let huespedes = [];

/**
 * Carga los responsables de pago desde el archivo JSON
 * @returns {Promise<void>}
 */
export async function cargarResponsables() {
  try {
    const respuesta = await fetch('/Datos/responsableDePago.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    responsables = datos.responsablesDePago || [];
    console.log('Responsables cargados:', responsables.length);
  } catch (error) {
    console.error('Error al cargar responsables:', error);
    responsables = [];
  }
}

/**
 * Carga los huéspedes desde el archivo JSON
 * @returns {Promise<void>}
 */
export async function cargarHuespedes() {
  try {
    const respuesta = await fetch('/Datos/huspedes.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    huespedes = await respuesta.json();
    console.log('Huéspedes cargados:', huespedes.length);
  } catch (error) {
    console.error('Error al cargar huéspedes:', error);
    huespedes = [];
  }
}

/**
 * Busca un responsable de pago por DNI o CUIT
 * @param {string} dniCuit - DNI o CUIT a buscar
 * @returns {Promise<Object|null>} - Responsable encontrado o null
 */
export async function buscarResponsablePorDniCuit(dniCuit) {
  // Asegurar que los datos estén cargados
  if (responsables.length === 0) {
    await cargarResponsables();
  }
  if (huespedes.length === 0) {
    await cargarHuespedes();
  }
  
  // Normalizar DNI/CUIT (remover guiones y espacios)
  const dniCuitNormalizado = dniCuit.replace(/[-\s]/g, '');
  
  // Buscar en responsables de pago (terceros/empresas)
  const responsableEncontrado = responsables.find(responsable => {
    const responsableCuitNormalizado = (responsable.cuit || '').replace(/[-\s]/g, '');
    return responsableCuitNormalizado === dniCuitNormalizado;
  });
  
  if (responsableEncontrado) {
    return {
      tipo: 'tercero',
      razonSocial: responsableEncontrado.razonSocial,
      cuit: responsableEncontrado.cuit,
      telefono: responsableEncontrado.telefono,
      direccion: responsableEncontrado.direccion
    };
  }
  
  // Buscar en huéspedes
  const huespedEncontrado = huespedes.find(huesped => {
    const documentoNormalizado = (huesped.numeroDocumento || '').replace(/[-\s]/g, '');
    const cuitNormalizado = (huesped.cuit || '').replace(/[-\s]/g, '');
    return documentoNormalizado === dniCuitNormalizado || cuitNormalizado === dniCuitNormalizado;
  });
  
  if (huespedEncontrado) {
    return {
      tipo: 'huesped',
      apellido: huespedEncontrado.apellido,
      nombres: huespedEncontrado.nombres,
      documento: huespedEncontrado.numeroDocumento,
      cuit: huespedEncontrado.cuit || null,
      condicionIVA: huespedEncontrado.condicionIVA || null
    };
  }
  
  return null;
}

/**
 * Determina si un responsable es responsable inscripto (tiene CUIT y condición IVA)
 * @param {Object} responsable - Objeto responsable
 * @returns {boolean} - true si es responsable inscripto
 */
export function esResponsableInscripto(responsable) {
  if (!responsable) return false;
  
  // Si es tercero, siempre tiene CUIT
  if (responsable.tipo === 'tercero') {
    return !!responsable.cuit;
  }
  
  // Si es huésped, debe tener CUIT y condición IVA
  if (responsable.tipo === 'huesped') {
    return !!(responsable.cuit && responsable.condicionIVA);
  }
  
  return false;
}

// Cargar datos al inicializar el módulo
cargarResponsables();
cargarHuespedes();




