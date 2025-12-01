// JS/HabitacionDAO.js
// =======================================================
// HabitacionDAO
//  - listarHabitaciones(): usa datos-habitaciones.js
// =======================================================

class HabitacionDAO {

  static async listarHabitaciones() {
    try {
        console.log("Solicitando habitaciones al backend…");

        const res = await fetch("http://localhost:8080/api/habitaciones");
        if (!res.ok) throw new Error("Error al cargar habitaciones.");

        HABITACIONES = await res.json();
        datosHabitacionesCargados = true;

        console.log("Habitaciones obtenidas:", HABITACIONES);
        console.log("Total habitaciones:", HABITACIONES.length);
        return HABITACIONES;
    } catch (err) {
        console.error(err);
        mensajeError("No se pudieron cargar las habitaciones.");
        HABITACIONES = [];
        return HABITACIONES;
    }

    throw new Error("No se pudieron obtener las habitaciones.");
  }
}

export { HabitacionDAO };
window.HabitacionDAO = HabitacionDAO;
