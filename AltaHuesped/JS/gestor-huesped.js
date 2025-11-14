/* 
 * Gestor de Huéspedes - Maneja la lógica de negocio para dar de alta huéspedes
 * Usa clases de dominio y DTOs para trabajar con la base de datos
 */

import { GestorHuesped, Huesped, Direccion } from "../../Clases/Dominio/dominio.js";

/**
 * Clase que extiende GestorHuesped para manejar el alta de huéspedes desde el formulario
 */
class GestorAltaHuesped extends GestorHuesped {
    constructor() {
        super();
        this._rutaBD = '/Datos/huspedes.json';
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
            telefonoNumero: document.getElementById('telefonoNumero').value.trim(),
            email: document.getElementById('email').value.trim() || null,
            ocupacion: document.getElementById('ocupacion').value.trim(),
            nacionalidad: document.getElementById('nacionalidad').value.trim(),
            // Dirección
            calle: document.getElementById('calle').value.trim(),
            numeroCalle: document.getElementById('numeroCalle').value.trim(),
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
        // Nota: condicionIVA no está en el formulario, se establece como null
        // En un sistema real, esto podría determinarse automáticamente o pedirse al usuario
        const condicionIVA = null; // O se podría calcular basándose en el CUIT si existe

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
     * Muestra el JSON en pantalla en un contenedor especial
     * @param {Object} jsonData - Datos JSON a mostrar
     */
    mostrarJSONEnPantalla(jsonData) {
        // Crear o obtener el contenedor para mostrar el JSON
        let contenedorJSON = document.getElementById('contenedor-json');
        
        if (!contenedorJSON) {
            // Crear el contenedor si no existe
            contenedorJSON = document.createElement('div');
            contenedorJSON.id = 'contenedor-json';
            contenedorJSON.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border: 2px solid #333;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                max-width: 90%;
                max-height: 90%;
                overflow: auto;
                z-index: 10000;
                font-family: Arial, sans-serif;
            `;

            // Crear título
            const titulo = document.createElement('h2');
            titulo.textContent = '📋 Datos a enviar a la Base de Datos (JSON)';
            titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
            contenedorJSON.appendChild(titulo);

            // Crear área de texto con el JSON
            const textarea = document.createElement('textarea');
            textarea.id = 'json-display';
            textarea.readOnly = true;
            textarea.style.cssText = `
                width: 100%;
                min-height: 400px;
                padding: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-family: 'Courier New', monospace;
                font-size: 13px;
                resize: vertical;
                box-sizing: border-box;
                background: #f8f9fa;
                line-height: 1.5;
            `;
            contenedorJSON.appendChild(textarea);

            // Crear botón para cerrar
            const botonCerrar = document.createElement('button');
            botonCerrar.textContent = 'Cerrar';
            botonCerrar.style.cssText = `
                margin-top: 15px;
                padding: 10px 30px;
                background: #007bff;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: bold;
                transition: background 0.3s;
            `;
            botonCerrar.onclick = function() {
                contenedorJSON.style.display = 'none';
            };
            botonCerrar.onmouseover = function() {
                this.style.background = '#0056b3';
            };
            botonCerrar.onmouseout = function() {
                this.style.background = '#007bff';
            };
            contenedorJSON.appendChild(botonCerrar);

            // Agregar al body
            document.body.appendChild(contenedorJSON);
        }

        // Formatear el JSON con indentación
        const jsonFormateado = JSON.stringify(jsonData, null, 2);
        
        // Mostrar en el textarea
        const textarea = document.getElementById('json-display');
        if (textarea) {
            textarea.value = jsonFormateado;
            // Hacer scroll al inicio
            textarea.scrollTop = 0;
        }

        // Mostrar el contenedor
        contenedorJSON.style.display = 'block';

        // También mostrar en consola para debugging
        console.log('=== DATOS A ENVIAR A LA BASE DE DATOS ===');
        console.log('Objeto completo:', jsonData);
        console.log('JSON formateado:', jsonFormateado);
        console.log('==========================================');
    }

    /**
     * Procesa el alta de huésped: extrae datos, crea objetos de dominio y DTOs, y muestra el JSON
     * @returns {boolean} - true si el proceso fue exitoso, false en caso contrario
     */
    procesarAltaHuesped() {
        try {
            // 1. Extraer datos del formulario
            const datosFormulario = this.extraerDatosFormulario();
            console.log('Datos extraídos del formulario:', datosFormulario);

            // 2. Crear objetos de dominio
            const huespedDominio = this.crearHuespedDominio(datosFormulario);
            // La dirección ya está incluida en el huésped, no es necesario crearla por separado
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
            // La dirección ya está incluida en el HuespedDTO
            const direccionDTO = huespedDTO.direccion;
            
            console.log('HuespedDTO creado:', huespedDTO);
            console.log('DireccionDTO creado:', direccionDTO);

            // 5. Convertir a JSON para la base de datos
            const jsonParaBD = this.convertirDTOAJSON(huespedDTO, direccionDTO, datosFormulario);
            
            // 6. Mostrar el JSON en pantalla
            this.mostrarJSONEnPantalla(jsonParaBD);

            // 7. Dar de alta el huésped en el gestor (opcional, para mantener consistencia en memoria)
            this.darDeAlta(huespedDominio);

            return true;
        } catch (error) {
            console.error('Error al procesar el alta de huésped:', error);
            mensajeError('Error al procesar el alta de huésped: ' + error.message);
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

            // Agregar el nuevo huésped
            huespedesExistentes.push(jsonData);

            // En un sistema real, aquí se haría una petición PUT/POST al servidor
            // Por ahora, solo simulamos el guardado
            console.log('Simulando guardado en BD. Total de huéspedes:', huespedesExistentes.length);
            console.log('Nuevo huésped a guardar:', jsonData);

            // TODO: Implementar guardado real cuando se tenga acceso al servidor
        } catch (error) {
            console.error('Error al simular guardado en BD:', error);
            throw error;
        }
    }
}

// Crear una instancia global del gestor
const gestorAltaHuesped = new GestorAltaHuesped();

// Exportar para uso global
window.gestorAltaHuesped = gestorAltaHuesped;

