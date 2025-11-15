

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
  
  
  const datosPago = obtenerDatosMediosPago();
  
  
  if (!validarDatosPago(datosPago)) {
    return;
  }
  
  
  const facturaClase = convertirFacturaJSONAClase(factura);
    
  
  const pagosCreados = [];
  
  try {
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
        
        const pagoClase = crearInstanciaPago({
          medioPago: medio,
          monto: detalles.monto,
          detalles: detalles
        });
        facturaClase.agregarPago(pagoClase);
        pagosCreados.push(pagoClase);
        
        
        await crearPago({
          idFactura: factura.id,
          medioPago: medio,
          monto: detalles.monto,
          detalles: detalles
        });
      }
    }
    
    
    mostrarJSONFacturaEnPantalla(facturaClase, () => {
      console.log('JSON de factura con pago mostrado');
    });
    
    
    actualizarResumenPago(factura.id);
    
    
    mostrarPagosRealizados(factura.id);
    
    
    const total = factura.detalle?.total || 0;
    const pagado = calcularTotalPagado(factura.id);
    const deuda = total - pagado;
    
    if (deuda <= 0) {
      
      factura.estado = EstadoFactura.PAGADA;
      await actualizarFactura(factura);
      
      
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


