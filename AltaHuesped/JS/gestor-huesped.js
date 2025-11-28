import { Direccion } from "/Clases/Dominio/Direccion.js";
import { Huesped } from "/Clases/Dominio/Huesped.js";
import { HuespedDTO, DireccionDTO } from "/Clases/DTO/dto.js";

class GestorAltaHuesped {
    constructor() {}

    static extraerDatosFormulario() {
        const formData = {
            apellido: document.getElementById('apellido').value.trim(),
            nombre: document.getElementById('nombres').value.trim(),
            tipoDocumento: document.getElementById('tipoDocumento').value.trim(),
            numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
            cuit: document.getElementById('cuit').value.trim() || null,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            caracteristica: document.getElementById('caracteristica').value.trim(),
            telefonoNumero: document.getElementById('telefonoNumero').value.trim(),
            email: document.getElementById('email').value.trim() || null,
            ocupacion: document.getElementById('ocupacion').value.trim(),
            nacionalidad: document.getElementById('nacionalidad').value.trim(),

            calle: document.getElementById('calle').value.trim(),
            numero: document.getElementById('numeroCalle').value.trim(),
            departamento: document.getElementById('departamento').value.trim() || '',
            piso: document.getElementById('piso').value.trim() || '',
            codigoPostal: document.getElementById('codigoPostal').value.trim(),
            localidad: document.getElementById('localidad').value.trim(),
            provincia: document.getElementById('provincia').value.trim(),
            pais: document.getElementById('pais').value.trim()
        };

        formData.telefono = `${formData.caracteristica}-${formData.telefonoNumero}`;
        return formData;
    }

    static validarTodosLosCampos() {
        const todosLosCamposValidos = validarTodosLosCampos();
        if (!todosLosCamposValidos) {
            mensajeError("Por favor, corrige los errores en los campos marcados antes de continuar");

            const primerError = document.querySelector('.campo-invalido');
            if (primerError) {
                primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                primerError.focus();
            }
            return false;
        }
        return true;
    }

    // ======================================================
    //  CREAR DOMINIO
    // ======================================================
    static crearHuespedDominio(datos) {
        const direccion = GestorAltaHuesped.crearDireccionDominio(datos);

        return new Huesped(
            datos.nombre,
            datos.apellido,
            datos.tipoDocumento,
            datos.numeroDocumento,
            datos.cuit || null,
            datos.fechaNacimiento,
            datos.telefono,
            datos.email || null,
            datos.ocupacion,
            datos.nacionalidad,
            direccion
        );
    }

    // ✔ TOTALMENTE ALINEADO CON TU CLASE DIRECCION (get/set métodos)
    static crearDireccionDominio(datos) {
        const direccion = new Direccion(
            datos.calle,
            datos.numero,
            datos.piso,
            datos.departamento,
            datos.localidad,
            datos.provincia,
            datos.codigoPostal,
            datos.pais
        );
        return direccion;
    }

    // ======================================================
    //  CREAR DTO
    // ======================================================
    static crearHuespedDTO(huesped) {
        const direccionDTO = huesped.direccion
            ? GestorAltaHuesped.crearDireccionDTO(huesped.direccion)
            : null;

        return new HuespedDTO(
            huesped.getNombre(),
            huesped.getApellido(),
            huesped.getTelefono(),
            huesped.getTipoDocumento(),
            huesped.getNumeroDocumento(),
            huesped.getFechaNacimiento(),
            huesped.getOcupacion(),
            huesped.getNacionalidad(),
            huesped.getCuit(),
            huesped.getEmail(),
            direccionDTO
        );
    }

    // ✔ USAMOS getCalle(), getNumero(), getProvincia(), etc.
    static crearDireccionDTO(direccion) {
        return new DireccionDTO(
            direccion.getCalle(),
            direccion.getNumero(),
            direccion.getPiso(),
            direccion.getDepartamento(),
            direccion.getLocalidad(),
            direccion.getProvincia(),
            direccion.getCodigoPostal(),
            direccion.getPais()
        );
    }

    // ======================================================
    //  API
    // ======================================================
    static async enviarHuespedAAPI(jsonData) {
        console.log('JSON a enviar a la API:', jsonData);

        try {
            const res = await fetch("http://localhost:8080/api/huesped", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error en la respuesta del servidor:', errorText);
                return { error: errorText || 'Error al guardar el huésped en la base de datos' };
            }

            const data = await res.json();
            console.log('Huésped guardado exitosamente:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error al enviar huésped a la API:', error);
            return { error: "Error inesperado de conexión. Por favor, verifica que el servidor esté corriendo." };
        }
    }

    static async guardarEnBD(jsonData, operacion = 'alta') {
        try {
            if (operacion === 'alta') {
                const resultado = await GestorAltaHuesped.enviarHuespedAAPI(jsonData);

                if (resultado.error) {
                    throw new Error(resultado.error);
                }

                console.log('Huésped guardado exitosamente en la base de datos');
                return true;
            } else {
                console.warn('Operación de modificación no implementada para API');
                return false;
            }
        } catch (error) {
            console.error('Error al guardar en BD:', error);
            throw error;
        }
    }
}

window.GestorAltaHuesped = GestorAltaHuesped;
