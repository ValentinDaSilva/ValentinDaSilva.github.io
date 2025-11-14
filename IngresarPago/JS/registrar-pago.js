/* Registro de pagos */

import { obtenerFacturaActual } from './seleccion-factura.js';
import { actualizarFactura, obtenerFacturaPorId } from './datos-facturas.js';
import { crearPago, calcularTotalPagado } from './datos-pagos.js';
import { obtenerDatosMediosPago } from './medios-pago.js';
import { validarDatosPago } from './validaciones.js';
import { actualizarResumenPago, mostrarPagosRealizados } from './seleccion-factura.js';
import { mensajeError, mensajeExito } from './modales.js';
import { EstadoFactura } from '../../../Clases/Dominio/Enums.js';
import { obtenerFacturasPendientesPorHabitacion } from './datos-facturas.js';
import { obtenerHabitacionActual } from './buscar-facturas.js';
import { actualizarEstadoHabitacion } from './actualizar-habitacion.js';
import { mostrarPantallaInicial } from './navegacion-pantallas.js';
import { crearInstanciaPago } from './crear-pago-clase.js';
import { convertirFacturaJSONAClase } from './convertir-factura-clase.js';
import { mostrarJSONFacturaEnPantalla } from './mostrar-json-factura.js';

/**
 * Registra un pago para la factura actual
 */
export async function registrarPago() {
  const factura = obtenerFacturaActual();
  
  if (!factura) {
    mensajeError("No hay una factura seleccionada.");
    return;
  }
  
  if (factura.estado === 'Pagada') {
    mensajeError("No se puede pagar una factura ya pagada.");
    return;
  }
  
  // Obtener datos de los medios de pago
  const datosPago = obtenerDatosMediosPago();
  
  // Validar datos
  if (!validarDatosPago(datosPago)) {
    return;
  }
  
  // Convertir factura JSON a instancia de clase
  const facturaClase = convertirFacturaJSONAClase(factura);
    
  // Crear instancias de Pago para cada medio seleccionado
  const pagosCreados = [];
  
  try {
    for (const medio of datosPago.medioPago) {
      const detalles = datosPago.detalles[medio] || {};
      const medioNormalizado = medio.toLowerCase();
      
      // Si hay múltiples items (cheques, tarjetas), crear un pago por cada uno
      if (medioNormalizado === 'cheques' && detalles.cheques) {
        for (const cheque of detalles.cheques) {
          const pagoClase = crearInstanciaPago({
            medioPago: medio,
            monto: cheque.monto,
            detalles: {
              cheques: [cheque]
            }
          });
          facturaClase.agregarPago(pagoClase);
          pagosCreados.push(pagoClase);
          
          // También crear registro en datos-pagos.js para persistencia
          await crearPago({
            idFactura: factura.id,
            medioPago: medio,
            monto: cheque.monto,
            detalles: {
              numero: cheque.numero,
              fechaVencimiento: cheque.fechaVencimiento
            }
          });
        }
      } else if (medioNormalizado === 'tarjetas' && detalles.tarjetas) {
        for (const tarjeta of detalles.tarjetas) {
          const pagoClase = crearInstanciaPago({
            medioPago: medio,
            monto: tarjeta.monto,
            detalles: {
              tarjetas: [tarjeta]
            }
          });
          facturaClase.agregarPago(pagoClase);
          pagosCreados.push(pagoClase);
          
          // También crear registro en datos-pagos.js para persistencia
          await crearPago({
            idFactura: factura.id,
            medioPago: medio,
            monto: tarjeta.monto,
            detalles: {
              tipo: tarjeta.tipo,
              numeroTarjeta: tarjeta.numeroTarjeta
            }
          });
        }
      } else {
        // Pago único (efectivo, moneda extranjera)
        const pagoClase = crearInstanciaPago({
          medioPago: medio,
          monto: detalles.monto,
          detalles: detalles
        });
        facturaClase.agregarPago(pagoClase);
        pagosCreados.push(pagoClase);
        
        // También crear registro en datos-pagos.js para persistencia
        await crearPago({
          idFactura: factura.id,
          medioPago: medio,
          monto: detalles.monto,
          detalles: detalles
        });
      }
    }
    
    // Mostrar JSON de la factura con el pago agregado
    mostrarJSONFacturaEnPantalla(facturaClase, () => {
      console.log('JSON de factura con pago mostrado');
    });
    
    // Actualizar resumen de pago
    actualizarResumenPago(factura.id);
    
    // Recargar tabla de pagos
    mostrarPagosRealizados(factura.id);
    
    // Verificar si la factura está completamente pagada
    const total = factura.detalle?.total || 0;
    const pagado = calcularTotalPagado(factura.id);
    const deuda = total - pagado;
    
    if (deuda <= 0) {
      // Marcar factura como pagada
      factura.estado = EstadoFactura.PAGADA;
      await actualizarFactura(factura);
      
      // Calcular vuelto
      const vuelto = Math.max(0, pagado - total);
      
      // Verificar si hay más facturas pendientes para la habitación
      const numeroHabitacion = obtenerHabitacionActual();
      if (numeroHabitacion) {
        const facturasPendientes = obtenerFacturasPendientesPorHabitacion(numeroHabitacion);
        
        // Si no hay más facturas pendientes, actualizar habitación a "libre"
        if (facturasPendientes.length === 0) {
          await actualizarEstadoHabitacion(numeroHabitacion, 'Disponible');
        }
      }
      
      // Mostrar mensaje de éxito
      mensajeExito("Factura saldada. Toque una tecla para continuar.", () => {
        // Volver a la pantalla inicial
        mostrarPantallaInicial();
      });
    } else {
      // Limpiar formulario para permitir otro pago
      limpiarFormularioPago();
    }
    
  } catch (error) {
    console.error('Error al registrar pago:', error);
    mensajeError("Error al registrar el pago. Por favor, intente nuevamente.");
  }
}

/**
 * Limpia el formulario de pago
 */
function limpiarFormularioPago() {
  // Desmarcar todos los checkboxes
  document.querySelectorAll('input[name="medioPago"]').forEach(cb => {
    cb.checked = false;
  });
  
  // Limpiar campos
  const contenedor = document.getElementById('camposPago');
  if (contenedor) {
    contenedor.innerHTML = '';
  }
}


