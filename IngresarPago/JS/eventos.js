

import { validarHabitacion } from './validaciones.js';
import { buscarFacturasPendientes, mostrarFacturasEnTabla } from './buscar-facturas.js';
import { mensajeError } from './modales.js';
import { mostrarPantallaFacturas, mostrarPantallaInicial, mostrarPantallaPago } from './navegacion-pantallas.js';
import { inicializarMediosPago } from './medios-pago.js';
import { registrarPago } from './registrar-pago.js';
import { limpiarFacturaActual } from './seleccion-factura.js';


export function inicializarEventos() {
  console.log('Inicializando eventos...');
  
  
  async function buscarFacturas() {
    console.log('Función buscarFacturas llamada');
    
    const numeroHabitacion = document.getElementById("numeroHabitacion")?.value.trim();
    console.log('Número de habitación:', numeroHabitacion);
    
    if (!numeroHabitacion) {
      mensajeError("Por favor, ingrese un número de habitación.");
      return;
    }
    
    
    const esValida = await validarHabitacion(numeroHabitacion);
    console.log('Habitación válida:', esValida);
    if (!esValida) {
      return;
    }
    
    
    const { cargarFacturas } = await import('./datos-facturas.js');
    await cargarFacturas();
    
    
    const facturas = buscarFacturasPendientes(parseInt(numeroHabitacion));
    console.log('Facturas encontradas:', facturas.length);
    
    if (facturas.length === 0) {
      mensajeError("No hay facturas pendientes para esta habitación.");
      return;
    }
    
    
    mostrarFacturasEnTabla(facturas);
    
    
    mostrarPantallaFacturas();
  }
  
  
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
  
  
  const botonVolverFacturas = document.getElementById("boton-volver-facturas");
  if (botonVolverFacturas) {
    botonVolverFacturas.addEventListener("click", () => {
      mostrarPantallaInicial();
    });
  }
  
  
  const botonVolverPago = document.getElementById("boton-volver-pago");
  if (botonVolverPago) {
    botonVolverPago.addEventListener("click", () => {
      limpiarFacturaActual();
      mostrarPantallaFacturas();
    });
  }
  
  
  const botonRegistrarPago = document.getElementById("boton-registrar-pago");
  if (botonRegistrarPago) {
    botonRegistrarPago.addEventListener("click", () => {
      registrarPago();
    });
  }
  
  
  const botonFinalizar = document.getElementById("boton-finalizar");
  if (botonFinalizar) {
    botonFinalizar.addEventListener("click", () => {
      limpiarFacturaActual();
      mostrarPantallaInicial();
    });
  }
  
  
  inicializarMediosPago();
}


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
  
  setTimeout(inicializar, 100);
}

