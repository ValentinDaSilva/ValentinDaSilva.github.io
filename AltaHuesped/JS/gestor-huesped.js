

import { GestorHuesped, Huesped, Direccion } from "../../Clases/Dominio/dominio.js";


class GestorAltaHuesped extends GestorHuesped {
    constructor() {
        super();
        this._rutaBD = '/Datos/huespedes.json';
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

    
    mostrarJSONEnPantalla(jsonData) {
        
        let fondoJSON = document.getElementById('fondo-json');
        if (!fondoJSON) {
            fondoJSON = document.createElement('div');
            fondoJSON.id = 'fondo-json';
            fondoJSON.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.45);
                backdrop-filter: blur(1px);
                z-index: 9999;
                display: none;
            `;
            document.body.appendChild(fondoJSON);
        }

        let contenedorJSON = document.getElementById('contenedor-json');
        let botonCerrar = null;
        
        if (!contenedorJSON) {
            
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

            
            const titulo = document.createElement('h2');
            titulo.textContent = 'Datos a enviar al servidor backend';
            titulo.style.cssText = 'margin-top: 0; margin-bottom: 15px; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;';
            contenedorJSON.appendChild(titulo);

            
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

            
            botonCerrar = document.createElement('button');
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
            contenedorJSON.appendChild(botonCerrar);

            
            document.body.appendChild(contenedorJSON);
        } else {
            botonCerrar = contenedorJSON.querySelector('button');
        }

        const cerrarModalJSON = () => {
            contenedorJSON.style.display = 'none';
            if (fondoJSON) {
                fondoJSON.style.display = 'none';
            }
        };

        if (botonCerrar) {
            botonCerrar.onclick = cerrarModalJSON;
            botonCerrar.onmouseover = function() {
                this.style.background = '#0056b3';
            };
            botonCerrar.onmouseout = function() {
                this.style.background = '#007bff';
            };
        }
        if (fondoJSON) {
            fondoJSON.onclick = cerrarModalJSON;
        }

        
        const jsonFormateado = JSON.stringify(jsonData, null, 2);
        
        
        const textarea = document.getElementById('json-display');
        if (textarea) {
            textarea.value = jsonFormateado;
            
            textarea.scrollTop = 0;
        }

        
        contenedorJSON.style.display = 'block';
        if (fondoJSON) {
            fondoJSON.style.display = 'block';
        }

        
        console.log('=== DATOS A ENVIAR A LA BASE DE DATOS ===');
        console.log('Objeto completo:', jsonData);
        console.log('JSON formateado:', jsonFormateado);
        console.log('==========================================');
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
            
            
            this.mostrarJSONEnPantalla(jsonParaBD);

            
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

    
    async simularGuardadoEnBD(jsonData) {
        try {
            
            const respuesta = await fetch(this._rutaBD);
            let huespedesExistentes = [];
            
            if (respuesta.ok) {
                huespedesExistentes = await respuesta.json();
            }

            
            huespedesExistentes.push(jsonData);

            
            
            console.log('Simulando guardado en BD. Total de huéspedes:', huespedesExistentes.length);
            console.log('Nuevo huésped a guardar:', jsonData);

            
        } catch (error) {
            console.error('Error al simular guardado en BD:', error);
            throw error;
        }
    }
}


export { GestorAltaHuesped };

const gestorAltaHuesped = new GestorAltaHuesped();


window.gestorAltaHuesped = gestorAltaHuesped;

