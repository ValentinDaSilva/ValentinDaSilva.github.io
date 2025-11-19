/**
 * Factura - Clase que representa una factura del hotel.
 * 
 * MÉTODOS PÚBLICOS (sin getters y setters):
 * - agregarPago(pago)
 *   → Agrega un pago a la factura.
 * 
 * - calcularTotalConsumos(consumos)
 *   → Calcula el total de consumos de la estadía basado en un array de consumos.
 * 
 * - calcularRecargoCheckout(horaSalida, costoPorNoche)
 *   → Calcula el recargo por checkout tardío según la hora de salida y costo por noche.
 * 
 * - calcularIVA(subtotal)
 *   → Calcula el IVA (21%) sobre un subtotal.
 * 
 * - async calcularDetalle(estadia, horaSalida)
 *   → Calcula y actualiza el detalle completo de la factura (valor estadía, consumos, recargos, IVA, total).
 * 
 */
class Factura {
    constructor(id, hora, fecha, tipo, estado, responsableDePago, medioDePago, estadia) {
        this.id = id;
        this.hora = hora;
        this.fecha = fecha;
        this.tipo = tipo;
        this.estado = estado;
        this.responsableDePago = responsableDePago; 
        this.medioDePago = medioDePago; 
        this.estadia = estadia; 
        this.pagos = []; 
        this.total = 0;
        this.detalle = null; // Contendrá valorEstadia, consumos, recargo, iva, etc.
        this.horaSalida = null; // Hora de salida para calcular recargos
    }


    /**
     * Calcula el total de consumos de la estadía
     * @param {Array} consumos - Array de consumos con propiedad 'precio'
     * @returns {number} Total de consumos
     */
    calcularTotalConsumos(consumos) {
        if (!consumos || !Array.isArray(consumos)) {
            return 0;
        }
        
        return consumos.reduce((total, consumo) => {
            return total + (consumo.precio || 0);
        }, 0);
    }

    /**
     * Calcula el recargo por checkout tardío
     * @param {string} horaSalida - Hora de salida en formato HH:MM
     * @param {number} costoPorNoche - Costo por noche de la habitación
     * @returns {Object} Objeto con recargo, tipo, mensaje y si requiere nueva ocupación
     */
    calcularRecargoCheckout(horaSalida, costoPorNoche) {
        if (!horaSalida || !costoPorNoche) {
            return {
                recargo: 0,
                tipo: 'normal',
                mensaje: '',
                requiereNuevaOcupacion: false
            };
        }

        const [horas, minutos] = horaSalida.split(':').map(Number);
        const minutosDesdeMedianoche = horas * 60 + minutos;
        
        const limiteTolerancia = 11 * 60; // 11:00
        const limiteRecargoCompleto = 18 * 60; // 18:00

        if (minutosDesdeMedianoche <= limiteTolerancia) {
            return {
                recargo: 0,
                tipo: 'normal',
                mensaje: 'Check-out normal (antes de las 11:00)',
                requiereNuevaOcupacion: false
            };
        } else if (minutosDesdeMedianoche <= limiteRecargoCompleto) {
            const recargo = costoPorNoche * 0.5;
            return {
                recargo: recargo,
                tipo: 'recargo_parcial',
                mensaje: `Recargo por checkout tardío (11:01 - 18:00): 50% del valor de la habitación`,
                requiereNuevaOcupacion: false
            };
        } else {
            const recargo = costoPorNoche;
            return {
                recargo: recargo,
                tipo: 'recargo_completo',
                mensaje: `Recargo por checkout tardío (después de las 18:00): día completo`,
                requiereNuevaOcupacion: true
            };
        }
    }

    /**
     * Calcula el IVA sobre un subtotal (21%)
     * @param {number} subtotal - Subtotal sobre el cual calcular IVA
     * @returns {number} Monto de IVA
     */
    calcularIVA(subtotal) {
        return subtotal * 0.21;
    }

    /**
     * Calcula y actualiza el detalle completo de la factura
     * @param {Object} estadia - Objeto estadía con reserva, consumos, etc.
     * @param {string} horaSalida - Hora de salida para calcular recargos
     * @returns {Promise<Object>} Objeto detalle con todos los cálculos
     */
    async calcularDetalle(estadia, horaSalida) {
        if (!estadia) {
            throw new Error('No se puede calcular el detalle sin estadía');
        }

        // Asignar la estadía a la factura para poder usar sus métodos
        this.estadia = estadia;
        this.horaSalida = horaSalida;

        // Usar métodos de la estadía si es una instancia de Estadia
        let valorEstadia = 0;
        let numeroNoches = 0;
        let costoPorNoche = 0;
        let consumos = [];

        if (estadia.calcularValorEstadia && typeof estadia.calcularValorEstadia === 'function') {
            // Es una instancia de Estadia - usar sus métodos
            valorEstadia = estadia.calcularValorEstadia();
            numeroNoches = estadia.calcularNumeroNoches();
            costoPorNoche = estadia.obtenerCostoPorNoche();
            consumos = estadia.consumos || (estadia.getConsumos ? estadia.getConsumos() : []);
        } else {
            // Es un objeto JSON - convertir a instancia de Estadia para usar sus métodos
            // Para mantener compatibilidad, crear una instancia temporal
            const Estadia = (await import('./Estadia.js')).default;
            const estadiaInstancia = new Estadia(
                estadia.id,
                estadia.fechaCheckIn,
                estadia.fechaCheckOut || this.obtenerFechaActual(),
                estadia.estado,
                estadia.reserva,
                estadia.titular,
                estadia.acompaniantes || []
            );
            if (estadia.consumos) {
                estadiaInstancia.consumos = estadia.consumos;
            }
            
            valorEstadia = estadiaInstancia.calcularValorEstadia();
            numeroNoches = estadiaInstancia.calcularNumeroNoches();
            costoPorNoche = estadiaInstancia.obtenerCostoPorNoche();
            consumos = estadiaInstancia.consumos || [];
        }

        const totalConsumos = this.calcularTotalConsumos(consumos);
        const recargoCheckout = this.calcularRecargoCheckout(horaSalida, costoPorNoche);

        const subtotal = valorEstadia + totalConsumos + recargoCheckout.recargo;
        const iva = this.calcularIVA(subtotal);
        const total = subtotal + iva;

        this.detalle = {
            valorEstadia: valorEstadia,
            numeroNoches: numeroNoches,
            costoPorNoche: costoPorNoche,
            consumos: consumos,
            totalConsumos: totalConsumos,
            recargoCheckout: recargoCheckout.recargo,
            tipoRecargoCheckout: recargoCheckout.tipo,
            mensajeRecargoCheckout: recargoCheckout.mensaje,
            requiereNuevaOcupacion: recargoCheckout.requiereNuevaOcupacion,
            subtotal: subtotal,
            iva: iva,
            total: total
        };

        // Actualizar el total de la factura
        this.total = total;

        return this.detalle;
    }

    /**
     * Obtiene la fecha actual en formato YYYY-MM-DD
     * @returns {string} Fecha actual formateada
     */
    obtenerFechaActual() {
        const hoy = new Date();
        const año = hoy.getFullYear();
        const mes = String(hoy.getMonth() + 1).padStart(2, '0');
        const día = String(hoy.getDate()).padStart(2, '0');
        return `${año}-${mes}-${día}`;
    }

    /**
     * Obtiene el detalle de la factura
     * @returns {Object} Detalle de la factura
     */
    get getDetalle() {
        return this.detalle;
    }

    /**
     * Establece el detalle de la factura
     * @param {Object} detalle - Detalle de la factura
     */
    set setDetalle(detalle) {
        this.detalle = detalle;
        if (detalle && detalle.total) {
            this.total = detalle.total;
        }
    }
    get getId() {
        return this.id;
    }
    set setId(id) {
        this.id = id;
    }

    get getHora() {
        return this.hora;
    }
    set setHora(hora) {
        this.hora = hora;
    }

    get getFecha() {
        return this.fecha;
    }
    set setFecha(fecha) {
        this.fecha = fecha;
    }

    get getTipo() {
        return this.tipo;
    }
    set setTipo(tipo) {
        this.tipo = tipo;
    }

    get getEstado() {
        return this.estado;
    }
    set setEstado(estado) {
        this.estado = estado;
    }

    agregarPago(pago) {
        this.pagos.push(pago);
    }

    get getPagos() {
        return this.pagos;
    }

    set setPagos(pagos) {
        this.pagos = pagos;
    }

    get getNotaDeCredito() {
        return this.notaDeCredito;
    }


    get getTotal() {
        return this.total;
    }

    set setTotal(total) {
        this.total = total;
    }

    /**
     * Obtiene la hora de salida
     * @returns {string} Hora de salida
     */
    get getHoraSalida() {
        return this.horaSalida;
    }

    /**
     * Establece la hora de salida
     * @param {string} horaSalida - Hora de salida en formato HH:MM
     */
    set setHoraSalida(horaSalida) {
        this.horaSalida = horaSalida;
    }
}

export default Factura;