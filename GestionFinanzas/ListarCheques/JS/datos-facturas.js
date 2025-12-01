

let todasLasFacturas = [];
let facturasCargadas = false;


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


export function obtenerFacturas() {
  return todasLasFacturas;
}

