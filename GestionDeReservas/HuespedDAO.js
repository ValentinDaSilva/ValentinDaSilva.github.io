// JS/HuespedDAO.js
// =======================================================
// HuespedDAO
//  - buscarHuespedes(criterios): busca huéspedes según criterios
// =======================================================

class HuespedDAO {

  static async buscarHuespedes(criterios) {
    try {
      const { apellido = "", nombre = "", tipoDocumento = "", numeroDocumento = "" } = criterios || {};
      
      // Construir query params
      const params = new URLSearchParams();
      if (apellido) params.append("apellido", apellido);
      if (nombre) params.append("nombre", nombre);
      if (tipoDocumento) params.append("tipoDocumento", tipoDocumento);
      if (numeroDocumento) params.append("numeroDocumento", numeroDocumento);

      const url = `http://localhost:8080/api/huespedes/buscar?${params.toString()}`;
      console.log("Solicitando huéspedes:", url);

      const res = await fetch(url);
      if (!res.ok) throw new Error("Error al buscar huéspedes.");

      const huespedes = await res.json();
      console.log("Huéspedes recibidos:", huespedes);
      
      return huespedes;
    } catch (err) {
      console.error(err);
      mensajeError("Error buscando huéspedes desde el backend.");
      return [];
    }
  }
}

export { HuespedDAO };
window.HuespedDAO = HuespedDAO;

