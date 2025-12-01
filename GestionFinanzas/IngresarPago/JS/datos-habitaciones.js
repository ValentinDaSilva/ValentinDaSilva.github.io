

let habitaciones = [];


export async function cargarHabitaciones() {
  try {
    const respuesta = await fetch('/Datos/habitaciones.json');
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
    const datos = await respuesta.json();
    habitaciones = datos.habitaciones || [];
    console.log('Habitaciones cargadas:', habitaciones.length);
  } catch (error) {
    console.error('Error al cargar habitaciones:', error);
    habitaciones = [];
  }
}


export function obtenerHabitaciones() {
  return habitaciones;
}


export function existeHabitacion(numeroHabitacion) {
  const existe = habitaciones.some(h => h.numero === numeroHabitacion);
  console.log(`Buscando habitación ${numeroHabitacion}, habitaciones cargadas: ${habitaciones.length}, existe: ${existe}`);
  return existe;
}


export function obtenerHabitacionPorNumero(numeroHabitacion) {
  return habitaciones.find(h => h.numero === numeroHabitacion) || null;
}


cargarHabitaciones();

