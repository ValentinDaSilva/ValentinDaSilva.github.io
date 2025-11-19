

import { obtenerFacturaActual, establecerFacturaActual } from './seleccion-factura.js';
import { actualizarFactura, obtenerFacturaPorId } from './datos-facturas.js';
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


// Los pagos se agregan directamente a la factura, no se guardan en un JSON separado


export async function registrarPago() {
  let factura = obtenerFacturaActual();
  
  if (!factura) {
    mensajeError("No hay una factura seleccionada.");
    return;
  }
  
  // Si facturaActual es JSON, convertir a clase
  let facturaClase = factura;
  if (!factura.getPagos) {
    facturaClase = convertirFacturaJSONAClase(factura);
    factura = facturaClase;
  }
  
  // getEstado es un getter, no un método
  const estado = (factura.getEstado !== undefined) ? factura.getEstado : factura.estado;
  if (estado === 'Pagada') {
    mensajeError("No se puede pagar una factura ya pagada.");
    return;
  }
  
  
  const datosPago = obtenerDatosMediosPago();
  
  
  if (!validarDatosPago(datosPago)) {
    return;
  }
    
  
  let pagosCreados = [];
  
  try {
    if (window.gestorFactura) {
      pagosCreados = await window.gestorFactura.ingresarPago(factura, datosPago);
    } else if (window.gestorIngresarPago) {
      pagosCreados = await window.gestorIngresarPago.procesarPago(factura, datosPago);
    } else {
      
      for (const medio of datosPago.medioPago) {
        const detalles = datosPago.detalles[medio] || {};
        const medioNormalizado = medio.toLowerCase();
        
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
          }
        } else {
          
          const pagoClase = crearInstanciaPago({
            medioPago: medio,
            monto: detalles.monto,
            detalles: detalles
          });
          facturaClase.agregarPago(pagoClase);
          pagosCreados.push(pagoClase);
        }
      }
    }
    
    if (pagosCreados && pagosCreados.length > 0) {
      // Agregar los pagos a la instancia de Factura
      for (const pago of pagosCreados) {
        if (pago && facturaClase.agregarPago) {
          // Si el pago es un objeto JSON, crear instancia de Pago
          if (!pago.getMontoTotal) {
            // crearInstanciaPago ya está importado arriba, no necesitamos importarlo de nuevo
            const pagoInstancia = crearInstanciaPago({
              fecha: pago.fecha,
              hora: pago.hora,
              medioPago: pago.medioPago,
              monto: pago.monto,
              detalles: pago.detalles
            });
            facturaClase.agregarPago(pagoInstancia);
          } else {
            facturaClase.agregarPago(pago);
          }
        }
      }
      
      // Actualizar facturaActual con la instancia actualizada
      establecerFacturaActual(facturaClase);
      
      mostrarJSONFacturaEnPantalla(facturaClase, () => {
        console.log('JSON de factura con pago mostrado');
      });
      
      
      actualizarResumenPago(facturaClase);
      
      
      mostrarPagosRealizados(facturaClase);
      
      
      // Obtener total de la factura
      // getTotal es un getter, no un método
      const total = facturaClase.detalle ? facturaClase.detalle.total : ((facturaClase.getTotal !== undefined) ? facturaClase.getTotal : 0);
      
      // Calcular total pagado desde los pagos de la clase
      // getPagos es un getter, no un método, así que se accede sin paréntesis
      const pagos = (facturaClase.getPagos !== undefined) ? facturaClase.getPagos : (facturaClase.pagos || []);
      const pagado = pagos.reduce((sum, pago) => {
        // En la clase Pago, el getter es montoTotal directamente, no getMontoTotal
        const monto = pago.montoTotal || pago._montoTotal || 0;
        return sum + monto;
      }, 0);
      
      const deuda = total - pagado;
      
      if (deuda <= 0) {
        
        facturaClase.setEstado(EstadoFactura.PAGADA);
        
        // Actualizar factura JSON en BD
        // getId es un getter, no un método
        const facturaId = (facturaClase.getId !== undefined) ? facturaClase.getId : facturaClase.id;
        const facturaJSON = obtenerFacturaPorId(facturaId);
        if (facturaJSON) {
          facturaJSON.estado = EstadoFactura.PAGADA;
          await actualizarFactura(facturaJSON);
        }
        
        
        const vuelto = Math.max(0, pagado - total);
        
        
        const numeroHabitacion = obtenerHabitacionActual();
        if (numeroHabitacion) {
          const facturasPendientes = obtenerFacturasPendientesPorHabitacion(numeroHabitacion);
          
          
          if (facturasPendientes.length === 0) {
            await actualizarEstadoHabitacion(numeroHabitacion, 'Disponible');
          }
        }
        
        
        mensajeExito("Factura saldada. Toque una tecla para continuar.", () => {
          
          mostrarPantallaInicial();
        });
      } else {
        
        limpiarFormularioPago();
      }
    }
    
  } catch (error) {
    console.error('Error al registrar pago:', error);
    mensajeError("Error al registrar el pago. Por favor, intente nuevamente.");
  }
}


function limpiarFormularioPago() {
  
  document.querySelectorAll('input[name="medioPago"]').forEach(cb => {
    cb.checked = false;
  });
  
  
  const contenedor = document.getElementById('camposPago');
  if (contenedor) {
    contenedor.innerHTML = '';
  }
}


