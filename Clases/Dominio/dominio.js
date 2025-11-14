// ==========================
// ARCHIVO PRINCIPAL DE DOMINIO
// Este archivo importa y re-exporta todas las clases, enums y gestores
// ==========================

// ENUMS
export { EstadoHabitacion, EstadoReserva, EstadoEstadia, TipoDocumento, EstadoFactura, TipoFactura } from "./Enums.js";

// CLASES BASE
export { default as Direccion } from "./Direccion.js";
export { default as Persona } from "./Persona.js";

// CLASES QUE EXTENDEN
export { default as Huesped } from "./Huesped.js";

// CLASES DE DOMINIO
export { default as Habitacion } from "./Habitacion.js";
export { default as Reserva } from "./Reserva.js";
export { default as Estadia } from "./Estadia.js";
export { default as Factura } from "./Factura.js";
export { default as Pago } from "./Pago.js";
export { Efectivo, MonedaExtranjera, Cheque, Tarjeta } from "./MedioDePago/index.js";

// GESTORES
export { default as GestorHuesped } from "./GestorHuesped.js";
export { default as GestorReserva } from "./GestorReserva.js";
export { default as GestorHabitacion } from "./GestorHabitacion.js";
export { default as GestorEstadia } from "./GestorEstadia.js";
