

let notasCredito = [];
let notasCreditoFactura = [];


export async function cargarNotasCredito() {
  try {
    const respuesta = await fetch('/Datos/nota_credito.json');
    if (!respuesta.ok) {
      
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


export async function cargarNotasCreditoFactura() {
  try {
    const respuesta = await fetch('/Datos/nota_credito_factura.json');
    if (!respuesta.ok) {
      
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


function obtenerProximoIdNotaCredito() {
  if (notasCredito.length === 0) {
    return 1;
  }
  const maxId = Math.max(...notasCredito.map(nc => nc.idNota || 0));
  return maxId + 1;
}


export async function guardarNotaCredito(notaCredito) {
  
  if (!notaCredito.idNota) {
    notaCredito.idNota = obtenerProximoIdNotaCredito();
  }
  
  
  notasCredito.push(notaCredito);
  
  console.log('Nota de crédito guardada:', notaCredito);
  
  return notaCredito;
}


export async function guardarNotasCreditoFactura(idNotaCredito, idsFacturas) {
  idsFacturas.forEach(idFactura => {
    notasCreditoFactura.push({
      idNotaCredito: idNotaCredito,
      idFactura: idFactura
    });
  });
  
  console.log('Relaciones nota_credito_factura guardadas:', idsFacturas.length);
}


export function obtenerNotasCredito() {
  return notasCredito;
}


export function obtenerNotasCreditoFactura() {
  return notasCreditoFactura;
}


cargarNotasCredito();
cargarNotasCreditoFactura();




