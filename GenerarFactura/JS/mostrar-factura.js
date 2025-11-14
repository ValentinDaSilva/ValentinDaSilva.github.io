/* Mostrar datos de factura en pantalla */

/**
 * Muestra los datos de la factura en la pantalla de resumen
 * @param {Object} factura - Objeto factura generada
 */
function mostrarDatosFacturaEnPantalla(factura) {
  if (!factura) {
    console.error('No se puede mostrar factura: factura es null');
    return;
  }
  
  // Mostrar nombre del huésped (titular de la estadía)
  const nombreHuespedElement = document.querySelector('.nombreHusped h3');
  if (nombreHuespedElement && factura.estadia.titular) {
    const titular = factura.estadia.titular;
    nombreHuespedElement.innerHTML = `<strong>${titular.apellido}, ${titular.nombres}</strong>`;
  }
  
  // Mostrar valor de estadía
  const valorEstadiaElement = document.querySelector('.valorEstadia p');
  if (valorEstadiaElement && factura.detalle) {
    valorEstadiaElement.textContent = `✔️ Valor de Estadia: $${factura.detalle.valorEstadia.toFixed(2)} × ${factura.detalle.numeroNoches} Noches`;
  }
  
  // Mostrar consumos
  const consumosContainer = document.querySelector('.listaConsumos');
  if (consumosContainer && factura.detalle.consumos) {
    consumosContainer.innerHTML = '';
    
    if (factura.detalle.consumos.length > 0) {
      factura.detalle.consumos.forEach(consumo => {
        const itemLista = document.createElement('div');
        itemLista.className = 'itemLista';
        itemLista.innerHTML = `
          <label><input type="checkbox" disabled /> ${consumo.descripcion || 'Consumo'}: </label>
          <p>$${(consumo.precio || 0).toFixed(2)}</p>
        `;
        consumosContainer.appendChild(itemLista);
      });
    } else {
      const itemLista = document.createElement('div');
      itemLista.className = 'itemLista';
      itemLista.innerHTML = `
        <label>No hay consumos registrados</label>
      `;
      consumosContainer.appendChild(itemLista);
    }
  }
  
  // Mostrar recargo de checkout
  const recargoSection = document.getElementById('recargoCheckoutSection');
  const mensajeRecargo = document.getElementById('mensajeRecargo');
  const montoRecargo = document.getElementById('montoRecargo');
  const nuevaOcupacionWarning = document.getElementById('nuevaOcupacionWarning');
  
  if (recargoSection && factura.detalle) {
    const recargo = factura.detalle.recargoCheckout || 0;
    const tipoRecargo = factura.detalle.tipoRecargoCheckout || 'normal';
    const mensaje = factura.detalle.mensajeRecargoCheckout || '';
    const requiereNuevaOcupacion = factura.detalle.requiereNuevaOcupacion || false;
    
    if (recargo > 0) {
      // Mostrar sección de recargo
      recargoSection.style.display = 'block';
      
      if (mensajeRecargo) {
        mensajeRecargo.textContent = mensaje;
      }
      
      if (montoRecargo) {
        montoRecargo.innerHTML = `<strong>Monto del recargo: $${recargo.toFixed(2)}</strong>`;
      }
      
      // Mostrar advertencia de nueva ocupación si es necesario
      if (nuevaOcupacionWarning) {
        if (requiereNuevaOcupacion) {
          nuevaOcupacionWarning.style.display = 'block';
        } else {
          nuevaOcupacionWarning.style.display = 'none';
        }
      }
    } else {
      // Ocultar sección si no hay recargo
      recargoSection.style.display = 'none';
      if (nuevaOcupacionWarning) {
        nuevaOcupacionWarning.style.display = 'none';
      }
    }
  }
  
  // Mostrar IVA
  const ivaElement = document.querySelector('.iva');
  if (ivaElement && factura.detalle) {
    ivaElement.innerHTML = `
      <strong>✔️ IVA (21%):</strong>
      <strong>$${factura.detalle.iva.toFixed(2)}</strong>
    `;
  }
  
  // Mostrar tipo de factura y total
  const tipoFacturaElement = document.querySelector('.tipoFactura');
  if (tipoFacturaElement && factura.detalle) {
    tipoFacturaElement.innerHTML = `
      <strong>Tipo de Factura: ${factura.tipo || 'B'}</strong>
      <div class="total-box">
        Monto Total: $${factura.detalle.total.toFixed(2)}
      </div>
    `;
  }
}


