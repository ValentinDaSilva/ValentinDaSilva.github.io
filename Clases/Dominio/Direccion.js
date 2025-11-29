// /Clases/Dominio/Direccion.js

class Direccion {
    constructor(calle, numero, piso, departamento, localidad, provincia, codigoPostal, pais) {
        this.calle = calle;
        this.numero = numero;
        this.piso = piso;
        this.departamento = departamento;
        this.localidad = localidad;
        this.provincia = provincia;
        this.codigoPostal = codigoPostal;
        this.pais = pais;
    }

    getCalle() { return this.calle; }
    getNumero() { return this.numero; }
    getPiso() { return this.piso; }
    getDepartamento() { return this.departamento; }
    getLocalidad() { return this.localidad; }
    getProvincia() { return this.provincia; }
    getCodigoPostal() { return this.codigoPostal; }
    getPais() { return this.pais; }
}

export { Direccion };
