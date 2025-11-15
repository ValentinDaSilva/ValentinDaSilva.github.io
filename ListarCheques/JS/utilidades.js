


export function formatearFecha(fecha) {
  if (!fecha) return '-';
  const [year, month, day] = fecha.split('-');
  return `${day}/${month}/${year}`;
}


export function formatearMonto(monto) {
  if (monto === null || monto === undefined) return '$0.00';
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2
  }).format(monto);
}


export function obtenerNombreResponsable(responsableDePago) {
  if (!responsableDePago) {
    return '-';
  }
  
  if (responsableDePago.tipo === 'huesped') {
    const apellido = responsableDePago.apellido || '';
    const nombres = responsableDePago.nombres || '';
    return `${apellido}, ${nombres}`.trim() || '-';
  } else if (responsableDePago.tipo === 'tercero') {
    return responsableDePago.razonSocial || '-';
  }
  
  return '-';
}

