

import { validarDniCuit } from './validaciones.js';
import { buscarResponsable } from './buscar-responsable.js';
import { buscarFacturasNoAnuladas, mostrarFacturasEnTabla } from './buscar-facturas.js';
import { obtenerResponsableActual } from './buscar-responsable.js';
import { validarFacturasSeleccionadas } from './validaciones.js';
import { generarNotaCredito, mostrarNotaCreditoEnPantalla } from './generar-nota-credito.js';
import { mostrarPantallaBuscarResponsable, mostrarPantallaListaFacturas, mostrarPantallaResumenNotaCredito } from './navegacion-pantallas.js';
import { guardarNotaCredito, guardarNotasCreditoFactura } from './datos-nota-credito.js';
import { actualizarFacturas } from './datos-facturas.js';
import { mensajeExito } from './modales.js';
import { obtenerNotaCreditoActual } from './generar-nota-credito.js';
import { limpiarSeleccionFacturas } from './seleccion-facturas.js';
import { limpiarResponsableActual } from './buscar-responsable.js';
import { limpiarNotaCreditoActual } from './generar-nota-credito.js';
import { mostrarJSONNotaCreditoEnPantalla } from './mostrar-json-nota-credito.js';


export function inicializarEventos() {
  
  const formBuscarResponsable = document.getElementById('formBuscarResponsable');
  if (formBuscarResponsable) {
    formBuscarResponsable.addEventListener('submit', async (event) => {
      event.preventDefault();
      
      const dniCuit = document.getElementById('dniCuit').value.trim();
      
      if (!validarDniCuit(dniCuit)) {
        return;
      }
      
      const responsable = await buscarResponsable(dniCuit);
      
      if (responsable) {
        
        const { cargarFacturas } = await import('./datos-facturas.js');
        await cargarFacturas();
        
        
        const facturas = buscarFacturasNoAnuladas(dniCuit);
        console.log('Facturas encontradas:', facturas.length);
        
        
        mostrarFacturasEnTabla(facturas, responsable);
        
        
        mostrarPantallaListaFacturas();
      }
    });
  }
  
  
  const botonVolverFacturas = document.getElementById('boton-volver-facturas');
  if (botonVolverFacturas) {
    botonVolverFacturas.addEventListener('click', () => {
      limpiarSeleccionFacturas();
      limpiarResponsableActual();
      mostrarPantallaBuscarResponsable();
    });
  }
  
  
  const botonContinuarFacturas = document.getElementById('boton-continuar-facturas');
  if (botonContinuarFacturas) {
    botonContinuarFacturas.addEventListener('click', () => {
      if (!validarFacturasSeleccionadas()) {
        return;
      }
      
      
      const notaCredito = generarNotaCredito();
      
      if (notaCredito) {
        
        mostrarNotaCreditoEnPantalla(notaCredito);
        
        
        mostrarPantallaResumenNotaCredito();
      }
    });
  }
  
  
  const botonVolverNota = document.getElementById('boton-volver-nota');
  if (botonVolverNota) {
    botonVolverNota.addEventListener('click', () => {
      limpiarSeleccionFacturas();
      limpiarNotaCreditoActual();
      mostrarPantallaListaFacturas();
    });
  }
  
  
  const botonConfirmarNota = document.getElementById('boton-confirmar-nota');
  if (botonConfirmarNota) {
    botonConfirmarNota.addEventListener('click', async () => {
      const notaCredito = obtenerNotaCreditoActual();
      
      if (!notaCredito) {
        return;
      }
      
      try {
        
        const notaCreditoGuardada = await guardarNotaCredito({
          idNota: null,
          fecha: notaCredito.fecha,
          tipo: notaCredito.tipo,
          total: notaCredito.total,
          responsable: notaCredito.responsable
        });
        
        
        const idsFacturas = notaCredito.facturas.map(f => f.id);
        await guardarNotasCreditoFactura(notaCreditoGuardada.idNota, idsFacturas);
        
        
        const facturasActualizadas = notaCredito.facturas.map(factura => ({
          ...factura,
          estado: 'Anulada',
          notaDeCredito: {
            idNota: notaCreditoGuardada.idNota,
            fecha: notaCreditoGuardada.fecha
          }
        }));
        
        await actualizarFacturas(facturasActualizadas);
        
        
        mostrarJSONNotaCreditoEnPantalla(
          notaCreditoGuardada,
          notaCredito.facturas,
          () => {
            
            mensajeExito('Nota de Crédito generada correctamente. Las facturas fueron anuladas.', () => {
              
              limpiarSeleccionFacturas();
              limpiarResponsableActual();
              limpiarNotaCreditoActual();
              
              
              const dniCuitInput = document.getElementById('dniCuit');
              if (dniCuitInput) {
                dniCuitInput.value = '';
              }
              
              mostrarPantallaBuscarResponsable();
            });
          }
        );
        
      } catch (error) {
        console.error('Error al guardar Nota de Crédito:', error);
        alert('Error al guardar la Nota de Crédito. Por favor, intente nuevamente.');
      }
    });
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}


