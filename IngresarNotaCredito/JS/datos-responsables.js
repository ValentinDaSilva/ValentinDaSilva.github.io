

let responsables = [];
let huespedes = [];


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


export async function cargarHuespedes() {
  try {
    const respuesta = await fetch('/Datos/huespedes.json');
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


export async function buscarResponsablePorDniCuit(dniCuit) {
  
  if (responsables.length === 0) {
    await cargarResponsables();
  }
  if (huespedes.length === 0) {
    await cargarHuespedes();
  }
  
  
  const dniCuitNormalizado = dniCuit.replace(/[-\s]/g, '');
  
  
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
  
  
  const huespedEncontrado = huespedes.find(huesped => {
    const documentoNormalizado = (huesped.numeroDocumento || '').replace(/[-\s]/g, '');
    const cuitNormalizado = (huesped.cuit || '').replace(/[-\s]/g, '');
    return documentoNormalizado === dniCuitNormalizado || cuitNormalizado === dniCuitNormalizado;
  });
  
  if (huespedEncontrado) {
    return {
      tipo: 'huesped',
      apellido: huespedEncontrado.apellido,
      nombre: huespedEncontrado.nombre,
      documento: huespedEncontrado.numeroDocumento,
      cuit: huespedEncontrado.cuit || null
    };
  }
  
  return null;
}


export function esResponsableInscripto(responsable) {
  if (!responsable) return false;
  
  
  if (responsable.tipo === 'tercero') {
    return !!responsable.cuit;
  }
  
  
  if (responsable.tipo === 'huesped') {
    return !!responsable.cuit;
  }
  
  return false;
}


cargarResponsables();
cargarHuespedes();







