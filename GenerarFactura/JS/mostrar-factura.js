



async function mostrarDatosFacturaEnPantalla(factura) {
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
    
    console.log('Actualizando elementos de la UI...');
    
    // Actualizar nombre del huésped
    const nombreHuespedElement = document.querySelector('.nombreHusped h3');
    if (nombreHuespedElement && factura.estadia && factura.estadia.titular) {
      const titular = factura.estadia.titular;
      nombreHuespedElement.innerHTML = `<strong>${titular.apellido || ''}, ${titular.nombre || ''}</strong>`;
      console.log('Nombre del huésped actualizado');
    }
  
  // Calcular valor estadía y número de noches desde la estadía
  const valorEstadiaElement = document.querySelector('.valorEstadia p');
  if (valorEstadiaElement && factura.estadia) {
    try {
      // Intentar calcular desde la estadía si tiene métodos
      let valorEstadia = 0;
      let numeroNoches = 0;
      
      if (factura.estadia.calcularValorEstadia && typeof factura.estadia.calcularValorEstadia === 'function') {
        valorEstadia = factura.estadia.calcularValorEstadia();
        numeroNoches = factura.estadia.calcularNumeroNoches();
      } else if (factura.estadia.reserva && factura.estadia.reserva.habitaciones) {
        // Calcular manualmente desde JSON
        const habitacion = factura.estadia.reserva.habitaciones[0];
        const costoPorNoche = habitacion.costoPorNoche || 0;
        const fechaInicio = new Date(factura.estadia.fechaCheckIn);
        const fechaFin = factura.estadia.fechaCheckOut ? new Date(factura.estadia.fechaCheckOut) : new Date();
        fechaInicio.setHours(0, 0, 0, 0);
        fechaFin.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(fechaFin - fechaInicio);
        numeroNoches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        valorEstadia = costoPorNoche * numeroNoches;
      }
      
      if (valorEstadia > 0 && numeroNoches > 0) {
        valorEstadiaElement.textContent = `✔️ Valor de Estadia: $${valorEstadia.toFixed(2)} × ${numeroNoches} Noches`;
      }
    } catch (error) {
      console.error('Error al calcular valor estadía:', error);
    }
  }
  
  // Mostrar consumos desde la estadía
  const consumosContainer = document.querySelector('.listaConsumos');
  if (consumosContainer && factura.estadia) {
    consumosContainer.innerHTML = '';
    const consumos = factura.estadia.consumos || [];
    
    if (consumos.length > 0) {
      consumos.forEach(consumo => {
        const itemLista = document.createElement('div');
        itemLista.className = 'itemLista';
        const precio = consumo.precio || consumo.monto || 0;
        const descripcion = consumo.descripcion || 'Consumo';
        itemLista.innerHTML = `
          <label><input type="checkbox" disabled /> ${descripcion}: </label>
          <p>$${precio.toFixed(2)}</p>
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
  
  // Calcular recargo desde la factura si tiene horaSalida
  const recargoSection = document.getElementById('recargoCheckoutSection');
  const mensajeRecargo = document.getElementById('mensajeRecargo');
  const montoRecargo = document.getElementById('montoRecargo');
  const nuevaOcupacionWarning = document.getElementById('nuevaOcupacionWarning');
  
  if (recargoSection && factura.horaSalida && factura.estadia && factura.estadia.reserva) {
    try {
      // Importar Factura para usar su método calcularRecargoCheckout
      const { default: Factura } = await import('../../Clases/Dominio/Factura.js');
      const facturaTemp = new Factura(null, null, null, null, null, null, factura.estadia);
      const habitacion = factura.estadia.reserva.habitaciones[0];
      const costoPorNoche = habitacion ? (habitacion.costoPorNoche || 0) : 0;
      const recargoCheckout = facturaTemp.calcularRecargoCheckout(factura.horaSalida, costoPorNoche);
      
      if (recargoCheckout.recargo > 0) {
        recargoSection.style.display = 'block';
        
        if (mensajeRecargo) {
          mensajeRecargo.textContent = recargoCheckout.mensaje;
        }
        
        if (montoRecargo) {
          montoRecargo.innerHTML = `<strong>Monto del recargo: $${recargoCheckout.recargo.toFixed(2)}</strong>`;
        }
        
        if (nuevaOcupacionWarning) {
          if (recargoCheckout.requiereNuevaOcupacion) {
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
    } catch (error) {
      console.error('Error al calcular recargo:', error);
      recargoSection.style.display = 'none';
    }
  } else {
    recargoSection.style.display = 'none';
  }
  
  // Mostrar IVA directamente desde factura.iva
  const ivaElement = document.querySelector('.iva');
  if (ivaElement && factura.iva !== undefined) {
    ivaElement.innerHTML = `
      <strong>✔️ IVA (21%):</strong>
      <strong>$${factura.iva.toFixed(2)}</strong>
    `;
  }
  
  // Mostrar total directamente desde factura.total
  const tipoFacturaElement = document.querySelector('.tipoFactura');
  if (tipoFacturaElement) {
    const totalFactura = factura.total || 0;
    tipoFacturaElement.innerHTML = `
      <strong>Tipo de Factura: ${factura.tipo || 'B'}</strong>
      <div class="total-box">
        Monto Total: $${totalFactura.toFixed(2)}
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


