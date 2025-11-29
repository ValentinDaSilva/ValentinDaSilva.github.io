// /Clases/Dominio/Huesped.js

class Huesped {
    constructor(
        nombre,
        apellido,
        tipoDocumento,
        nroDocumento,
        cuit,
        fechaNacimiento,
        telefono,
        email,
        ocupacion,
        nacionalidad,
        direccion
    ) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.tipoDocumento = tipoDocumento;
        this.nroDocumento = nroDocumento;
        this.cuit = cuit;
        this.fechaNacimiento = fechaNacimiento;
        this.telefono = telefono;
        this.email = email;
        this.ocupacion = ocupacion;
        this.nacionalidad = nacionalidad;
        this.direccion = direccion;
    }

    // ==========================================================
    // GETTERS
    // ==========================================================
    getNombre() { return this.nombre; }
    getApellido() { return this.apellido; }
    getTipoDocumento() { return this.tipoDocumento; }
    getNumeroDocumento() { return this.nroDocumento; }
    getCuit() { return this.cuit; }
    getFechaNacimiento() { return this.fechaNacimiento; }
    getTelefono() { return this.telefono; }
    getEmail() { return this.email; }
    getOcupacion() { return this.ocupacion; }
    getNacionalidad() { return this.nacionalidad; }
}

export { Huesped };
