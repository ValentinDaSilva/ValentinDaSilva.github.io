/* Manejo de eventos */

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

/**
 * Inicializa todos los event listeners
 */
export function inicializarEventos() {
  // Event listener del formulario de búsqueda de responsable
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
        // Asegurarse de que las facturas estén cargadas antes de buscar
        const { cargarFacturas } = await import('./datos-facturas.js');
        await cargarFacturas();
        
        // Buscar facturas no anuladas
        const facturas = buscarFacturasNoAnuladas(dniCuit);
        console.log('Facturas encontradas:', facturas.length);
        
        // Mostrar facturas en tabla
        mostrarFacturasEnTabla(facturas, responsable);
        
        // Cambiar a pantalla de lista de facturas
        mostrarPantallaListaFacturas();
      }
    });
  }
  
  // Event listener del botón volver en lista de facturas
  const botonVolverFacturas = document.getElementById('boton-volver-facturas');
  if (botonVolverFacturas) {
    botonVolverFacturas.addEventListener('click', () => {
      limpiarSeleccionFacturas();
      limpiarResponsableActual();
      mostrarPantallaBuscarResponsable();
    });
  }
  
  // Event listener del botón continuar en lista de facturas
  const botonContinuarFacturas = document.getElementById('boton-continuar-facturas');
  if (botonContinuarFacturas) {
    botonContinuarFacturas.addEventListener('click', () => {
      if (!validarFacturasSeleccionadas()) {
        return;
      }
      
      // Generar Nota de Crédito
      const notaCredito = generarNotaCredito();
      
      if (notaCredito) {
        // Mostrar Nota de Crédito en pantalla
        mostrarNotaCreditoEnPantalla(notaCredito);
        
        // Cambiar a pantalla de resumen
        mostrarPantallaResumenNotaCredito();
      }
    });
  }
  
  // Event listener del botón cancelar en resumen
  const botonVolverNota = document.getElementById('boton-volver-nota');
  if (botonVolverNota) {
    botonVolverNota.addEventListener('click', () => {
      limpiarSeleccionFacturas();
      limpiarNotaCreditoActual();
      mostrarPantallaListaFacturas();
    });
  }
  
  // Event listener del botón confirmar en resumen
  const botonConfirmarNota = document.getElementById('boton-confirmar-nota');
  if (botonConfirmarNota) {
    botonConfirmarNota.addEventListener('click', async () => {
      const notaCredito = obtenerNotaCreditoActual();
      
      if (!notaCredito) {
        return;
      }
      
      try {
        // Guardar Nota de Crédito
        const notaCreditoGuardada = await guardarNotaCredito({
          idNota: null,
          fecha: notaCredito.fecha,
          tipo: notaCredito.tipo,
          total: notaCredito.total,
          responsable: notaCredito.responsable
        });
        
        // Guardar relaciones nota_credito_factura
        const idsFacturas = notaCredito.facturas.map(f => f.id);
        await guardarNotasCreditoFactura(notaCreditoGuardada.idNota, idsFacturas);
        
        // Actualizar estado de facturas a "Anulada"
        const facturasActualizadas = notaCredito.facturas.map(factura => ({
          ...factura,
          estado: 'Anulada',
          notaDeCredito: {
            idNota: notaCreditoGuardada.idNota,
            fecha: notaCreditoGuardada.fecha
          }
        }));
        
        await actualizarFacturas(facturasActualizadas);
        
        // Mostrar JSON de Nota de Crédito
        mostrarJSONNotaCreditoEnPantalla(
          notaCreditoGuardada,
          notaCredito.facturas,
          () => {
            // Después de cerrar el JSON, mostrar mensaje de éxito
            mensajeExito('Nota de Crédito generada correctamente. Las facturas fueron anuladas.', () => {
              // Limpiar todo y volver a la pantalla inicial
              limpiarSeleccionFacturas();
              limpiarResponsableActual();
              limpiarNotaCreditoActual();
              
              // Limpiar formulario
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

// Inicializar eventos cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}


