import Huesped from "./Huesped.js";

class GestorHuesped {
  constructor() { this.huespedes = []; }

  darDeAlta(huesped) {
    if (!huesped.verificarMayorEdad()) throw new Error("El huésped debe ser mayor de edad");
    this.huespedes.push(huesped);
  }

  darDeBaja(nroDoc) { this.huespedes = this.huespedes.filter(h => h.nroDocumento !== nroDoc); }

  buscarHuesped(nroDoc) { return this.huespedes.find(h => h.nroDocumento === nroDoc) || null; }

  modificarHuesped(nroDoc, datos) {
    const h = this.buscarHuesped(nroDoc);
    if (h) Object.assign(h, datos);
  }
}

export default GestorHuesped;

