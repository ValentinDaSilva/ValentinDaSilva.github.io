/* Búsqueda de responsable de pago por CUIT */

/**
 * Busca un responsable de pago por CUIT
 * @param {string} cuit - CUIT a buscar
 * @returns {Promise<Object|null>} - Responsable de pago encontrado o null
 */
async function buscarResponsableDePagoPorCUIT(cuit) {
  try {
    // Normalizar CUIT (remover guiones y espacios)
    const cuitNormalizado = cuit.replace(/[-\s]/g, '');
    
    const respuesta = await fetch('../Datos/responsableDePago.json');
    if (!respuesta.ok) {
      throw new Error('Error al cargar responsables de pago');
    }
    
    const datos = await respuesta.json();
    const responsables = datos.responsablesDePago || [];
    
    // Buscar responsable por CUIT (comparar con y sin guiones)
    const responsableEncontrado = responsables.find(responsable => {
      const responsableCuitNormalizado = responsable.cuit.replace(/[-\s]/g, '');
      return responsableCuitNormalizado === cuitNormalizado || responsable.cuit === cuit;
    });
    
    return responsableEncontrado || null;
  } catch (error) {
    console.error('Error al buscar responsable de pago:', error);
    throw error;
  }
}

/**
 * Obtiene la razón social de un responsable de pago por CUIT
 * @param {string} cuit - CUIT a buscar
 * @returns {Promise<string|null>} - Razón social o null
 */
async function obtenerRazonSocialPorCUIT(cuit) {
  const responsable = await buscarResponsableDePagoPorCUIT(cuit);
  return responsable ? responsable.razonSocial : null;
}






