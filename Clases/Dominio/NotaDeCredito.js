class NotaDeCredito {
    constructor(responsable = null) {
        this.idNota = null;
        this.fecha = new Date();
        this.responsable = responsable;
        this.facturas = [];   
        this.total = 0;
        this.tipo = null;
    }

    get getIdNota() {
        return this.idNota;
    }

    set setIdNota(idNota) {
        this.idNota = idNota;
    }

    get getFecha() {
        return this.fecha;
    }

    set setFecha(fecha) {
        this.fecha = fecha;
    }

    get getResponsable() {
        return this.responsable;
    }

    set setResponsable(responsable) {
        this.responsable = responsable;
    }

    get getFacturas() {
        return this.facturas;
    }

    set setFacturas(facturas) {
        this.facturas = facturas;
        this.calcularTotal();
    }

    get getTotal() {
        return this.total;
    }

    get getTipo() {
        return this.tipo;
    }

    set setTipo(tipo) {
        this.tipo = tipo;
    }

    agregarFactura(factura) {
        this.facturas.push(factura);
        factura.notaDeCredito = this;  
        this.calcularTotal();
    }

    calcularTotal() {
        this.total = this.facturas.reduce((acc, f) => acc + (f.total || 0), 0);
    }
}

export default NotaDeCredito;




