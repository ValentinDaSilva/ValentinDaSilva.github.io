// EstadiaDAO.js
// ===========================================================
//   DAO de Estadia – Maneja comunicación con backend
//   CU07: Ocupar Habitación
//   Todas las operaciones devuelven: { ok, data?, error? }
// ===========================================================

const BASE_URL = "http://localhost:8080/api/estadia";  

class EstadiaDAO {

    // -------------------------------------------------------
    // GENERAR CHECK-IN / OCUPACIÓN (CU07)
    // Endpoint: POST /api/estadia/checkin
    // -------------------------------------------------------
    static async guardarOcupacion(estadia) {
        try {
            console.log("==========================================");
            console.log("📤 ENVIANDO ESTADÍA A LA BASE DE DATOS");
            console.log("==========================================");
            console.log("URL:", `${BASE_URL}/checkin`);
            console.log("Método: POST");
            console.log("EstadiaDTO completo:", JSON.stringify(estadia, null, 2));
            console.log("------------------------------------------");
            console.log("Detalles del DTO:");
            console.log("  - fechaCheckIn:", estadia.fechaCheckIn);
            console.log("  - fechaCheckOut:", estadia.fechaCheckOut);
            console.log("  - nroHabitacion:", estadia.nroHabitacion);
            console.log("  - titular:", estadia.titular);
            console.log("  - acompaniantes:", estadia.acompaniantes);
            if (estadia.idReserva) {
                console.log("  - idReserva:", estadia.idReserva);
            }
            console.log("==========================================");
            
            const respuesta = await fetch(`${BASE_URL}/checkin`, {
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

            // El backend devuelve un String según el controller
            const respuestaTexto = await respuesta.text();
            console.log("✅ Respuesta del backend:", respuestaTexto);
            
            return { ok: true, data: respuestaTexto };

        } catch (e) {
            console.error("❌ Error EstadiaDAO.guardarOcupacion:", e);
            return { ok: false, error: e.message || "Error de conexión" };
        }
    }

    // -------------------------------------------------------
    // REGISTRAR CHECK-OUT
    // Endpoint: POST /api/estadia/checkout/{id}
    // -------------------------------------------------------
    static async registrarCheckOut(idEstadia) {
        try {
            const respuesta = await fetch(`${BASE_URL}/checkout/${idEstadia}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!respuesta.ok) {
                const errorTexto = await respuesta.text();
                console.error("❌ Error en checkout:", errorTexto);
                return { ok: false, error: errorTexto };
            }

            const json = await respuesta.json();
            return { ok: true, data: json };

        } catch (e) {
            console.error("❌ Error EstadiaDAO.registrarCheckOut:", e);
            return { ok: false, error: e.message || "Error de conexión" };
        }
    }

    // -------------------------------------------------------
    // OBTENER ESTADÍA ACTIVA POR HABITACIÓN
    // Endpoint: GET /api/estadia/activa/{nroHabitacion}
    // -------------------------------------------------------
    static async obtenerActivaPorHabitacion(nroHabitacion) {
        try {
            const respuesta = await fetch(`${BASE_URL}/activa/${nroHabitacion}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!respuesta.ok) {
                const errorTexto = await respuesta.text();
                console.error("❌ Error obteniendo estadía activa:", errorTexto);
                return { ok: false, error: errorTexto };
            }

            const json = await respuesta.json();
            return { ok: true, data: json };

        } catch (e) {
            console.error("❌ Error EstadiaDAO.obtenerActivaPorHabitacion:", e);
            return { ok: false, error: e.message || "Error de conexión" };
        }
    }
}

export { EstadiaDAO };
window.EstadiaDAO = EstadiaDAO;   // Disponible para scripts no módulo
