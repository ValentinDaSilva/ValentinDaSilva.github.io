// /Reservas/JS/EstadiaDAO.js
// ===========================================================
//   DAO de Estadia – Maneja comunicación con backend
//   CU07: Ocupar Habitación
//   Todas las operaciones devuelven: { ok, data?, error? }
// ===========================================================

const BASE_URL = "http://localhost:8080/estadia";  
// Cambiar si usás otra URL o prefijo

class EstadiaDAO {

    // -------------------------------------------------------
    // GUARDAR OCUPACIÓN (CU07)
    // -------------------------------------------------------
    static async guardarOcupacion(estadia) {
        try {
            const respuesta = await fetch(`${BASE_URL}/guardar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(estadia)
            });

            if (!respuesta.ok) {
                const errorTexto = await respuesta.text();
                console.error("❌ Error en respuesta HTTP EstadiaDAO:", errorTexto);
                return { ok: false, error: errorTexto };
            }

            const json = await respuesta.json();
            return { ok: true, data: json };

        } catch (e) {
            console.error("❌ Error EstadiaDAO.guardarOcupacion:", e);
            return { ok: false, error: e.message || "Error de conexión" };
        }
    }

    // -------------------------------------------------------
    // LISTAR TODAS LAS ESTADÍAS (si lo necesitás en CU08 / CU09)
    // -------------------------------------------------------
    static async listar() {
        try {
            const r = await fetch(`${BASE_URL}/listar`);
            if (!r.ok) {
                const t = await r.text();
                return { ok: false, error: t };
            }
            const json = await r.json();
            return { ok: true, data: json };
        } catch (e) {
            return { ok: false, error: e.message };
        }
    }

    // -------------------------------------------------------
    // BUSCAR ESTADÍA POR ID (común en CU08 / CU09)
    // -------------------------------------------------------
    static async buscarPorId(id) {
        try {
            const r = await fetch(`${BASE_URL}/${id}`);
            if (!r.ok) {
                const t = await r.text();
                return { ok: false, error: t };
            }
            const json = await r.json();
            return { ok: true, data: json };
        } catch (e) {
            return { ok: false, error: e.message };
        }
    }

    // -------------------------------------------------------
    // ACTUALIZAR ESTADÍA (por ejemplo para registrar checkout)
    // -------------------------------------------------------
    static async actualizar(id, datos) {
        try {
            const respuesta = await fetch(`${BASE_URL}/actualizar/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(datos)
            });

            if (!respuesta.ok) {
                const t = await respuesta.text();
                return { ok: false, error: t };
            }

            const json = await respuesta.json();
            return { ok: true, data: json };

        } catch (e) {
            return { ok: false, error: e.message };
        }
    }
}

export { EstadiaDAO };
window.EstadiaDAO = EstadiaDAO;   // Disponible para scripts no módulo
