// ==========================
// ARCHIVO PRINCIPAL DE DOMINIO
// Este archivo importa y re-exporta todas las clases, enums y gestores
// ==========================

// ENUMS
export { default as EstadoHabitacion } from "./EstadoHabitacion.js";
export { default as EstadoReserva } from "./EstadoReserva.js";
export { default as EstadoEstadia } from "./EstadoEstadia.js";
export { default as TipoDocumento } from "./TipoDocumento.js";

// CLASES BASE
export { default as Direccion } from "./Direccion.js";
export { default as Persona } from "./Persona.js";

// CLASES QUE EXTENDEN
export { default as Huesped } from "./Huesped.js";

// CLASES DE DOMINIO
export { default as Habitacion } from "./Habitacion.js";
export { default as Reserva } from "./Reserva.js";
export { default as Estadia } from "./Estadia.js";

// GESTORES
export { default as GestorHuesped } from "./GestorHuesped.js";
export { default as GestorReserva } from "./GestorReserva.js";
export { default as GestorHabitacion } from "./GestorHabitacion.js";
export { default as GestorEstadia } from "./GestorEstadia.js";
