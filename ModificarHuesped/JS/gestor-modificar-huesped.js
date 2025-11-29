import { Huesped } from '/Clases/Dominio/huesped.js';
import { Direccion } from '/Clases/Dominio/direccion.js';
import { HuespedDTO, DireccionDTO } from '/Clases/DTO/dto.js';

export class GestorModificarHuesped  {
    constructor() {
    }

    
    establecerHuespedOriginal(huesped) {
        this._huespedOriginal = huesped;
    }

    
    obtenerHuespedOriginal() {
        return this._huespedOriginal;
    }

    static extraerDatosFormulario() {
            const formData = {
                apellido: document.getElementById('apellido').value.trim(),
                nombre: document.getElementById('nombre').value.trim(),
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
    
        static validarTodosLosCampos(datos) {
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

    static async enviarHuespedAAPIModificar(jsonData) {
        console.log('JSON a enviar a la API (modificar):', jsonData);

        try {
            // Intento normal de modificación
            let res = await fetch("http://localhost:8080/api/huespedes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(jsonData)
            });

            // Caso → Documento duplicado / conflicto (409)
            if (res.status === 409) {
                return new Promise((resolve) => {
                    advertencia(
                        "¡CUIDADO! Ya existe un huésped con ese numero de documento.\n¿Deseás modificarlo igual?",
                        "ACEPTAR ✅",
                        "CORREGIR ✏️",

                        // ACEPTAR -> reintentar con forzar = true
                        async function () {
                            const jsonForzado = { ...jsonData, forzar: true };
                            console.log("Reintentando modificación con forzar = true:", jsonForzado);

                            try {
                                const res2 = await fetch("http://localhost:8080/api/huespedes", {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(jsonForzado)
                                });

                                if (!res2.ok) {
                                    const err = await res2.text();
                                    console.error("Error al forzar modificación:", err);
                                    resolve({ error: err || 'Error al modificar el huésped en la base de datos' });
                                    return;
                                }

                                const data = await res2.json();
                                resolve({ success: true, data });
                            } catch (err) {
                                console.error("Error al reintentar modificación forzada:", err);
                                resolve({
                                    error: "Error inesperado de conexión. Por favor, verifica que el servidor esté corriendo."
                                });
                            }
                        },

                        // CORREGIR -> devolver cancelado y enfocar campo
                        function () {
                            const campo = document.getElementById('numeroDocumento');
                            if (campo) campo.focus();
                            resolve({ cancelado: true });
                        }
                    );
                });
            } else if (!res.ok) {
                // Otro error del servidor
                const errorText = await res.text();
                console.error('Error en la respuesta del servidor al modificar:', errorText);
                return { error: errorText || 'Error al modificar el huésped en la base de datos' };
            } else {
                // Éxito
                const data = await res.json();
                console.log('Huésped modificado exitosamente:', data);

                const nombre = document.getElementById("nombre")?.value?.trim() || '';
                const apellido = document.getElementById("apellido")?.value?.trim() || '';

                mensajeExito(`La operación ha culminado con éxito`);

                return { success: true, data };
            }
        } catch (error) {
            console.error('Error al enviar huésped a la API (modificar):', error);
            return {
                error: "Error inesperado de conexión. Por favor, verifica que el servidor esté corriendo."
            };
        }
    }

    static async enviarHuespedAAPIEliminar(jsonData) {
        console.log('JSON para eliminar en la API:', jsonData);

        const numeroDocumento = jsonData?.numeroDocumento || jsonData?.numero || document.getElementById('numeroDocumento')?.value?.trim();
        

        // Pedimos confirmación al usuario antes de intentar eliminar
        return new Promise((resolve) => {
            const nombre = jsonData?.nombre || document.getElementById('nombre')?.value?.trim() || '';
            const apellido = jsonData?.apellido || document.getElementById('apellido')?.value?.trim() || '';
            const tipoDocumento = jsonData?.tipoDocumento || document.getElementById('tipoDocumento')?.value?.trim() || '';


            pregunta(
                `Los datos del\nhuésped ${nombre} ${apellido},\n${tipoDocumento} ${numeroDocumento}\nserán eliminados del sistema.`,
                "ELIMINAR ✅",
                "CANCELAR ❌",

                // ACEPTAR -> realizar DELETE
                async function () {
                    try {
                        let res = await fetch(`http://localhost:8080/api/huespedes/${encodeURIComponent(numeroDocumento)}`, {
                            method: "DELETE"
                        });

                        // Si el servidor devuelve conflicto (p. ej. 409 por referencias), preguntamos si quiere forzar
                        if (res.status === 409) {
                            const errorText = await res.text();
                            mensajeError("El huésped no puede ser eliminado pues se ha alojado en el Hotel en alguna oportunidad. PRESIONE CUALQUIER TECLA PARA CONTINUAR…");
                            return;
                        }else if (!res.ok) {
                            const errorText = await res.text();
                            console.error('Error en la respuesta del servidor al eliminar:', errorText);
                            resolve({ error: errorText || 'Error al eliminar el huésped en la base de datos' });
                            return;
                        }else {
                            mensajeExito("Los datos del\nhuésped ${nombre} ${apellido},\n${tipoDocumento} ${numeroDocumento}\nsfueron eliminados del sistema, PRESIONE CUALQUIER TECLA PARA CONTINUAR");
                        }

                        resolve({ success: true, data });
                    } catch (error) {
                        console.error('Error al intentar eliminar huésped en la API:', error);
                        resolve({
                            error: "Error inesperado de conexión. Por favor, verifica que el servidor esté corriendo."
                        });
                    }
                },

                // NO -> cancelar eliminación
                function () {
                    resolve({ cancelado: true });
                }
            );
        });
    }

    static async guardarEnBD(jsonData, operacion = 'modificacion') {
        try {
            let resultado;
            if (operacion === 'modificacion') {
                resultado = await GestorModificarHuesped.enviarHuespedAAPIModificar(jsonData);
            } else if (operacion === 'eliminar') {
                resultado = await GestorModificarHuesped.enviarHuespedAAPIEliminar(jsonData);
            } else {
                console.warn('Operación no implementada para API');
                return false;
            }

            if (resultado.error) {
                throw new Error(resultado.error);
            }

            return true;
        } catch (error) {
            console.error('Error al guardar en BD:', error);
            throw error;
        }
    }
}

window.GestorModificarHuesped = GestorModificarHuesped;



