/* 
 * Gestor de Modificación de Huéspedes - Maneja la lógica de negocio para modificar huéspedes
 * Usa clases de dominio y DTOs para trabajar con la base de datos
 */

import { GestorHuesped, Huesped, Direccion } from "../../Clases/Dominio/dominio.js";

/**
 * Clase que extiende GestorHuesped para manejar la modificación de huéspedes desde el formulario
 */
class GestorModificarHuesped extends GestorHuesped {
    constructor() {
        super();
        this._rutaBD = '/Datos/huspedes.json';
        this._huespedOriginal = null; // Guardar el huésped original para comparar cambios
    }

    /**
     * Establece el huésped original que se está modificando
     * @param {Object} huesped - Datos del huésped original
     */
    establecerHuespedOriginal(huesped) {
        this._huespedOriginal = huesped;
    }

    /**
     * Obtiene el huésped original
     * @returns {Object|null} - Datos del huésped original
     */
    obtenerHuespedOriginal() {
        return this._huespedOriginal;
    }

    /**
     * Extrae los datos del formulario y los retorna como un objeto
     * @returns {Object} - Objeto con todos los datos del formulario
     */
    extraerDatosFormulario() {
        const formData = {
            apellido: document.getElementById('apellido').value.trim(),
            nombres: document.getElementById('nombres').value.trim(),
            tipoDocumento: document.getElementById('tipoDocumento').value.trim(),
            numeroDocumento: document.getElementById('numeroDocumento').value.trim(),
            cuit: document.getElementById('cuit').value.trim() || null,
            fechaNacimiento: document.getElementById('fechaNacimiento').value,
            caracteristica: document.getElementById('caracteristica').value.trim(),
            // Manejar tanto 'celular' como 'telefonoNumero' para compatibilidad
            telefonoNumero: document.getElementById('celular')?.value.trim() || 
                          document.getElementById('telefonoNumero')?.value.trim() || '',
            email: document.getElementById('email').value.trim() || null,
            ocupacion: document.getElementById('ocupacion').value.trim(),
            nacionalidad: document.getElementById('nacionalidad').value.trim(),
            // Dirección
            calle: document.getElementById('calle').value.trim(),
            numeroCalle: document.getElementById('numero').value.trim(),
            departamento: document.getElementById('departamento').value.trim() || null,
            piso: document.getElementById('piso').value.trim() || null,
            codigoPostal: document.getElementById('codigoPostal').value.trim(),
            localidad: document.getElementById('localidad').value.trim(),
            provincia: document.getElementById('provincia').value.trim(),
            pais: document.getElementById('pais').value.trim()
        };

        // Combinar característica y número de teléfono
        formData.telefono = `${formData.caracteristica}-${formData.telefonoNumero}`;

        return formData;
    }

    /**
     * Crea un objeto Huesped de dominio a partir de los datos del formulario
     * @param {Object} datos - Datos extraídos del formulario
     * @returns {Huesped} - Objeto Huesped de dominio
     */
    crearHuespedDominio(datos) {
        // Nota: condicionIVA no está en el formulario, se mantiene del original o se establece como null
        const condicionIVA = this._huespedOriginal?.condicionIVA || null;

        // Crear la dirección primero
        const direccion = this.crearDireccionDominio(datos);

        const huesped = new Huesped(
            datos.nombres,
            datos.apellido,
            datos.tipoDocumento,
            datos.numeroDocumento,
            datos.fechaNacimiento,
            datos.ocupacion,
            datos.nacionalidad,
            datos.cuit || '',
            datos.email || '',
            direccion,
            condicionIVA
        );

        // Establecer el teléfono (heredado de Persona)
        huesped.telefono = datos.telefono;

        return huesped;
    }

    /**
     * Crea un objeto Direccion de dominio a partir de los datos del formulario
     * @param {Object} datos - Datos extraídos del formulario
     * @returns {Direccion} - Objeto Direccion de dominio
     */
    crearDireccionDominio(datos) {
        const direccion = new Direccion(
            datos.calle,
            datos.numeroCalle,
            datos.piso || '',
            datos.departamento || '',
            datos.localidad,
            datos.provincia,
            datos.codigoPostal,
            datos.pais
        );

        return direccion;
    }

    /**
     * Crea un HuespedDTO a partir de un objeto Huesped de dominio
     * @param {Huesped} huesped - Objeto Huesped de dominio
     * @returns {HuespedDTO} - Objeto HuespedDTO
     */
    crearHuespedDTO(huesped) {
        // Convertir dirección a DTO si existe
        let direccionDTO = null;
        if (huesped.direccion) {
            direccionDTO = this.crearDireccionDTO(huesped.direccion);
        }

        const huespedDTO = new HuespedDTO(
            huesped.nombre,
            huesped.apellido,
            huesped.telefono,
            huesped.tipoDocumento,
            huesped.nroDocumento,
            huesped.fechaNacimiento.toISOString().split('T')[0], // Formato YYYY-MM-DD
            huesped.ocupacion,
            huesped.nacionalidad,
            huesped.cuit,
            huesped.email,
            direccionDTO,
            huesped.condicionIVA
        );

        return huespedDTO;
    }

    /**
     * Crea un DireccionDTO a partir de un objeto Direccion de dominio
     * @param {Direccion} direccion - Objeto Direccion de dominio
     * @returns {DireccionDTO} - Objeto DireccionDTO
     */
    crearDireccionDTO(direccion) {
        const direccionDTO = new DireccionDTO(
            direccion.calle,
            direccion.numero,
            direccion.piso || '',
            direccion.departamento || '',
            direccion.localidad,
            direccion.provincia,
            direccion.codigoPostal,
            direccion.pais
        );

        return direccionDTO;
    }

    /**
     * Convierte un HuespedDTO a un objeto JSON plano para la base de datos
     * @param {HuespedDTO} huespedDTO - Objeto HuespedDTO
     * @param {DireccionDTO} direccionDTO - Objeto DireccionDTO
     * @param {Object} datosOriginales - Datos originales del formulario (para campos adicionales como país)
     * @returns {Object} - Objeto JSON plano listo para guardar en BD
     */
    convertirDTOAJSON(huespedDTO, direccionDTO, datosOriginales) {
        const jsonData = {
            // Datos del huésped
            apellido: huespedDTO.apellido,
            nombres: huespedDTO.nombre,
            tipoDocumento: huespedDTO.tipoDocumento,
            numeroDocumento: huespedDTO.nroDocumento,
            cuit: huespedDTO.cuit || '',
            fechaNacimiento: huespedDTO.fechaNacimiento,
            caracteristica: datosOriginales.caracteristica,
            telefonoNumero: datosOriginales.telefonoNumero,
            email: huespedDTO.email || '',
            ocupacion: huespedDTO.ocupacion,
            nacionalidad: huespedDTO.nacionalidad,
            // Datos de dirección
            calle: direccionDTO.calle,
            numeroCalle: direccionDTO.numero,
            departamento: direccionDTO.departamento || '',
            piso: direccionDTO.piso || '',
            codigoPostal: direccionDTO.codigoPostal,
            localidad: direccionDTO.localidad,
            provincia: direccionDTO.provincia,
            pais: datosOriginales.pais // El país no está en DireccionDTO, se agrega desde los datos originales
        };

        return jsonData;
    }

    /**
     * Procesa la modificación de huésped: extrae datos, crea objetos de dominio y DTOs, y muestra el JSON
     * @returns {boolean} - true si el proceso fue exitoso, false en caso contrario
     */
    procesarModificacionHuesped() {
        try {
            // 1. Extraer datos del formulario
            const datosFormulario = this.extraerDatosFormulario();
            console.log('Datos extraídos del formulario:', datosFormulario);

            // 2. Crear objetos de dominio
            const huespedDominio = this.crearHuespedDominio(datosFormulario);
            const direccionDominio = huespedDominio.direccion;
            
            console.log('Huesped de dominio creado:', huespedDominio);
            console.log('Direccion de dominio creada:', direccionDominio);

            // 3. Validar que el huésped sea mayor de edad (regla de negocio)
            if (!huespedDominio.verificarMayorEdad()) {
                mensajeError('El huésped debe ser mayor de edad');
                return false;
            }

            // 4. Crear DTOs
            const huespedDTO = this.crearHuespedDTO(huespedDominio);
            const direccionDTO = huespedDTO.direccion;
            
            console.log('HuespedDTO creado:', huespedDTO);
            console.log('DireccionDTO creado:', direccionDTO);

            // 5. Convertir a JSON para la base de datos
            const jsonParaBD = this.convertirDTOAJSON(huespedDTO, direccionDTO, datosFormulario);
            
            // 6. Mostrar el JSON en pantalla
            mostrarJSONModificacionEnPantalla(jsonParaBD, this._huespedOriginal);

            // 7. Actualizar el huésped en el gestor (opcional, para mantener consistencia en memoria)
            // En un sistema real, esto actualizaría la base de datos
            // this.modificarHuesped(huespedDominio);

            return true;
        } catch (error) {
            console.error('Error al procesar la modificación de huésped:', error);
            mensajeError('Error al procesar la modificación de huésped: ' + error.message);
            return false;
        }
    }

    /**
     * Simula el guardado en la base de datos (JSON)
     * En un sistema real, esto haría una petición HTTP al servidor
     * @param {Object} jsonData - Datos JSON a guardar
     * @returns {Promise<void>}
     */
    async simularGuardadoEnBD(jsonData) {
        try {
            // Leer huéspedes existentes
            const respuesta = await fetch(this._rutaBD);
            let huespedesExistentes = [];
            
            if (respuesta.ok) {
                huespedesExistentes = await respuesta.json();
            }

            // Buscar y actualizar el huésped existente
            const indice = huespedesExistentes.findIndex(h => 
                h.tipoDocumento === jsonData.tipoDocumento && 
                h.numeroDocumento === jsonData.numeroDocumento
            );

            if (indice !== -1) {
                huespedesExistentes[indice] = jsonData;
            } else {
                // Si no se encuentra, agregar como nuevo (no debería pasar en modificación)
                huespedesExistentes.push(jsonData);
            }

            // En un sistema real, aquí se haría una petición PUT al servidor
            // Por ahora, solo simulamos el guardado
            console.log('Simulando guardado en BD. Total de huéspedes:', huespedesExistentes.length);
            console.log('Huésped modificado a guardar:', jsonData);

            // TODO: Implementar guardado real cuando se tenga acceso al servidor
        } catch (error) {
            console.error('Error al simular guardado en BD:', error);
            throw error;
        }
    }
}

// Crear una instancia global del gestor
const gestorModificarHuesped = new GestorModificarHuesped();

// Exportar para uso global
window.gestorModificarHuesped = gestorModificarHuesped;



