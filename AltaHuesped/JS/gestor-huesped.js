

import { GestorHuesped, Huesped, Direccion } from "../../Clases/Dominio/dominio.js";


class GestorAltaHuesped extends GestorHuesped {
    constructor() {
        super();
    }

    
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
            
            calle: document.getElementById('calle').value.trim(),
            numeroCalle: document.getElementById('numeroCalle').value.trim(),
            departamento: document.getElementById('departamento').value.trim() || null,
            piso: document.getElementById('piso').value.trim() || null,
            codigoPostal: document.getElementById('codigoPostal').value.trim(),
            localidad: document.getElementById('localidad').value.trim(),
            provincia: document.getElementById('provincia').value.trim(),
            pais: document.getElementById('pais').value.trim()
        };

        
        formData.telefono = `${formData.caracteristica}-${formData.telefonoNumero}`;

        return formData;
    }

    
    crearHuespedDominio(datos) {
        
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
            null
        );

        
        huesped.telefono = datos.telefono;

        return huesped;
    }

    
    crearDireccionDominio(datos) {
        const direccion = new Direccion(
            datos.calle,
            datos.numeroCalle,
            datos.piso || '',
            datos.departamento || '',
            datos.localidad || datos.ciudad,
            datos.provincia,
            datos.codigoPostal,
            datos.pais
        );

        return direccion;
    }

    
    crearHuespedDTO(huesped) {
        
        let direccionDTO = null;
        if (huesped.direccion) {
            direccionDTO = this.crearDireccionDTO(huesped.direccion);
        }

        const huespedDTO = new HuespedDTO(
            huesped.nombre,
            huesped.apellido,
            huesped.telefono,
            huesped.tipoDocumento,
            huesped.numeroDocumento || huesped.nroDocumento,
            huesped.fechaNacimiento.toISOString().split('T')[0], 
            huesped.ocupacion,
            huesped.nacionalidad,
            huesped.cuit,
            huesped.email,
            direccionDTO,
            null
        );

        return huespedDTO;
    }

    
    crearDireccionDTO(direccion) {
        const direccionDTO = new DireccionDTO(
            direccion.calle,
            direccion.numero,
            direccion.piso || '',
            direccion.departamento || '',
            direccion.ciudad || direccion.localidad,
            direccion.provincia,
            direccion.codigoPostal,
            direccion.pais
        );

        return direccionDTO;
    }

    
    convertirDTOAJSON(huespedDTO, direccionDTO, datosOriginales) {
        // Construir dirección siempre desde datosOriginales (datos del formulario)
        // ya que es la fuente más confiable y directa
        let direccion = null;
        
        if (datosOriginales) {
            direccion = {
                calle: String(datosOriginales.calle || ''),
                numero: String(datosOriginales.numeroCalle || ''),
                piso: String(datosOriginales.piso || ''),
                departamento: String(datosOriginales.departamento || ''),
                ciudad: String(datosOriginales.localidad || ''),
                provincia: String(datosOriginales.provincia || ''),
                codigoPostal: String(datosOriginales.codigoPostal || ''),
                pais: String(datosOriginales.pais || '')
            };
        } else if (direccionDTO) {
            // Fallback: usar direccionDTO si datosOriginales no está disponible
            direccion = {
                calle: String(direccionDTO.calle || ''),
                numero: String(direccionDTO.numero || ''),
                piso: String(direccionDTO.piso || ''),
                departamento: String(direccionDTO.departamento || ''),
                ciudad: String(direccionDTO.ciudad || direccionDTO.localidad || ''),
                provincia: String(direccionDTO.provincia || ''),
                codigoPostal: String(direccionDTO.codigoPostal || ''),
                pais: String(direccionDTO.pais || '')
            };
        }

        // Validar y extraer valores primitivos de huespedDTO usando getters
        const nombre = huespedDTO?.nombre;
        const apellido = huespedDTO?.apellido;
        const tipoDocumento = huespedDTO?.tipoDocumento;
        const nroDocumento = huespedDTO?.numeroDocumento || huespedDTO?.nroDocumento;
        const ocupacion = huespedDTO?.ocupacion;
        const nacionalidad = huespedDTO?.nacionalidad;
        const cuit = huespedDTO?.cuit;
        const email = huespedDTO?.email;
        const fechaNacimiento = huespedDTO?.fechaNacimiento;

        // Función auxiliar para convertir a valor primitivo
        const toPrimitive = (value) => {
            if (value === null || value === undefined) return null;
            if (typeof value === 'object') {
                // Si es un objeto, intentar convertirlo a string o retornar null
                console.warn('Valor no primitivo detectado:', value);
                return null;
            }
            return String(value);
        };

        // Función auxiliar para manejar campos opcionales (null si está vacío)
        const toOptional = (value) => {
            const primitive = toPrimitive(value);
            return primitive && primitive.trim() !== '' ? primitive : null;
        };

        // Limpiar dirección: convertir strings vacíos a null para campos opcionales
        if (direccion) {
            direccion.piso = direccion.piso && direccion.piso.trim() !== '' ? direccion.piso : null;
            direccion.departamento = direccion.departamento && direccion.departamento.trim() !== '' ? direccion.departamento : null;
            // Asegurar que se use 'ciudad' en lugar de 'localidad'
            if (direccion.localidad && !direccion.ciudad) {
                direccion.ciudad = direccion.localidad;
                delete direccion.localidad;
            }
        }

        // Construir objeto JSON según la estructura requerida por la API
        const jsonData = {
            nombre: toPrimitive(nombre) || '',
            apellido: toPrimitive(apellido) || '',
            tipoDocumento: toPrimitive(tipoDocumento) || '',
            numeroDocumento: toPrimitive(nroDocumento) || '',
            cuit: toOptional(cuit),
            email: toOptional(email),
            ocupacion: toPrimitive(ocupacion) || '',
            nacionalidad: toPrimitive(nacionalidad) || '',
            fechaNacimiento: toPrimitive(fechaNacimiento) || '',
            direccion: direccion
        };

        return jsonData;
    }


    
    async procesarAltaHuesped() {
        try {
            
            const datosFormulario = this.extraerDatosFormulario();
            console.log('Datos extraídos del formulario:', datosFormulario);

            
            const huespedDominio = this.crearHuespedDominio(datosFormulario);
            
            const direccionDominio = huespedDominio.direccion;
            
            console.log('Huesped de dominio creado:', huespedDominio);
            console.log('Direccion de dominio creada:', direccionDominio);

            
            if (!huespedDominio.verificarMayorEdad()) {
                mensajeError('El huésped debe ser mayor de edad');
                return false;
            }

            
            const huespedDTO = this.crearHuespedDTO(huespedDominio);
            
            const direccionDTO = huespedDTO.direccion;
            
            console.log('HuespedDTO creado:', huespedDTO);
            console.log('DireccionDTO creado:', direccionDTO);

            
            const jsonParaBD = this.convertirDTOAJSON(huespedDTO, direccionDTO, datosFormulario);
            
            
            await this.guardarEnBD(jsonParaBD, 'alta');

            
            this.darDeAlta(huespedDominio);

            return true;
        } catch (error) {
            console.error('Error al procesar el alta de huésped:', error);
            mensajeError('Error al procesar el alta de huésped: ' + error.message);
            return false;
        }
    }

    
    async enviarHuespedAAPI(jsonData) {
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

    
    async guardarEnBD(jsonData, operacion = 'alta') {
        try {
            if (operacion === 'alta') {
                const resultado = await this.enviarHuespedAAPI(jsonData);
                
                if (resultado.error) {
                    throw new Error(resultado.error);
                }
                
                console.log('Huésped guardado exitosamente en la base de datos');
                return true;
            } else {
                // Para modificaciones, mantener el comportamiento original si es necesario
                // o implementar un endpoint PUT/PATCH
                console.warn('Operación de modificación no implementada para API');
                return false;
            }
        } catch (error) {
            console.error('Error al guardar en BD:', error);
            throw error;
        }
    }

}


export { GestorAltaHuesped };

const gestorAltaHuesped = new GestorAltaHuesped();


window.gestorAltaHuesped = gestorAltaHuesped;

