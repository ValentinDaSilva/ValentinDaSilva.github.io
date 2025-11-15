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