/* Gestión de eventos */

import { cargarFacturas } from './datos-facturas.js';
import { filtrarPagosPorFecha } from './filtrar-pagos.js';
import { ordenarPagos } from './ordenar-pagos.js';
import { validarFormularioFechas } from './validaciones.js';
import { mostrarModalError, mostrarModalSinResultados } from './modales.js';

/**
 * Inicializa los event listeners
 */
export function inicializarEventos() {
  // Asegurar que las facturas estén cargadas
  cargarFacturas().catch(error => {
    console.error('Error al cargar facturas:', error);
    mostrarModalError('Error al cargar los datos de facturas');
  });
  
  // Event listener para el formulario
  const formulario = document.getElementById('formulario-fechas');
  if (formulario) {
    formulario.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      // Validar formulario
      if (!validarFormularioFechas()) {
        return;
      }
      
      // Obtener fechas
      const fechaDesde = document.getElementById('fechaDesde').value;
      const fechaHasta = document.getElementById('fechaHasta').value;
      
      try {
        // Asegurar que las facturas estén cargadas
        await cargarFacturas();
        
        // Filtrar pagos
        const pagosFiltrados = filtrarPagosPorFecha(fechaDesde, fechaHasta);
        
        // Verificar si hay resultados
        if (pagosFiltrados.length === 0) {
          mostrarModalSinResultados();
          return;
        }
        
        // Ordenar por fecha por defecto y mostrar resultados
        ordenarPagos('fecha');
      } catch (error) {
        console.error('Error al procesar búsqueda:', error);
        mostrarModalError('Error al procesar la búsqueda de ingresos');
      }
    });
  }
  
  // Event listener para el selector de ordenamiento
  const selectOrdenar = document.getElementById('ordenarPor');
  if (selectOrdenar) {
    selectOrdenar.addEventListener('change', (e) => {
      const criterio = e.target.value;
      ordenarPagos(criterio);
    });
  }
}

// Inicializar eventos cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}

