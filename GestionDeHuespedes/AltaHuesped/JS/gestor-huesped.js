// AltaHuesped/JS/gestor-huesped.js
import { GestorHuesped }  from "/GestionDeHuespedes/GestorHuesped.js";

class UIAltaHuesped {
    static {
        document.addEventListener("DOMContentLoaded", () => {
            const form = document.getElementById("altaHuesped");
            if (!form) return;
            form.addEventListener("submit", async e => {
                e.preventDefault();
                if (hayModalAbierto()) return;
                await GestorHuesped.darAltaHuesped(UIAltaHuesped);
            });
        });
    }

    // ==========================
    //  MÉTODOS DE LA UI
    // ==========================
    static extraerDatosDeUI() {
        const datos = {
            apellido: document.getElementById("apellido").value.trim(),
            nombre: document.getElementById("nombre").value.trim(),
            tipoDocumento: document.getElementById("tipoDocumento").value.trim(),
            numeroDocumento: document.getElementById("numeroDocumento").value.trim(),
            cuit: document.getElementById("cuit").value.trim(),
            fechaNacimiento: document.getElementById("fechaNacimiento").value,
            caracteristica: document.getElementById("caracteristica").value.trim(),
            telefonoNumero: document.getElementById("telefonoNumero").value.trim(),
            email: document.getElementById("email").value.trim(),
            ocupacion: document.getElementById("ocupacion").value.trim(),
            nacionalidad: document.getElementById("nacionalidad").value.trim(),
            calle: document.getElementById("calle").value.trim(),
            numero: document.getElementById("numeroCalle").value.trim(),
            departamento: document.getElementById("departamento").value.trim(),
            piso: document.getElementById("piso").value.trim(),
            codigoPostal: document.getElementById("codigoPostal").value.trim(),
            localidad: document.getElementById("localidad").value.trim(),
            provincia: document.getElementById("provincia").value.trim(),
            pais: document.getElementById("pais").value.trim()
        };

        datos.telefono = `${datos.caracteristica}-${datos.telefonoNumero}`;
        return datos;
    }
    
    static mostrarErrores(errores) {
        const modal = document.getElementById("modalError");
        const mensaje = document.getElementById("mensaje-error");

        mensaje.textContent = Array.isArray(errores)
            ? errores.join("\n")
            : errores;

        modal.style.display = "flex";

        document.getElementById("boton-error-ok").onclick = () => {
            modal.style.display = "none";
        };
    }

    static enfocarCampoDocumento() {
        const campo = document.getElementById("numeroDocumento");
        campo.focus();
        campo.select();
    }

    static reiniciarCampos() {
        document.getElementById("altaHuesped").reset();
    }

    static volverPantallaAnterior() {
        window.location.href = "/index.html";
    }

    static preguntarDocumentoExistente() {
        return new Promise(resolve => {
            advertencia(
                "¡CUIDADO! Ya existe un huésped con ese documento.",
                "ACEPTAR IGUALMENTE",
                "CORREGIR",
                () => resolve("aceptar"),
                () => resolve("corregir")
            );
        });
    }

    static mostrarAltaExitosa(huesped) {
        return new Promise(resolve => {
            pregunta(
                `El huésped ${huesped.getNombre()} ${huesped.getApellido()} ha sido cargado.\n¿Desea cargar otro?`,
                "SI",
                "NO",
                () => resolve(true),
                () => resolve(false)
            );
        });
    }
}

export { UIAltaHuesped };
