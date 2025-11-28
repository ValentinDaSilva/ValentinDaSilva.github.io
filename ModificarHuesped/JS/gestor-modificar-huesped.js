

import { GestorHuesped, Huesped, Direccion } from "../../Clases/Dominio/dominio.js";
import { HuespedDTO, DireccionDTO } from "../../Clases/DTO/dto.js";


class GestorModificarHuesped extends GestorHuesped {
    constructor() {
        super();
        this._rutaBD = '/Datos/huespedes.json';
        this._huespedOriginal = null; 
    }

    
    establecerHuespedOriginal(huesped) {
        this._huespedOriginal = huesped;
    }

    
    obtenerHuespedOriginal() {
        return this._huespedOriginal;
    }

    
    static async enviarHuespedAAPIModificar(huesped) {

        try {
            const res = await fetch("http://localhost:8080/api/huespedes", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(huesped)
            });

            // Manejo de errores
            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error en la respuesta del servidor:', errorText);
                return { error: errorText || 'Error al modificar el huésped en la base de datos' };
            }

            // Éxito
            const data = await res.json();
            console.log('Huésped modificado exitosamente:', data);
            return { success: true, data };

        } catch (error) {
            console.error('Error al enviar huésped a la API:', error);
            return {
                error: "Error inesperado de conexión. Por favor, verifica que el servidor esté corriendo."
            };
        }
    }

    static async enviarHuespedAAPIEliminar(huesped) {
        try {
            const res = await fetch(`http://localhost:8080/api/huespedes/${huesped.getNumeroDocumento()}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error('Error al eliminar el huésped:', errorText);
                return { error: errorText || 'Error al eliminar el huésped en la base de datos' };
            }

            const data = await res.json();
            console.log('Huésped eliminado exitosamente:', data);
            return { success: true, data };
        } catch (error) {
            console.error('Error al intentar eliminar huésped en la API:', error);
            return {
                error: "Error inesperado de conexión. Por favor, verifica que el servidor esté corriendo."
            };
        }
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



