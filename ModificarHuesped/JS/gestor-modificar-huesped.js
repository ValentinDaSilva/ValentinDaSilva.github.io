

import { GestorHuesped, Huesped, Direccion } from "../../Clases/Dominio/dominio.js";


class GestorModificarHuesped extends GestorHuesped {
    constructor() {
        super();
        this._rutaBD = '/Datos/huspedes.json';
        this._huespedOriginal = null; 
    }

    
    establecerHuespedOriginal(huesped) {
        this._huespedOriginal = huesped;
    }

    
    obtenerHuespedOriginal() {
        return this._huespedOriginal;
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
            
            telefonoNumero: document.getElementById('celular')?.value.trim() || 
                          document.getElementById('telefonoNumero')?.value.trim() || '',
            email: document.getElementById('email').value.trim() || null,
            ocupacion: document.getElementById('ocupacion').value.trim(),
            nacionalidad: document.getElementById('nacionalidad').value.trim(),
            
            calle: document.getElementById('calle').value.trim(),
            numeroCalle: document.getElementById('numero').value.trim(),
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
        
        const condicionIVA = this._huespedOriginal?.condicionIVA || null;

        
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

    
    procesarModificacionHuesped() {
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
            
            
            mostrarJSONModificacionEnPantalla(jsonParaBD, this._huespedOriginal);

            
            
            

            return true;
        } catch (error) {
            console.error('Error al procesar la modificación de huésped:', error);
            mensajeError('Error al procesar la modificación de huésped: ' + error.message);
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

            
            const indice = huespedesExistentes.findIndex(h => 
                h.tipoDocumento === jsonData.tipoDocumento && 
                h.numeroDocumento === jsonData.numeroDocumento
            );

            if (indice !== -1) {
                huespedesExistentes[indice] = jsonData;
            } else {
                
                huespedesExistentes.push(jsonData);
            }

            
            
            console.log('Simulando guardado en BD. Total de huéspedes:', huespedesExistentes.length);
            console.log('Huésped modificado a guardar:', jsonData);

            
        } catch (error) {
            console.error('Error al simular guardado en BD:', error);
            throw error;
        }
    }
}


const gestorModificarHuesped = new GestorModificarHuesped();


window.gestorModificarHuesped = gestorModificarHuesped;



