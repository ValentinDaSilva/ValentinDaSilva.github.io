

import { GestorHuesped, Huesped, Direccion } from "../../Clases/Dominio/dominio.js";


class GestorAltaHuesped extends GestorHuesped {
    constructor() {
        super();
        this._rutaBD = '/Datos/huspedes.json';
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
        
        
        const condicionIVA = null; 

        
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

        
        huesped.telefono = datos.telefono;

        return huesped;
    }

    
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
            huesped.nroDocumento,
            huesped.fechaNacimiento.toISOString().split('T')[0], 
            huesped.ocupacion,
            huesped.nacionalidad,
            huesped.cuit,
            huesped.email,
            direccionDTO,
            huesped.condicionIVA
        );

        return huespedDTO;
    }

    
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

    
    convertirDTOAJSON(huespedDTO, direccionDTO, datosOriginales) {
        const jsonData = {
            
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
            
            calle: direccionDTO.calle,
            numeroCalle: direccionDTO.numero,
            departamento: direccionDTO.departamento || '',
            piso: direccionDTO.piso || '',
            codigoPostal: direccionDTO.codigoPostal,
            localidad: direccionDTO.localidad,
            provincia: direccionDTO.provincia,
            pais: datosOriginales.pais 
        };

        return jsonData;
    }

    
    mostrarJSONEnPantalla(jsonData) {
        
        let contenedorJSON = document.getElementById('contenedor-json');
        
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

            
            document.body.appendChild(contenedorJSON);
        }

        
        const jsonFormateado = JSON.stringify(jsonData, null, 2);
        
        
        const textarea = document.getElementById('json-display');
        if (textarea) {
            textarea.value = jsonFormateado;
            
            textarea.scrollTop = 0;
        }

        
        contenedorJSON.style.display = 'block';

        
        console.log('=== DATOS A ENVIAR A LA BASE DE DATOS ===');
        console.log('Objeto completo:', jsonData);
        console.log('JSON formateado:', jsonFormateado);
        console.log('==========================================');
    }

    
    procesarAltaHuesped() {
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

            
            this.darDeAlta(huespedDominio);

            return true;
        } catch (error) {
            console.error('Error al procesar el alta de huésped:', error);
            mensajeError('Error al procesar el alta de huésped: ' + error.message);
            return false;
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


const gestorAltaHuesped = new GestorAltaHuesped();


window.gestorAltaHuesped = gestorAltaHuesped;

