/* Validaciones de formulario */

import { existeHabitacion } from './datos-habitaciones.js';
import { mensajeError } from './modales.js';

/**
 * Valida el número de habitación
 * @param {string} numeroHabitacion - Número de habitación a validar
 * @returns {Promise<boolean>} - true si es válido, false en caso contrario
 */
export async function validarHabitacion(numeroHabitacion) {
  if (!numeroHabitacion || numeroHabitacion.trim() === '') {
    mensajeError("Por favor, ingrese un número de habitación.");
    const input = document.getElementById("numeroHabitacion");
    if (input) {
      input.style.border = "2px solid red";
    }
    return false;
  }

  const numero = parseInt(numeroHabitacion.trim());
  if (isNaN(numero)) {
    mensajeError("El número de habitación debe ser un número válido.");
    const input = document.getElementById("numeroHabitacion");
    if (input) {
      input.style.border = "2px solid red";
    }
    return false;
  }

  // Asegurarse de que las habitaciones estén cargadas
  const { cargarHabitaciones } = await import('./datos-habitaciones.js');
  await cargarHabitaciones();
  
  if (!existeHabitacion(numero)) {
    mensajeError(`La habitación ${numero} no existe.`);
    const input = document.getElementById("numeroHabitacion");
    if (input) {
      input.style.border = "2px solid red";
    }
    return false;
  }

  const input = document.getElementById("numeroHabitacion");
  if (input) {
    input.style.border = "";
  }

  return true;
}

/**
 * Valida los datos del pago
 * @param {Object} datosPago - Datos del pago a validar
 * @returns {boolean} - true si es válido, false en caso contrario
 */
export function validarDatosPago(datosPago) {
  if (!datosPago.medioPago || datosPago.medioPago.length === 0) {
    mensajeError("Debe seleccionar al menos un medio de pago.");
    return false;
  }

  if (!datosPago.monto || datosPago.monto <= 0) {
    mensajeError("El monto del pago debe ser mayor a cero.");
    return false;
  }

  // Validaciones específicas por medio de pago
  for (const medio of datosPago.medioPago) {
    const detalles = datosPago.detalles[medio] || {};
    const medioNormalizado = medio.toLowerCase();
    
    switch (medioNormalizado) {
      case 'efectivo':
        if (!detalles.monto || detalles.monto <= 0) {
          mensajeError("Debe ingresar el monto en efectivo.");
          return false;
        }
        break;
      
      case 'monedaextranjera':
        if (!detalles.monto || detalles.monto <= 0) {
          mensajeError("Debe ingresar el monto en moneda extranjera.");
          return false;
        }
        if (!detalles.tipoMoneda || detalles.tipoMoneda.trim() === '') {
          mensajeError("Debe especificar el tipo de moneda extranjera.");
          return false;
        }
        if (!detalles.cotizacion || detalles.cotizacion <= 0) {
          mensajeError("Debe ingresar la cotización de la moneda extranjera.");
          return false;
        }
        break;
      
      case 'cheques':
        if (!detalles.cantidad || detalles.cantidad <= 0) {
          mensajeError("Debe ingresar la cantidad de cheques.");
          return false;
        }
        if (!detalles.cheques || detalles.cheques.length === 0) {
          mensajeError("Debe ingresar al menos un cheque.");
          return false;
        }
        // Validar cada cheque
        for (const cheque of detalles.cheques) {
          if (!cheque.numero || cheque.numero.trim() === '') {
            mensajeError("Todos los cheques deben tener un número.");
            return false;
          }
          if (!cheque.monto || cheque.monto <= 0) {
            mensajeError("Todos los cheques deben tener un monto válido.");
            return false;
          }
          if (!cheque.fechaVencimiento) {
            mensajeError("Todos los cheques deben tener una fecha de vencimiento.");
            return false;
          }
        }
        break;
      
      case 'tarjetas':
        if (!detalles.cantidad || detalles.cantidad <= 0) {
          mensajeError("Debe ingresar la cantidad de tarjetas.");
          return false;
        }
        if (!detalles.tarjetas || detalles.tarjetas.length === 0) {
          mensajeError("Debe ingresar al menos una tarjeta.");
          return false;
        }
        // Validar cada tarjeta
        for (const tarjeta of detalles.tarjetas) {
          if (!tarjeta.tipo || tarjeta.tipo.trim() === '') {
            mensajeError("Todas las tarjetas deben tener un tipo.");
            return false;
          }
          if (!tarjeta.monto || tarjeta.monto <= 0) {
            mensajeError("Todas las tarjetas deben tener un monto válido.");
            return false;
          }
          if (!tarjeta.numeroTarjeta || tarjeta.numeroTarjeta.trim() === '') {
            mensajeError("Todas las tarjetas deben tener un número.");
            return false;
          }
        }
        break;
    }
  }

  return true;
}

