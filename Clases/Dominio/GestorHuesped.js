// /Clases/Dominio/GestorHuesped.js
import { Direccion } from "./Direccion.js";
import { Huesped } from "./Huesped.js";
import { HuespedDTO, DireccionDTO } from "../DTO/dto.js";

class HuespedDAO {
    // ==========================
    // ALTA HUÉSPED
    // ==========================
    static async crearHuesped(dto, forzar = false) {
        const payload = { ...dto };
        if (forzar) payload.forzar = true;

        try {
            const res = await fetch("http://localhost:8080/api/huespedes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const contentType = res.headers.get("Content-Type") || "";
            let body;

            if (contentType.includes("application/json")) {
                body = await res.json();
            } else {
                body = await res.text();
            }

            return { ok: res.ok, status: res.status, body };
        } catch (e) {
            return {
                ok: false,
                status: 0,
                body: "Error de conexión con el backend. Asegurate de que está corriendo."
            };
        }
    }

    // ==========================
    // BUSCAR HUÉSPED FILTRADO
    // ==========================
    static async buscarHuespedFiltrado(criterios) {
        const params = new URLSearchParams({
            apellido: criterios.apellido || "",
            nombre: criterios.nombre || "",
            tipoDocumento: criterios.tipoDocumento || "",
            numeroDocumento: criterios.numeroDocumento || ""
        });

        const url = `http://localhost:8080/api/huespedes/buscar?${params.toString()}`;
        console.log("[HuespedDAO] URL búsqueda:", url);

        try {
            const res = await fetch(url);
            const contentType = res.headers.get("Content-Type") || "";
            let body;

            if (contentType.includes("application/json")) {
                body = await res.json();
            } else {
                body = await res.text();
            }

            return { ok: res.ok, status: res.status, body };
        } catch (e) {
            return {
                ok: false,
                status: 0,
                body: "Error de conexión al buscar huéspedes. Verificá el backend."
            };
        }
    }
}

class GestorHuesped {
    // ==========================================================
    // CU09 – DAR ALTA HUÉSPED (ya lo tenías)
    // ==========================================================
    static async darAltaHuesped(UI) {
        let datos;
        let validacion;

        do {
            datos = UI.extraerDatosDeUI();
            validacion = GestorHuesped.validarDatos(datos);

            if (!validacion.esValido) {
                UI.mostrarErrores(validacion.errores);
            }
        } while (!validacion.esValido);

        const huesped = GestorHuesped.crearHuesped(datos);
        const dto = GestorHuesped.crearHuespedDTO(huesped);

        let resp = await HuespedDAO.crearHuesped(dto, false);

        if (resp.status === 409) {
            const opcion = await UI.preguntarDocumentoExistente();

            if (opcion === "corregir") {
                UI.enfocarCampoDocumento();
                return;
            }

            if (opcion === "aceptar") {
                resp = await HuespedDAO.crearHuesped(dto, true);
            }
        }

        if (!resp.ok) {
            UI.mostrarErrores([resp.body || "Error al guardar el huésped."]);
            return;
        }

        const quiereOtro = await UI.mostrarAltaExitosa(huesped);

        if (quiereOtro) {
            UI.reiniciarCampos();
        } else {
            UI.volverPantallaAnterior();
        }
    }

    // ==========================================================
    // VALIDACIÓN (Alta)
    // ==========================================================
    static validarDatos(d) {
        const err = [];

        if (!d.apellido) err.push("El apellido es obligatorio.");
        if (!d.nombre) err.push("El nombre es obligatorio.");
        if (!d.tipoDocumento) err.push("Debe seleccionar un tipo de documento.");
        if (!d.numeroDocumento) err.push("Debe ingresar el número de documento.");
        if (!d.fechaNacimiento) err.push("Debe ingresar fecha de nacimiento.");
        if (!d.ocupacion) err.push("La ocupación es obligatoria.");
        if (!d.nacionalidad) err.push("Debe seleccionar nacionalidad.");

        if (!d.calle) err.push("Debe ingresar la calle.");
        if (!d.numero) err.push("Debe ingresar el número de calle.");
        if (!d.codigoPostal) err.push("Debe ingresar código postal.");
        if (!d.localidad) err.push("Debe ingresar localidad.");
        if (!d.provincia) err.push("Debe ingresar provincia.");
        if (!d.pais) err.push("Debe seleccionar país.");

        return { esValido: err.length === 0, errores: err };
    }

    // ==========================================================
    // CREAR DOMINIO / DTO (Alta)
    // ==========================================================
    static crearHuesped(d) {
        const direccion = new Direccion(
            d.calle,
            parseInt(d.numero),
            d.piso ? parseInt(d.piso) : null,
            d.departamento,
            d.localidad,
            d.provincia,
            d.codigoPostal,
            d.pais
        );

        return new Huesped(
            d.nombre,
            d.apellido,
            d.tipoDocumento,
            d.numeroDocumento,
            d.cuit || null,
            d.fechaNacimiento,
            d.telefono,
            d.email || null,
            d.ocupacion,
            d.nacionalidad,
            direccion
        );
    }

    static crearHuespedDTO(h) {
        const direccionDTO = new DireccionDTO(
            h.direccion.getCalle(),
            h.direccion.getNumero(),
            h.direccion.getPiso(),
            h.direccion.getDepartamento(),
            h.direccion.getLocalidad(),
            h.direccion.getProvincia(),
            h.direccion.getCodigoPostal(),
            h.direccion.getPais()
        );

        return new HuespedDTO(
            h.getNombre(),
            h.getApellido(),
            h.getTelefono(),
            h.getTipoDocumento(),
            h.getNumeroDocumento(),
            h.getFechaNacimiento(),
            h.getOcupacion(),
            h.getNacionalidad(),
            h.getCuit(),
            h.getEmail(),
            direccionDTO
        );
    }

    // ==========================================================
    // CUxx – BUSCAR HUÉSPED (diagrama que pasaste)
    // ==========================================================
    static async buscarHuesped(criterios, UI) {
        const resp = await HuespedDAO.buscarHuespedFiltrado(criterios);

        if (!resp.ok) {
            const msg =
                typeof resp.body === "string"
                    ? resp.body
                    : "Error al buscar huéspedes.";
            UI.mostrarErrorBusqueda(msg);
            return;
        }

        const body = resp.body;
        const lista = Array.isArray(body)
            ? body
            : Array.isArray(body?.huespedes)
                ? body.huespedes
                : [];

        console.log("[GestorHuesped] listaHuespedes:", lista);

        // alt no existe ninguna concordancia
        if (!lista || lista.length === 0) {
            await UI.mostrarSinResultadosYOfrecerAlta();
            return;
        }

        // else existen coincidencias → GestorHuesped --> UI: mostrarResultados(lista)
        UI.mostrarResultados(lista);
        UI.mostrarSeccionResultados();
    }

    // UI --> GestorHuesped: devolverSeleccion(seleccion)
    static procesarSeleccion(seleccion, UI) {
        // alt selección vacía → darAltaHuesped()
        if (!seleccion) {
            UI.irAPantallaAlta();
            return;
        }

        // else selección válida → modificarHuesped(huespedDTO)
        GestorHuesped.modificarHuesped(seleccion, UI);
    }

    static modificarHuesped(huespedSeleccionado, UI) {
        UI.irAPantallaModificar(huespedSeleccionado);
    }

    // Stubs si tu profe mira el diagrama de clases
    static async darDeBaja(nroDoc) {}
    static async buscarHuespedPorDoc(apellido, nombre, tipoDoc, nroDoc) {}
    static async modificarHuespedPorDoc(nroDoc) {}
}

// export como módulo y también al objeto global para los scripts no-module
export { GestorHuesped };

if (typeof window !== "undefined") {
    window.GestorHuesped = GestorHuesped;
}
