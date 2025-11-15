


async function buscarResponsableDePagoPorCUIT(cuit) {
  try {
    
    const cuitNormalizado = cuit.replace(/[-\s]/g, '');
    
    const respuesta = await fetch('../Datos/responsableDePago.json');
    if (!respuesta.ok) {
      throw new Error('Error al cargar responsables de pago');
    }
    
    const datos = await respuesta.json();
    const responsables = datos.responsablesDePago || [];
    
    
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


async function obtenerRazonSocialPorCUIT(cuit) {
  const responsable = await buscarResponsableDePagoPorCUIT(cuit);
  return responsable ? responsable.razonSocial : null;
}






