// JS/ReservaDAO.js
// =======================================================
// ReservaDAO
//  - buscarReservasEntre(desde,hasta)
//  - guardarReserva(reserva)
//  Usa datos-habitaciones.js para el GET de reservas
// =======================================================

class ReservaDAO {

  static async buscarReservasEntre(desde, hasta) {
    try {
        const url = `http://localhost:8080/api/reservas/entre?inicio=${desde}&fin=${hasta}`;
        console.log("Solicitando reservas:", url);

        const res = await fetch(url);
        if (!res.ok) throw new Error("Error al cargar reservas.");

        const reservas = await res.json();
        console.log("Reservas recibidas:", reservas);
      
        return reservas;
    } catch (err) {
        console.error(err);
        if (typeof mensajeError === "function") {
            mensajeError("Error cargando reservas desde el backend.");
        }
        return [];
    }
  }

  static async guardarReserva(reserva) {
    const respuesta = await fetch("http://localhost:8080/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reserva)
    });

    if (!respuesta.ok) {
      throw new Error("No se pudo guardar la reserva en el backend.");
    }
  }
}

export { ReservaDAO };
window.ReservaDAO = ReservaDAO;
