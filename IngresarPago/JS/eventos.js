/* Manejo de eventos */

import { validarHabitacion } from './validaciones.js';
import { buscarFacturasPendientes, mostrarFacturasEnTabla } from './buscar-facturas.js';
import { mensajeError } from './modales.js';
import { mostrarPantallaFacturas, mostrarPantallaInicial, mostrarPantallaPago } from './navegacion-pantallas.js';
import { inicializarMediosPago } from './medios-pago.js';
import { registrarPago } from './registrar-pago.js';
import { limpiarFacturaActual } from './seleccion-factura.js';

/**
 * Inicializa todos los event listeners
 */
export function inicializarEventos() {
  console.log('Inicializando eventos...');
  
  // Función para manejar la búsqueda
  async function buscarFacturas() {
    console.log('Función buscarFacturas llamada');
    
    const numeroHabitacion = document.getElementById("numeroHabitacion")?.value.trim();
    console.log('Número de habitación:', numeroHabitacion);
    
    if (!numeroHabitacion) {
      mensajeError("Por favor, ingrese un número de habitación.");
      return;
    }
    
    // Validar habitación
    const esValida = await validarHabitacion(numeroHabitacion);
    console.log('Habitación válida:', esValida);
    if (!esValida) {
      return;
    }
    
    // Asegurarse de que las facturas estén cargadas
    const { cargarFacturas } = await import('./datos-facturas.js');
    await cargarFacturas();
    
    // Buscar facturas pendientes
    const facturas = buscarFacturasPendientes(parseInt(numeroHabitacion));
    console.log('Facturas encontradas:', facturas.length);
    
    if (facturas.length === 0) {
      mensajeError("No hay facturas pendientes para esta habitación.");
      return;
    }
    
    // Mostrar facturas en tabla
    mostrarFacturasEnTabla(facturas);
    
    // Cambiar a pantalla de facturas
    mostrarPantallaFacturas();
  }
  
  // Event listener del formulario de habitación
  const habitacionForm = document.getElementById("habitacionForm");
  if (habitacionForm) {
    console.log('Formulario encontrado, agregando event listener');
    habitacionForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Evento submit capturado');
      await buscarFacturas();
    });
  } else {
    console.error('No se encontró el formulario habitacionForm');
  }
  
  // También agregar event listener al botón por si acaso
  const botonBuscar = document.getElementById("boton-buscar-facturas");
  if (botonBuscar) {
    console.log('Botón encontrado, agregando event listener');
    botonBuscar.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Click en botón capturado');
      await buscarFacturas();
    });
  }
  
  // Event listener del botón volver en lista de facturas
  const botonVolverFacturas = document.getElementById("boton-volver-facturas");
  if (botonVolverFacturas) {
    botonVolverFacturas.addEventListener("click", () => {
      mostrarPantallaInicial();
    });
  }
  
  // Event listener del botón volver en pantalla de pago
  const botonVolverPago = document.getElementById("boton-volver-pago");
  if (botonVolverPago) {
    botonVolverPago.addEventListener("click", () => {
      limpiarFacturaActual();
      mostrarPantallaFacturas();
    });
  }
  
  // Event listener del botón registrar pago
  const botonRegistrarPago = document.getElementById("boton-registrar-pago");
  if (botonRegistrarPago) {
    botonRegistrarPago.addEventListener("click", () => {
      registrarPago();
    });
  }
  
  // Event listener del botón finalizar
  const botonFinalizar = document.getElementById("boton-finalizar");
  if (botonFinalizar) {
    botonFinalizar.addEventListener("click", () => {
      limpiarFacturaActual();
      mostrarPantallaInicial();
    });
  }
  
  // Inicializar medios de pago
  inicializarMediosPago();
}

// Inicializar cuando el DOM esté listo
function inicializar() {
  console.log('Inicializando eventos de IngresarPago...');
  try {
    inicializarEventos();
    console.log('Eventos inicializados correctamente');
  } catch (error) {
    console.error('Error al inicializar eventos:', error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', inicializar);
} else {
  // Si el DOM ya está cargado, esperar un poco para asegurar que todos los módulos estén listos
  setTimeout(inicializar, 100);
}

