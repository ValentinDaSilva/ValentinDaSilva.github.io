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
        console.log("==========================================");
        console.log("📤 ReservaDAO.buscarReservasEntre");
        console.log("==========================================");
        console.log("URL:", url);
        console.log("Desde:", desde);
        console.log("Hasta:", hasta);

        const res = await fetch(url);
        console.log("Status de respuesta:", res.status, res.statusText);
        
        if (!res.ok) {
            const errorText = await res.text();
            console.error("❌ Error HTTP:", res.status, errorText);
            throw new Error(`Error al cargar reservas: ${res.status} ${errorText}`);
        }

        const reservas = await res.json();
        console.log("✅ Reservas recibidas del backend:", reservas.length);
        console.log("✅ Reservas completas:", reservas);
        console.log("==========================================");
      
        return reservas;
    } catch (err) {
        console.error("❌ Error en ReservaDAO.buscarReservasEntre:", err);
        console.error("Stack trace:", err.stack);
        if (typeof mensajeError === "function") {
            mensajeError("Error cargando reservas desde el backend: " + err.message);
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
