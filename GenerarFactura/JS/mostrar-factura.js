



function mostrarDatosFacturaEnPantalla(factura) {
  try {
    console.log('mostrarDatosFacturaEnPantalla - Recibida factura:', factura);
    
    if (!factura) {
      console.error('No se puede mostrar factura: factura es null');
      return;
    }
    
    if (!factura.estadia) {
      console.error('La factura no tiene estadía:', factura);
      throw new Error('La factura generada no tiene la estructura de estadía correcta');
    }
    
    if (!factura.detalle) {
      console.error('La factura no tiene detalle:', factura);
      throw new Error('La factura generada no tiene la estructura de detalle correcta');
    }
    
    console.log('Actualizando elementos de la UI...');
    
    // Actualizar nombre del huésped
    const nombreHuespedElement = document.querySelector('.nombreHusped h3');
    if (nombreHuespedElement && factura.estadia && factura.estadia.titular) {
      const titular = factura.estadia.titular;
      nombreHuespedElement.innerHTML = `<strong>${titular.apellido || ''}, ${titular.nombres || ''}</strong>`;
      console.log('Nombre del huésped actualizado');
    }
  
  
  const valorEstadiaElement = document.querySelector('.valorEstadia p');
  if (valorEstadiaElement && factura.detalle) {
    valorEstadiaElement.textContent = `✔️ Valor de Estadia: $${factura.detalle.valorEstadia.toFixed(2)} × ${factura.detalle.numeroNoches} Noches`;
  }
  
  
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
      
      recargoSection.style.display = 'block';
      
      if (mensajeRecargo) {
        mensajeRecargo.textContent = mensaje;
      }
      
      if (montoRecargo) {
        montoRecargo.innerHTML = `<strong>Monto del recargo: $${recargo.toFixed(2)}</strong>`;
      }
      
      
      if (nuevaOcupacionWarning) {
        if (requiereNuevaOcupacion) {
          nuevaOcupacionWarning.style.display = 'block';
        } else {
          nuevaOcupacionWarning.style.display = 'none';
        }
      }
    } else {
      
      recargoSection.style.display = 'none';
      if (nuevaOcupacionWarning) {
        nuevaOcupacionWarning.style.display = 'none';
      }
    }
  }
  
  
  const ivaElement = document.querySelector('.iva');
  if (ivaElement && factura.detalle) {
    ivaElement.innerHTML = `
      <strong>✔️ IVA (21%):</strong>
      <strong>$${factura.detalle.iva.toFixed(2)}</strong>
    `;
  }
  
  
  const tipoFacturaElement = document.querySelector('.tipoFactura');
  if (tipoFacturaElement && factura.detalle) {
    tipoFacturaElement.innerHTML = `
      <strong>Tipo de Factura: ${factura.tipo || 'B'}</strong>
      <div class="total-box">
        Monto Total: $${factura.detalle.total.toFixed(2)}
      </div>
    `;
  }
  
  console.log('mostrarDatosFacturaEnPantalla - Completado exitosamente');
  } catch (error) {
    console.error('Error en mostrarDatosFacturaEnPantalla:', error);
    throw error;
  }
}


if (typeof window !== 'undefined') {
  window.mostrarDatosFacturaEnPantalla = mostrarDatosFacturaEnPantalla;
}


