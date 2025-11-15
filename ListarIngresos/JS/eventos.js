

import { cargarFacturas } from './datos-facturas.js';
import { filtrarPagosPorFecha } from './filtrar-pagos.js';
import { ordenarPagos } from './ordenar-pagos.js';
import { validarFormularioFechas } from './validaciones.js';
import { mostrarModalError, mostrarModalSinResultados } from './modales.js';


export function inicializarEventos() {
  
  cargarFacturas().catch(error => {
    console.error('Error al cargar facturas:', error);
    mostrarModalError('Error al cargar los datos de facturas');
  });
  
  
  const formulario = document.getElementById('formulario-fechas');
  if (formulario) {
    formulario.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      
      if (!validarFormularioFechas()) {
        return;
      }
      
      
      const fechaDesde = document.getElementById('fechaDesde').value;
      const fechaHasta = document.getElementById('fechaHasta').value;
      
      try {
        
        await cargarFacturas();
        
        
        const pagosFiltrados = filtrarPagosPorFecha(fechaDesde, fechaHasta);
        
        
        if (pagosFiltrados.length === 0) {
          mostrarModalSinResultados();
          return;
        }
        
        
        ordenarPagos('fecha');
      } catch (error) {
        console.error('Error al procesar búsqueda:', error);
        mostrarModalError('Error al procesar la búsqueda de ingresos');
      }
    });
  }
  
  
  const selectOrdenar = document.getElementById('ordenarPor');
  if (selectOrdenar) {
    selectOrdenar.addEventListener('change', (e) => {
      const criterio = e.target.value;
      ordenarPagos(criterio);
    });
  }
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializarEventos);
} else {
  inicializarEventos();
}

