/* Gestión de medios de pago y campos dinámicos */

/**
 * Inicializa los event listeners para los medios de pago
 */
export function inicializarMediosPago() {
  const checkboxes = document.querySelectorAll('input[name="medioPago"]');
  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', actualizarCamposPago);
  });
}

/**
 * Actualiza los campos de pago según los medios seleccionados
 */
function actualizarCamposPago() {
  const contenedor = document.getElementById('camposPago');
  if (!contenedor) return;
  
  // Limpiar campos existentes
  contenedor.innerHTML = '';
  
  const mediosSeleccionados = Array.from(document.querySelectorAll('input[name="medioPago"]:checked'))
    .map(cb => cb.value);
  
  mediosSeleccionados.forEach(medio => {
    const campoDiv = crearCampoPago(medio);
    contenedor.appendChild(campoDiv);
  });
}

/**
 * Crea el campo de pago para un medio específico
 * @param {string} medio - Tipo de medio de pago
 * @returns {HTMLElement} - Elemento div con los campos
 */
function crearCampoPago(medio) {
  const div = document.createElement('div');
  div.className = 'campo-pago';
  
  // Normalizar el valor del medio a minúsculas
  const medioNormalizado = medio.toLowerCase();
  div.dataset.medio = medioNormalizado;
  
  console.log('Creando campo para medio:', medio, 'normalizado:', medioNormalizado);
  
  let contenido = '';
  
  switch (medioNormalizado) {
    case 'efectivo':
      contenido = `
        <h4>Efectivo</h4>
        <label>Monto:</label>
        <input type="number" step="0.01" min="0" data-campo="monto" placeholder="0.00" required>
      `;
      break;
    
    case 'monedaextranjera':
      contenido = `
        <h4>Moneda Extranjera</h4>
        <label>Tipo de Moneda:</label>
        <select data-campo="tipoMoneda" required>
          <option value="">Seleccione...</option>
          <option value="USD">USD - Dólar Estadounidense</option>
          <option value="EUR">EUR - Euro</option>
          <option value="BRL">BRL - Real Brasileño</option>
          <option value="CLP">CLP - Peso Chileno</option>
          <option value="UYU">UYU - Peso Uruguayo</option>
        </select>
        <label>Monto en Moneda Extranjera:</label>
        <input type="number" step="0.01" min="0" data-campo="montoExtranjero" placeholder="0.00" required>
        <label>Cotización:</label>
        <input type="number" step="0.01" min="0" data-campo="cotizacion" placeholder="0.00" required>
        <label>Monto en Pesos (calculado):</label>
        <input type="number" step="0.01" min="0" data-campo="monto" placeholder="0.00" readonly>
      `;
      break;
    
    case 'cheques':
      contenido = `
        <h4>Cheques</h4>
        <label>Cantidad de Cheques:</label>
        <input type="number" min="1" data-campo="cantidad" value="1" required>
        <div class="cheques-container" data-container="cheques"></div>
        <button type="button" class="boton-agregar-cheque">Agregar Cheque</button>
        <label>Total:</label>
        <input type="number" step="0.01" min="0" data-campo="monto" placeholder="0.00" readonly>
      `;
      break;
    
    case 'tarjetas':
      contenido = `
        <h4>Tarjetas</h4>
        <label>Cantidad de Tarjetas:</label>
        <input type="number" min="1" data-campo="cantidad" value="1" required>
        <div class="tarjetas-container" data-container="tarjetas"></div>
        <button type="button" class="boton-agregar-tarjeta">Agregar Tarjeta</button>
        <label>Total:</label>
        <input type="number" step="0.01" min="0" data-campo="monto" placeholder="0.00" readonly>
      `;
      break;
  }
  
  div.innerHTML = contenido;
  
  if (!contenido) {
    console.warn('No se generó contenido para el medio:', medioNormalizado);
    return div;
  }
  
  // Agregar event listeners específicos
  if (medioNormalizado === 'monedaextranjera') {
    const montoExtranjero = div.querySelector('[data-campo="montoExtranjero"]');
    const cotizacion = div.querySelector('[data-campo="cotizacion"]');
    const monto = div.querySelector('[data-campo="monto"]');
    
    const calcularMonto = () => {
      const montoExt = parseFloat(montoExtranjero.value) || 0;
      const cot = parseFloat(cotizacion.value) || 0;
      const total = montoExt * cot;
      if (monto) monto.value = total.toFixed(2);
    };
    
    if (montoExtranjero) montoExtranjero.addEventListener('input', calcularMonto);
    if (cotizacion) cotizacion.addEventListener('input', calcularMonto);
  } else if (medioNormalizado === 'cheques') {
    const botonAgregar = div.querySelector('.boton-agregar-cheque');
    if (botonAgregar) {
      botonAgregar.addEventListener('click', () => agregarCheque(div));
    }
    // Agregar primer cheque por defecto
    agregarCheque(div);
  } else if (medioNormalizado === 'tarjetas') {
    const botonAgregar = div.querySelector('.boton-agregar-tarjeta');
    if (botonAgregar) {
      botonAgregar.addEventListener('click', () => agregarTarjeta(div));
    }
    // Agregar primera tarjeta por defecto
    agregarTarjeta(div);
  }
  
  return div;
}

/**
 * Agrega un campo de cheque
 * @param {HTMLElement} contenedor - Contenedor del campo de cheques
 */
function agregarCheque(contenedor) {
  const chequesContainer = contenedor.querySelector('[data-container="cheques"]');
  if (!chequesContainer) return;
  
  const divCheque = document.createElement('div');
  divCheque.className = 'cheque-item';
  divCheque.innerHTML = `
    <label>Número de Cheque:</label>
    <input type="text" data-cheque="numero" placeholder="Número" required>
    <label>Monto:</label>
    <input type="number" step="0.01" min="0" data-cheque="monto" placeholder="0.00" required>
    <label>Fecha de Vencimiento:</label>
    <input type="date" data-cheque="fechaVencimiento" required>
    <button type="button" class="boton-eliminar-cheque">Eliminar</button>
  `;
  
  const botonEliminar = divCheque.querySelector('.boton-eliminar-cheque');
  if (botonEliminar) {
    botonEliminar.addEventListener('click', () => {
      divCheque.remove();
      actualizarTotalCheques(contenedor);
    });
  }
  
  const montoInput = divCheque.querySelector('[data-cheque="monto"]');
  if (montoInput) {
    montoInput.addEventListener('input', () => actualizarTotalCheques(contenedor));
  }
  
  chequesContainer.appendChild(divCheque);
  actualizarTotalCheques(contenedor);
}

/**
 * Actualiza el total de cheques
 * @param {HTMLElement} contenedor - Contenedor del campo de cheques
 */
function actualizarTotalCheques(contenedor) {
  const cheques = contenedor.querySelectorAll('.cheque-item');
  let total = 0;
  
  cheques.forEach(cheque => {
    const monto = parseFloat(cheque.querySelector('[data-cheque="monto"]')?.value || 0);
    total += monto;
  });
  
  const montoTotal = contenedor.closest('.campo-pago').querySelector('[data-campo="monto"]');
  if (montoTotal) {
    montoTotal.value = total.toFixed(2);
  }
  
  const cantidadInput = contenedor.closest('.campo-pago').querySelector('[data-campo="cantidad"]');
  if (cantidadInput) {
    cantidadInput.value = cheques.length;
  }
}

/**
 * Agrega un campo de tarjeta
 * @param {HTMLElement} contenedor - Contenedor del campo de tarjetas
 */
function agregarTarjeta(contenedor) {
  const tarjetasContainer = contenedor.querySelector('[data-container="tarjetas"]');
  if (!tarjetasContainer) return;
  
  const divTarjeta = document.createElement('div');
  divTarjeta.className = 'tarjeta-item';
  divTarjeta.innerHTML = `
    <label>Tipo de Tarjeta:</label>
    <select data-tarjeta="tipo" required>
      <option value="">Seleccione...</option>
      <option value="VISA">VISA</option>
      <option value="MASTERCARD">MASTERCARD</option>
      <option value="AMEX">AMEX</option>
      <option value="CABAL">CABAL</option>
      <option value="NARANJA">NARANJA</option>
    </select>
    <label>Número de Tarjeta:</label>
    <input type="text" data-tarjeta="numeroTarjeta" placeholder="Número" required>
    <label>Monto:</label>
    <input type="number" step="0.01" min="0" data-tarjeta="monto" placeholder="0.00" required>
    <button type="button" class="boton-eliminar-tarjeta">Eliminar</button>
  `;
  
  const botonEliminar = divTarjeta.querySelector('.boton-eliminar-tarjeta');
  if (botonEliminar) {
    botonEliminar.addEventListener('click', () => {
      divTarjeta.remove();
      actualizarTotalTarjetas(contenedor);
    });
  }
  
  const montoInput = divTarjeta.querySelector('[data-tarjeta="monto"]');
  if (montoInput) {
    montoInput.addEventListener('input', () => actualizarTotalTarjetas(contenedor));
  }
  
  tarjetasContainer.appendChild(divTarjeta);
  actualizarTotalTarjetas(contenedor);
}

/**
 * Actualiza el total de tarjetas
 * @param {HTMLElement} contenedor - Contenedor del campo de tarjetas
 */
function actualizarTotalTarjetas(contenedor) {
  const tarjetas = contenedor.querySelectorAll('.tarjeta-item');
  let total = 0;
  
  tarjetas.forEach(tarjeta => {
    const monto = parseFloat(tarjeta.querySelector('[data-tarjeta="monto"]')?.value || 0);
    total += monto;
  });
  
  const montoTotal = contenedor.closest('.campo-pago').querySelector('[data-campo="monto"]');
  if (montoTotal) {
    montoTotal.value = total.toFixed(2);
  }
  
  const cantidadInput = contenedor.closest('.campo-pago').querySelector('[data-campo="cantidad"]');
  if (cantidadInput) {
    cantidadInput.value = tarjetas.length;
  }
}

/**
 * Obtiene los datos de los medios de pago seleccionados
 * @returns {Object} - Datos de los medios de pago
 */
export function obtenerDatosMediosPago() {
  const mediosSeleccionados = Array.from(document.querySelectorAll('input[name="medioPago"]:checked'))
    .map(cb => cb.value);
  
  const datos = {
    medioPago: mediosSeleccionados,
    detalles: {},
    monto: 0
  };
  
  mediosSeleccionados.forEach(medio => {
    // Normalizar el medio para buscar el campo (los campos se guardan con valores normalizados)
    const medioNormalizado = medio.toLowerCase();
    const campoDiv = document.querySelector(`.campo-pago[data-medio="${medioNormalizado}"]`);
    if (!campoDiv) {
      console.warn('No se encontró campo para medio:', medio, 'normalizado:', medioNormalizado);
      return;
    }
    
    const detalles = {};
    
    switch (medioNormalizado) {
      case 'efectivo':
        const montoEfectivo = parseFloat(campoDiv.querySelector('[data-campo="monto"]')?.value || 0);
        detalles.monto = montoEfectivo;
        datos.monto += montoEfectivo;
        break;
      
      case 'monedaextranjera':
        detalles.tipoMoneda = campoDiv.querySelector('[data-campo="tipoMoneda"]')?.value || '';
        detalles.montoExtranjero = parseFloat(campoDiv.querySelector('[data-campo="montoExtranjero"]')?.value || 0);
        detalles.cotizacion = parseFloat(campoDiv.querySelector('[data-campo="cotizacion"]')?.value || 0);
        detalles.monto = parseFloat(campoDiv.querySelector('[data-campo="monto"]')?.value || 0);
        datos.monto += detalles.monto;
        break;
      
      case 'cheques':
        const cheques = [];
        campoDiv.querySelectorAll('.cheque-item').forEach(chequeDiv => {
          cheques.push({
            numero: chequeDiv.querySelector('[data-cheque="numero"]')?.value || '',
            monto: parseFloat(chequeDiv.querySelector('[data-cheque="monto"]')?.value || 0),
            fechaVencimiento: chequeDiv.querySelector('[data-cheque="fechaVencimiento"]')?.value || ''
          });
        });
        detalles.cantidad = cheques.length;
        detalles.cheques = cheques;
        detalles.monto = cheques.reduce((sum, c) => sum + c.monto, 0);
        datos.monto += detalles.monto;
        break;
      
      case 'tarjetas':
        const tarjetas = [];
        campoDiv.querySelectorAll('.tarjeta-item').forEach(tarjetaDiv => {
          tarjetas.push({
            tipo: tarjetaDiv.querySelector('[data-tarjeta="tipo"]')?.value || '',
            numeroTarjeta: tarjetaDiv.querySelector('[data-tarjeta="numeroTarjeta"]')?.value || '',
            monto: parseFloat(tarjetaDiv.querySelector('[data-tarjeta="monto"]')?.value || 0)
          });
        });
        detalles.cantidad = tarjetas.length;
        detalles.tarjetas = tarjetas;
        detalles.monto = tarjetas.reduce((sum, t) => sum + t.monto, 0);
        datos.monto += detalles.monto;
        break;
    }
    
    // Guardar con el valor original del checkbox, no el normalizado
    datos.detalles[medio] = detalles;
  });
  
  return datos;
}

