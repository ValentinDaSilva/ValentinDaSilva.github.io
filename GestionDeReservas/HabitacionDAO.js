// JS/HabitacionDAO.js
// =======================================================
// HabitacionDAO
//  - listarHabitaciones(): obtiene habitaciones del backend
// =======================================================

class HabitacionDAO {

  static async listarHabitaciones() {
    try {
        console.log("Solicitando habitaciones al backend…");

        const res = await fetch("http://localhost:8080/api/habitaciones");
        if (!res.ok) throw new Error("Error al cargar habitaciones.");

        const habitaciones = await res.json();

        console.log("Habitaciones obtenidas:", habitaciones);
        console.log("Total habitaciones:", habitaciones.length);
        return habitaciones;
    } catch (err) {
        console.error(err);
        if (typeof mensajeError === "function") {
            mensajeError("No se pudieron cargar las habitaciones.");
        }
        return [];
    }
  }
}

export { HabitacionDAO };
window.HabitacionDAO = HabitacionDAO;
