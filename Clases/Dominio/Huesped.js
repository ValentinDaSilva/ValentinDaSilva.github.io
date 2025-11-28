import { Direccion } from "./Direccion.js";

export class Huesped {
    constructor(
        nombre,
        apellido,
        tipoDocumento,
        numeroDocumento,
        cuit,
        fechaNacimiento,
        telefono,
        email,
        ocupacion,
        nacionalidad,
        direccion = null
    ) {
        this.apellido = apellido;
        this.nombre = nombre;
        this.tipoDocumento = tipoDocumento;
        this.nroDocumento = numeroDocumento;
        this.cuit = cuit || '';
        this.fechaNacimiento = new Date(fechaNacimiento);
        this.telefono = telefono || '';
        this.email = email || '';
        this.ocupacion = ocupacion;
        this.nacionalidad = nacionalidad;
        this.direccion = direccion;  // Direccion o null
    }

    // ==========================
    // GETTERS (métodos)
    // ==========================
    getApellido() { return this.apellido; }
    getNombre() { return this.nombre; }
    getTipoDocumento() { return this.tipoDocumento; }
    getNumeroDocumento() { return this.nroDocumento; }
    getNroDocumento() { return this.nroDocumento; }
    getCuit() { return this.cuit; }
    getFechaNacimiento() { return this.fechaNacimiento; }
    getTelefono() { return this.telefono; }
    getEmail() { return this.email; }
    getOcupacion() { return this.ocupacion; }
    getNacionalidad() { return this.nacionalidad; }
    getDireccion() { return this.direccion; }

    // ==========================
    // SETTERS (métodos)
    // ==========================
    setApellido(v) { this.apellido = v; }
    setNombre(v) { this.nombre = v; }
    setTipoDocumento(v) { this.tipoDocumento = v; }
    setNumeroDocumento(v) { this.nroDocumento = v; }
    setNroDocumento(v) { this.nroDocumento = v; }
    setCuit(v) { this.cuit = v; }
    setFechaNacimiento(v) { this.fechaNacimiento = new Date(v); }
    setTelefono(v) { this.telefono = v; }
    setEmail(v) { this.email = v; }
    setOcupacion(v) { this.ocupacion = v; }
    setNacionalidad(v) { this.nacionalidad = v; }
    setDireccion(v) { this.direccion = v; }

    // ==========================
    // MÉTODOS DE LÓGICA
    // ==========================
    calcularEdad() {
        if (!this.fechaNacimiento) return 0;

        const hoy = new Date();
        const fechaNac = new Date(this.fechaNacimiento);

        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    }

    /**
     * Verifica si el huésped es mayor de edad
     * @returns {boolean}
     */
    verificarMayorEdad() {
        return this.calcularEdad() >= 18;
    }
}
