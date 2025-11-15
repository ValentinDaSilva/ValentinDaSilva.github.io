class Factura {
    constructor(id, hora, fecha, tipo, estado, responsableDePago, medioDePago, estadia) {
        this.id = id;
        this.hora = hora;
        this.fecha = fecha;
        this.tipo = tipo;
        this.estado = estado;
        this.responsableDePago = responsableDePago; // Tipo clase ResponsableDePago
        this.medioDePago = medioDePago; // Tipo clase MedioDePago 
        this.estadia = estadia; // Tipo clase Estadia
        this.pagos = []; // Array de tipo clase Pago
        this.total = 0; // Total de la factura
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
}

export default Factura;