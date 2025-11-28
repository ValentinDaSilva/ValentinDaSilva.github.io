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
        this._apellido = apellido;
        this._nombre = nombre;
        this._tipoDocumento = tipoDocumento;
        this._nroDocumento = numeroDocumento;
        this._cuit = cuit || '';
        this._fechaNacimiento = new Date(fechaNacimiento);
        this._telefono = telefono || '';
        this._email = email || '';
        this._ocupacion = ocupacion;
        this._nacionalidad = nacionalidad;
        this._direccion = direccion;  // Direccion o null
    }

    // ==========================
    // GETTERS (métodos)
    // ==========================
    getApellido() { return this._apellido; }
    getNombre() { return this._nombre; }
    getTipoDocumento() { return this._tipoDocumento; }
    getNumeroDocumento() { return this._nroDocumento; }
    getNroDocumento() { return this._nroDocumento; }
    getCuit() { return this._cuit; }
    getFechaNacimiento() { return this._fechaNacimiento; }
    getTelefono() { return this._telefono; }
    getEmail() { return this._email; }
    getOcupacion() { return this._ocupacion; }
    getNacionalidad() { return this._nacionalidad; }
    getDireccion() { return this._direccion; }

    // ==========================
    // SETTERS (métodos)
    // ==========================
    setApellido(v) { this._apellido = v; }
    setNombre(v) { this._nombre = v; }
    setTipoDocumento(v) { this._tipoDocumento = v; }
    setNumeroDocumento(v) { this._nroDocumento = v; }
    setNroDocumento(v) { this._nroDocumento = v; }
    setCuit(v) { this._cuit = v; }
    setFechaNacimiento(v) { this._fechaNacimiento = new Date(v); }
    setTelefono(v) { this._telefono = v; }
    setEmail(v) { this._email = v; }
    setOcupacion(v) { this._ocupacion = v; }
    setNacionalidad(v) { this._nacionalidad = v; }
    setDireccion(v) { this._direccion = v; }

    // ==========================
    // MÉTODOS DE LÓGICA
    // ==========================
    calcularEdad() {
        if (!this._fechaNacimiento) return 0;

        const hoy = new Date();
        const fechaNac = new Date(this._fechaNacimiento);

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
