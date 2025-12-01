
function construirDireccion(persona) {
  if (persona && typeof persona.direccion === 'object') {
    const { calle = '', numero = '', piso = '', departamento = '', ciudad = '', localidad = '', provincia = '', codigoPostal = '', pais = '' } = persona.direccion;
    return { calle, numero, piso, departamento, localidad: ciudad || localidad, provincia, codigoPostal, pais };
  }

  return {
    calle: persona?.calle || '',
    numero: persona?.numero || persona?.numeroCalle || '',
    piso: persona?.piso || '',
    departamento: persona?.departamento || '',
    localidad: persona?.ciudad || persona?.localidad || '',
    provincia: persona?.provincia || '',
    codigoPostal: persona?.codigoPostal || '',
    pais: persona?.pais || ''
  };
}

function normalizarPersonaEstadia(persona) {
  if (!persona || typeof persona !== 'object') {
    return null;
  }

  const nombre = (persona.nombre ?? persona.nombre ?? '').toString().trim();
  const numeroDocumentoRaw = persona.numeroDocumento ?? persona.nroDocumento ?? persona.documento ?? '';
  const numeroDocumento = numeroDocumentoRaw === null || numeroDocumentoRaw === undefined
    ? ''
    : String(numeroDocumentoRaw).trim();
  const tipoDocumento = (persona.tipoDocumento ?? persona.tipoDoc ?? '').toString().trim();
  const telefono = persona.telefono
    || (persona.caracteristica || persona.caracteristica === 0
      ? `${persona.caracteristica}-${persona.telefonoNumero || ''}`.trim().replace(/^-+/, '')
      : persona.telefonoNumero || '');

  return {
    nombre: persona.nombre ?? nombre,
    nombre,
    apellido: (persona.apellido ?? '').toString().trim(),
    tipoDocumento,
    numeroDocumento,
    nroDocumento: persona.nroDocumento ?? numeroDocumento,
    fechaNacimiento: persona.fechaNacimiento ?? null,
    ocupacion: persona.ocupacion ?? '',
    nacionalidad: persona.nacionalidad ?? '',
    cuit: persona.cuit ?? '',
    email: persona.email ?? '',
    telefono: telefono || '',
    direccion: construirDireccion(persona)
  };
}

function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) {
    return '';
  }

  const fecha = new Date(fechaNacimiento);
  if (Number.isNaN(fecha.getTime())) {
    return '';
  }

  const hoy = new Date();
  let edad = hoy.getFullYear() - fecha.getFullYear();
  const mes = hoy.getMonth() - fecha.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
    edad -= 1;
  }
  return edad;
}

function obtenerHuespedesDeEstadia(estadia) {
  if (!estadia) {
    return [];
  }

  const huespedes = [];

  const titularNormalizado = normalizarPersonaEstadia(estadia.titular);
  if (titularNormalizado) {
    huespedes.push({
      apellido: titularNormalizado.apellido,
      nombre: titularNormalizado.nombre,
      edad: calcularEdad(titularNormalizado.fechaNacimiento),
      documento: titularNormalizado.numeroDocumento,
      esTitular: true,
      datosCompletos: titularNormalizado
    });
  }

  if (Array.isArray(estadia.acompaniantes)) {
    estadia.acompaniantes.forEach(acompanante => {
      const acompananteNormalizado = normalizarPersonaEstadia(acompanante);
      if (!acompananteNormalizado) {
        return;
      }

      huespedes.push({
        apellido: acompananteNormalizado.apellido,
        nombre: acompananteNormalizado.nombre,
        edad: calcularEdad(acompananteNormalizado.fechaNacimiento),
        documento: acompananteNormalizado.numeroDocumento,
        esTitular: false,
        datosCompletos: acompananteNormalizado
      });
    });
  }

  return huespedes;
}

function cargarHuespedesEnTabla(huespedes) {
  const tbody = document.querySelector("#seleccionarResponsable tbody");
  if (!tbody) {
    console.error('No se encontró el tbody de la tabla');
    return;
  }

  tbody.innerHTML = '';

  huespedes.forEach(huesped => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${huesped.apellido || ''}</td>
      <td>${huesped.nombre || ''}</td>
      <td>${huesped.edad ?? ''}</td>
      <td>${huesped.documento || ''}</td>
    `;

    fila.dataset.huesped = JSON.stringify(huesped.datosCompletos);
    fila.dataset.esTitular = huesped.esTitular;

    tbody.appendChild(fila);
  });

  if (typeof inicializarSeleccionResponsable === 'function') {
    inicializarSeleccionResponsable();
  }
}