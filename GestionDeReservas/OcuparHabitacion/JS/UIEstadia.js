// OcuparHabitacion/JS/UIEstadia.js
// ======================================================
//     UI – OCUPAR HABITACIÓN (CU07 COMPLETO)
//     Se comunica únicamente con GestorEstadia
//     Sigue el diagrama de secuencia proporcionado
// ======================================================

import { GestorEstadia } from "./GestorEstadia.js";

// Estado interno del flujo CU07
let habitacionActual = null;
let desdeActual = null;
let hastaActual = null;
let reservaAsociadaActual = null;
let titularActual = null;
let acompanantesActual = [];

// Estado para múltiples selecciones
let seleccionesPendientes = []; // Array de {habitacion, desde, hasta, reserva}
let indiceSeleccionActual = 0;

class UIEstadia {

    // --------------------------------------------------
    // INICIALIZAR FORMULARIO DE FECHAS
    // --------------------------------------------------
    static inicializar() {
        const form = document.getElementById("form-ocupar");
        if (!form) return;

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const desde = document.getElementById("desde").value;
            const hasta = document.getElementById("hasta").value;

            const validacion = GestorEstadia.validarRangoFechas(desde, hasta);
            if (!validacion.ok) {
                mensajeError(validacion.mensaje);
                return;
            }

            const resultado = await GestorEstadia.obtenerEstadoHabitaciones(desde, hasta);
            if (!resultado.ok) {
                mensajeError(resultado.mensaje);
                return;
            }

            console.log("🔍 UIEstadia - Guardando datos en window:");
            console.log("  - Habitaciones:", resultado.listaHabitaciones?.length || 0);
            console.log("  - Reservas:", resultado.listaReservas?.length || 0);
            console.log("  - Reservas completas:", resultado.listaReservas);

            window.listaHabitacionesCU07 = resultado.listaHabitaciones;
            window.listaReservasCU07    = resultado.listaReservas;
            window.desdeCU07 = desde;
            window.hastaCU07 = hasta;
            
            console.log("🔍 UIEstadia - Verificación después de guardar:");
            console.log("  - window.listaReservasCU07:", window.listaReservasCU07?.length || 0);

            if (typeof generarTablaHabitaciones === "function") {
                generarTablaHabitaciones(desde, hasta);
            }

            const contenedor = document.querySelector(".contenedor-resultados");
            if (contenedor) contenedor.style.display = "block";
        });
    }

    // --------------------------------------------------
    // MANEJAR MÚLTIPLES SELECCIONES
    // Evalúa todas las habitaciones seleccionadas y prepara el flujo
    // --------------------------------------------------
    static async manejarMultiplesSelecciones(selecciones) {
        console.log("🔍 UIEstadia.manejarMultiplesSelecciones - Total selecciones:", selecciones.length);
        
        const reservas = window.listaReservasCU07 || [];
        const seleccionesValidas = [];
        
        // Evaluar cada selección
        for (const seleccion of selecciones) {
            const nombreHab = seleccion.habitacion;
            const fechaDesde = seleccion.fechaDesde;
            const fechaHasta = seleccion.fechaHasta;
            
            const numero = obtenerNumeroDesdeNombre(nombreHab);
            const habitacion = (window.listaHabitacionesCU07 || []).find(h => h.numero === numero);
            
            if (!habitacion) {
                mensajeError(`No se encontró la habitación ${nombreHab}.`);
                continue;
            }
            
            const fechasRango = generarArrayFechas(fechaDesde, fechaHasta);
            const evaluacion = GestorEstadia.evaluarSeleccion(habitacion, fechasRango, reservas);
            
            if (!evaluacion.ok) {
                if (evaluacion.tipo === "no-reservada") {
                    mensajeError(`La habitación ${nombreHab} no está reservada en el rango seleccionado.`);
                } else if (evaluacion.tipo === "dias-ocupados") {
                    mensajeError(`La habitación ${nombreHab} tiene días ocupados en este rango.`);
                } else if (evaluacion.tipo === "fechas-no-exactas") {
                    // Mostrar advertencia con las fechas exactas de la reserva
                    const fechaInicio = evaluacion.fechaInicioReserva;
                    const fechaFin = evaluacion.fechaFinReserva;
                    const modal = document.getElementById('modal-advertencia');
                    const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
                    const botonAceptar = document.getElementById("boton-advertencia-aceptar");
                    const botonCorregir = document.getElementById("boton-advertencia-corregir");
                    
                    if (modal && mensajeAdvertencia) {
                        mensajeAdvertencia.innerHTML = `Las fechas seleccionadas no coinciden exactamente con la reserva de la habitación ${nombreHab}.<br><br>
                            <b>Fechas seleccionadas:</b><br>
                            Desde: <b>${fechaDesde}</b> | Hasta: <b>${fechaHasta}</b><br><br>
                            <b>Fechas de la reserva:</b><br>
                            Desde: <b>${fechaInicio}</b> | Hasta: <b>${fechaFin}</b><br><br>
                            Por favor, seleccione el rango exacto de la reserva.`;
                        
                        if (botonAceptar) {
                            botonAceptar.textContent = "ACEPTAR";
                            botonAceptar.onclick = () => {
                                modal.style.display = "none";
                                // Restaurar visibilidad del segundo botón para próximos usos
                                if (botonCorregir) botonCorregir.style.display = "";
                            };
                        }
                        
                        if (botonCorregir) {
                            botonCorregir.style.display = "none"; // Ocultar segundo botón
                        }
                        
                        modal.style.display = "flex";
                    }
                    // No continuar con esta selección
                    continue;
                }
                continue;
            }
            
            if (evaluacion.ok && evaluacion.tipo === "engloba-reservada") {
                const reserva = evaluacion.reservas[0];
                seleccionesValidas.push({
                    habitacion: habitacion,
                    desde: fechaDesde,
                    hasta: fechaHasta,
                    reserva: reserva,
                    requiereCrearReserva: false
                });
                
                // Pintar como ocupada visualmente
                const fechas = generarArrayFechas(fechaDesde, fechaHasta);
                UIEstadia.pintarComoOcupada(nombreHab, fechas);
            } else if (evaluacion.ok && evaluacion.tipo === "disponible-sin-reserva") {
                // Habitación libre - se creará la reserva después de seleccionar el titular
                seleccionesValidas.push({
                    habitacion: habitacion,
                    desde: fechaDesde,
                    hasta: fechaHasta,
                    reserva: null, // Se creará después
                    requiereCrearReserva: true
                });
                
                // Pintar como ocupada visualmente
                const fechas = generarArrayFechas(fechaDesde, fechaHasta);
                UIEstadia.pintarComoOcupada(nombreHab, fechas);
            }
        }
        
        if (seleccionesValidas.length === 0) {
            mensajeError("No hay selecciones válidas para procesar.");
            return;
        }
        
        // Guardar las selecciones válidas y comenzar el flujo
        seleccionesPendientes = seleccionesValidas;
        indiceSeleccionActual = 0;
        
        console.log("✅ Selecciones válidas:", seleccionesValidas.length);
        
        // Mostrar mensaje y comenzar con la búsqueda de titular
        if (typeof mensajeCorrecto === "function") {
            mensajeCorrecto("Presione una tecla para continuar", () => {
                UIEstadia.mostrarBuscadorTitular();
            });
        } else {
            UIEstadia.mostrarBuscadorTitular();
        }
    }

    // --------------------------------------------------
    // LLAMADO DESDE seleccion-habitaciones.js (método antiguo, mantener para compatibilidad)
    // manejamos evaluación de la selección
    // --------------------------------------------------
    static async manejarSeleccion(nombreHab, fechaDesde, fechaHasta) {
        console.log("🔍 UIEstadia.manejarSeleccion:", { nombreHab, fechaDesde, fechaHasta });
        
        const numero = obtenerNumeroDesdeNombre(nombreHab);
        console.log("🔍 Número extraído:", numero);
        
        const habitacion = (window.listaHabitacionesCU07 || []).find(h => h.numero === numero);
        console.log("🔍 Habitación encontrada:", habitacion);
        
        const reservas = window.listaReservasCU07 || [];
        console.log("🔍 Reservas disponibles:", reservas.length);

        const fechasRango = generarArrayFechas(fechaDesde, fechaHasta);
        console.log("🔍 Fechas rango:", fechasRango);
        
        const evaluacion = GestorEstadia.evaluarSeleccion(habitacion, fechasRango, reservas);
        console.log("🔍 Evaluación resultado:", evaluacion);

        if (!evaluacion.ok && evaluacion.tipo === "estado-no-permitido") {
            mensajeError("El estado de la habitación no permite ocuparla.");
            return;
        }

        if (!evaluacion.ok && evaluacion.tipo === "dias-ocupados") {
            mensajeError("La habitación tiene días OCUPADOS en este rango.");
            return;
        }

        if (!evaluacion.ok && evaluacion.tipo === "sin-habitacion") {
            mensajeError("No se encontró la habitación seleccionada.");
            return;
        }

        // Habitación disponible sin reserva - se puede ocupar creando reserva
        if (evaluacion.ok && evaluacion.tipo === "disponible-sin-reserva") {
            // Continuar con el flujo, se creará la reserva después de seleccionar el titular
            return UIEstadia.continuarCU07(habitacion, fechaDesde, fechaHasta, null, true);
        }

        // Fechas no coinciden exactamente con la reserva
        if (!evaluacion.ok && evaluacion.tipo === "fechas-no-exactas") {
            const fechaInicio = evaluacion.fechaInicioReserva;
            const fechaFin = evaluacion.fechaFinReserva;
            const modal = document.getElementById('modal-advertencia');
            const mensajeAdvertencia = document.getElementById('mensaje-advertencia');
            const botonAceptar = document.getElementById("boton-advertencia-aceptar");
            const botonCorregir = document.getElementById("boton-advertencia-corregir");
            
            if (modal && mensajeAdvertencia) {
                mensajeAdvertencia.innerHTML = `Las fechas seleccionadas no coinciden exactamente con la reserva.<br><br>
                    <b>Fechas seleccionadas:</b><br>
                    Desde: <b>${fechaDesde}</b> | Hasta: <b>${fechaHasta}</b><br><br>
                    <b>Fechas de la reserva:</b><br>
                    Desde: <b>${fechaInicio}</b> | Hasta: <b>${fechaFin}</b><br><br>
                    Por favor, seleccione el rango exacto de la reserva.`;
                
                if (botonAceptar) {
                    botonAceptar.textContent = "ACEPTAR";
                    botonAceptar.onclick = () => {
                        modal.style.display = "none";
                        // Restaurar visibilidad del segundo botón para próximos usos
                        if (botonCorregir) botonCorregir.style.display = "";
                    };
                }
                
                if (botonCorregir) {
                    botonCorregir.style.display = "none"; // Ocultar segundo botón
                }
                
                modal.style.display = "flex";
            }
            return;
        }

        // Engloba reserva(s) - esta es la única forma válida de ocupar
        if (evaluacion.ok && evaluacion.tipo === "engloba-reservada") {
            return UIEstadia.mostrarInfoReservaYConfirmar(
                evaluacion.reservas,
                habitacion,
                fechaDesde,
                fechaHasta
            );
        }
    }

    // --------------------------------------------------
    // RESERVA DETECTADA → pedir confirmación
    // --------------------------------------------------
    static async mostrarInfoReservaYConfirmar(reservas, habitacion, desde, hasta) {
        const r = reservas[0];

        advertencia(
            `Esta habitación tiene una RESERVA cargada:<br><br>
            Titular: <b>${r.titular?.apellido || ""}, ${r.titular?.nombre || ""}</b><br>
            Desde: <b>${r.fechaInicio}</b> | Hasta: <b>${r.fechaFin}</b><br><br>
            ¿Desea OCUPAR IGUAL?`,
            "VOLVER",
            "OCUPAR IGUAL"
        );

        const volver = document.getElementById("boton-advertencia-aceptar");
        const ocupar = document.getElementById("boton-advertencia-corregir");

        if (volver) {
            volver.onclick = () => {
                const modal = document.getElementById("modal-advertencia");
                if (modal) modal.style.display = "none";
            };
        }

        if (ocupar) {
            ocupar.onclick = async () => {
                const modal = document.getElementById("modal-advertencia");
                if (modal) modal.style.display = "none";

                const fechas = generarArrayFechas(desde, hasta);
                UIEstadia.pintarComoOcupada(habitacion.tipo + "-" + habitacion.numero, fechas);

                await UIEstadia.continuarCU07(habitacion, desde, hasta, r);
            };
        }
    }

    // --------------------------------------------------
    // Pintar como ocupada en la grilla
    // --------------------------------------------------
    static pintarComoOcupada(nombreHab, fechasRango) {
        const numero = obtenerNumeroDesdeNombre(nombreHab);

        fechasRango.forEach(f => {
            const celda = document.querySelector(
                `.tabla-habitaciones td[data-numero-habitacion="${numero}"][data-fecha="${f}"]`
            );

            if (!celda) return;

            celda.classList.remove("estado-libre", "estado-reservada");
            celda.classList.add("estado-ocupada");
            celda.dataset.estadoOriginal = "ocupada";
        });

        aplicarEstilosCeldas();
    }

    // --------------------------------------------------
    // GUARDAMOS CONTEXTO Y DISPARAMOS BÚSQUEDA TITULAR
    // Según diagrama: mostrar "Presione una tecla para continuar" primero
    // --------------------------------------------------
    static async continuarCU07(habitacion, desde, hasta, reserva, requiereCrearReserva = false) {
        habitacionActual       = habitacion;
        desdeActual            = desde;
        hastaActual            = hasta;
        reservaAsociadaActual  = reserva || null;
        titularActual          = null;
        acompanantesActual     = [];
        window.requiereCrearReservaCU07 = requiereCrearReserva; // Flag para saber si hay que crear reserva

        // Mostrar mensaje "Presione una tecla para continuar" según diagrama
        if (typeof mensajeCorrecto === "function") {
            mensajeCorrecto("Presione una tecla para continuar", () => {
                UIEstadia.mostrarBuscadorTitular();
            });
        } else {
            // Si no hay función mensajeCorrecto, mostrar directamente
            UIEstadia.mostrarBuscadorTitular();
        }
    }

    // --------------------------------------------------
    // Mostrar UI buscar TITULAR (reutiliza buscar-huesped.js)
    // --------------------------------------------------
    static mostrarBuscadorTitular() {
        const container = document.querySelector('.container');
        const resultadoBusqueda = document.querySelector('.resultadoBusqueda');

        if (!container || !resultadoBusqueda) {
            console.error("UIEstadia: no se encontró la UI de búsqueda de huésped.");
            mensajeError("No se encontró la UI de búsqueda de huésped.");
            return;
        }

        const titulo = container.querySelector('h1');
        if (titulo) titulo.textContent = "Buscar Titular de la Estadía";

        const botonSiguiente = document.querySelector('.siguienteBusqueda');
        if (botonSiguiente) botonSiguiente.textContent = "Aceptar";

        const form = container.querySelector('form');
        if (form) form.reset();

        const tbody = resultadoBusqueda.querySelector('tbody');
        if (tbody) tbody.innerHTML = '';

        // Ocultamos resultados de habitaciones
        const contenedorResultados = document.querySelector('.contenedor-resultados');
        if (contenedorResultados) contenedorResultados.style.display = 'none';
        
        // Ocultamos solo el formulario de búsqueda dentro del fondo, NO el fondo completo
        const formularioBusqueda = document.querySelector('.fondo-reserva .formulario-busqueda');
        if (formularioBusqueda) {
            formularioBusqueda.style.display = 'none';
        }
        
        // El fondo (.fondo-reserva) debe permanecer visible siempre
        const fondoReserva = document.querySelector('.fondo-reserva');
        if (fondoReserva) {
            fondoReserva.style.display = 'block';
            fondoReserva.style.visibility = 'visible';
        }
        
        // Hacer el fondo más opaco agregando un overlay
        let overlayFondo = document.getElementById('overlay-fondo-opaco');
        if (!overlayFondo) {
            overlayFondo = document.createElement('div');
            overlayFondo.id = 'overlay-fondo-opaco';
            overlayFondo.style.cssText = `
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 9998;
                pointer-events: none;
            `;
            document.body.appendChild(overlayFondo);
        } else {
            overlayFondo.style.display = 'block';
        }

        // Mostramos buscador
        container.style.display = 'block';
        container.style.top = '50px';
        resultadoBusqueda.style.display = 'block';
        resultadoBusqueda.style.top = '50px';
    }

    // --------------------------------------------------
    // Mostrar UI buscar ACOMPAÑANTES (opcional)
    // --------------------------------------------------
    static mostrarBuscadorAcompanantes() {
        const container = document.querySelector('.container');
        const resultadoBusqueda = document.querySelector('.resultadoBusqueda');

        if (!container || !resultadoBusqueda) {
            console.error("UIEstadia: no se encontró la UI de búsqueda para acompañantes.");
            mensajeError("No se encontró la UI de búsqueda para acompañantes.");
            return;
        }

        const titulo = container.querySelector('h1');
        if (titulo) titulo.textContent = "Buscar Acompañantes (opcional)";

        const botonSiguiente = document.querySelector('.siguienteBusqueda');
        if (botonSiguiente) botonSiguiente.textContent = "Continuar";

        const form = container.querySelector('form');
        if (form) form.reset();

        const tbody = resultadoBusqueda.querySelector('tbody');
        if (tbody) tbody.innerHTML = '';

        // Asegurar que el overlay esté visible
        let overlayFondo = document.getElementById('overlay-fondo-opaco');
        if (!overlayFondo) {
            overlayFondo = document.createElement('div');
            overlayFondo.id = 'overlay-fondo-opaco';
            overlayFondo.style.cssText = `
                position: fixed;
                inset: 0;
                background-color: rgba(0, 0, 0, 0.6);
                z-index: 9998;
                pointer-events: none;
            `;
            document.body.appendChild(overlayFondo);
        } else {
            overlayFondo.style.display = 'block';
        }

        container.style.display = 'block';
        container.style.top = '50px';
        resultadoBusqueda.style.display = 'block';
        resultadoBusqueda.style.top = '50px';
    }

    // --------------------------------------------------
    // CALLBACK GLOBAL: seleccionado TITULAR
    // (lo llama buscar-huesped.js → window.manejarSeleccionTitular)
    // --------------------------------------------------
    static async manejarSeleccionTitular(huespedJSON) {
        if (!huespedJSON) {
            mensajeError("Debe seleccionar un titular.");
            return;
        }

        titularActual = huespedJSON;

        // Si requiere crear reserva (habitación libre), crearla ahora con el titular
        if (window.requiereCrearReservaCU07 && habitacionActual && desdeActual && hastaActual) {
            // Extraer solo nombre, apellido y teléfono del titular
            const titularSimplificado = {
                nombre: huespedJSON.nombre || "",
                apellido: huespedJSON.apellido || "",
                telefono: huespedJSON.telefono || ""
            };

            console.log("📤 Creando reserva para habitación libre...");
            const resultadoCrearReserva = await GestorEstadia.crearReserva(
                habitacionActual,
                desdeActual,
                hastaActual,
                titularSimplificado
            );

            if (!resultadoCrearReserva.ok) {
                mensajeError(resultadoCrearReserva.mensaje || "No se pudo crear la reserva.");
                return;
            }

            // Asignar la reserva creada
            reservaAsociadaActual = resultadoCrearReserva.reserva;
            window.requiereCrearReservaCU07 = false; // Ya se creó
            console.log("✅ Reserva creada:", reservaAsociadaActual);
        }

        // Si hay múltiples selecciones pendientes, crear reservas para las que lo requieran
        if (seleccionesPendientes.length > 0) {
            for (let i = 0; i < seleccionesPendientes.length; i++) {
                const seleccion = seleccionesPendientes[i];
                if (seleccion.requiereCrearReserva && !seleccion.reserva) {
                    const titularSimplificado = {
                        nombre: huespedJSON.nombre || "",
                        apellido: huespedJSON.apellido || "",
                        telefono: huespedJSON.telefono || ""
                    };

                    console.log(`📤 Creando reserva ${i + 1}/${seleccionesPendientes.length} para habitación libre...`);
                    const resultadoCrearReserva = await GestorEstadia.crearReserva(
                        seleccion.habitacion,
                        seleccion.desde,
                        seleccion.hasta,
                        titularSimplificado
                    );

                    if (!resultadoCrearReserva.ok) {
                        mensajeError(`No se pudo crear la reserva para ${seleccion.habitacion.tipo}-${seleccion.habitacion.numero}: ${resultadoCrearReserva.mensaje}`);
                        continue;
                    }

                    // Asignar la reserva creada a la selección
                    seleccionesPendientes[i].reserva = resultadoCrearReserva.reserva;
                    seleccionesPendientes[i].requiereCrearReserva = false;
                    console.log(`✅ Reserva ${i + 1} creada:`, resultadoCrearReserva.reserva);
                }
            }
        }

        const container = document.querySelector('.container');
        const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
        if (container) container.style.display = 'none';
        if (resultadoBusqueda) resultadoBusqueda.style.display = 'none';
        
        // Ocultar overlay del fondo cuando se oculta el buscador
        const overlayFondo = document.getElementById('overlay-fondo-opaco');
        if (overlayFondo) overlayFondo.style.display = 'none';

        // Preguntar si quiere acompañantes
        pregunta(
            "¿Desea agregar acompañantes?", 
            "SÍ, AGREGAR ✅",
            "NO, CONTINUAR ❌",
            "Salir ❌"
        ).then(async (boton) => {
            if (!boton) return;
            
            if (boton === "SÍ, AGREGAR ✅") {
                // Mostrar buscador de acompañantes
                UIEstadia.mostrarBuscadorAcompanantes();
            } else if (boton === "NO, CONTINUAR ❌") {
                // Registrar la estadía inmediatamente (sin acompañantes)
                await UIEstadia.crearYRegistrarEstadia([]);
                // Mostrar mensaje de éxito y redirigir
                mensajeCorrecto("Ocupación registrada correctamente", () => {
                    window.location.href = "/index.html";
                });
            } else if (boton === "Salir ❌") {
                // Salir sin registrar
                window.location.href = "/index.html";
            }
        });
    }

    // --------------------------------------------------
    // CALLBACK GLOBAL: seleccionados ACOMPAÑANTES
    // (lo llama buscar-huesped.js → window.manejarSeleccionAcompaniantes)
    // --------------------------------------------------
    static async manejarSeleccionAcompanantes(listaJSON) {
        // Agregar los nuevos acompañantes a la lista actual (acumular)
        const nuevosAcompanantes = Array.isArray(listaJSON) ? listaJSON : [];
        acompanantesActual = [...acompanantesActual, ...nuevosAcompanantes];

        const container = document.querySelector('.container');
        const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
        if (container) container.style.display = 'none';
        if (resultadoBusqueda) resultadoBusqueda.style.display = 'none';
        
        // Ocultar overlay del fondo cuando se oculta el buscador
        const overlayFondo = document.getElementById('overlay-fondo-opaco');
        if (overlayFondo) overlayFondo.style.display = 'none';

        // Preguntar si quiere cargar más acompañantes o continuar
        pregunta(
            "¿Desea agregar más acompañantes?", 
            "SÍ, AGREGAR ✅",
            "NO, CONTINUAR ❌",
            "Salir ❌"
        ).then(async (boton) => {
            if (!boton) return;
            
            if (boton === "SÍ, AGREGAR ✅") {
                // Mostrar buscador de acompañantes nuevamente
                UIEstadia.mostrarBuscadorAcompanantes();
            } else if (boton === "NO, CONTINUAR ❌") {
                // Registrar la estadía con los acompañantes cargados
                await UIEstadia.crearYRegistrarEstadia(acompanantesActual);
                // Mostrar mensaje de éxito y redirigir
                mensajeCorrecto("Ocupación registrada correctamente", () => {
                    window.location.href = "/index.html";
                });
            } else if (boton === "Salir ❌") {
                // Registrar la estadía antes de salir
                await UIEstadia.crearYRegistrarEstadia(acompanantesActual);
                window.location.href = "/index.html";
            }
        });
    }

    // --------------------------------------------------
    // Construir datos y llamar a GestorEstadia.registrarOcupacion
    // Este método solo registra, NO muestra el menú
    // --------------------------------------------------
    static async crearYRegistrarEstadia(listaAcompanantes) {
        // Si hay múltiples selecciones pendientes, registrar todas
        if (seleccionesPendientes.length > 0) {
            return await UIEstadia.registrarTodasLasEstadias(listaAcompanantes);
        }
        
        // Flujo antiguo: una sola estadía
        if (!habitacionActual || !desdeActual || !hastaActual || !titularActual) {
            mensajeError("Faltan datos para registrar la ocupación.");
            return;
        }

        const resultado = await GestorEstadia.registrarOcupacion(
            habitacionActual,
            desdeActual,
            hastaActual,
            titularActual,
            listaAcompanantes,
            reservaAsociadaActual
        );

        if (!resultado.ok) {
            mensajeError(resultado.mensaje || "No se pudo registrar la ocupación.");
            return;
        }

        console.log("✅ Estadía registrada correctamente");
    }

    // --------------------------------------------------
    // REGISTRAR TODAS LAS ESTADÍAS (una por cada habitación seleccionada)
    // --------------------------------------------------
    static async registrarTodasLasEstadias(listaAcompanantes) {
        if (!titularActual) {
            mensajeError("Faltan datos para registrar la ocupación.");
            return;
        }

        console.log(`📤 Registrando ${seleccionesPendientes.length} estadía(s)...`);
        
        let exitosas = 0;
        let fallidas = 0;
        
        for (const seleccion of seleccionesPendientes) {
            const resultado = await GestorEstadia.registrarOcupacion(
                seleccion.habitacion,
                seleccion.desde,
                seleccion.hasta,
                titularActual,
                listaAcompanantes,
                seleccion.reserva
            );

            if (resultado.ok) {
                exitosas++;
                console.log(`✅ Estadía registrada para habitación ${seleccion.habitacion.tipo}-${seleccion.habitacion.numero}`);
            } else {
                fallidas++;
                console.error(`❌ Error registrando estadía para habitación ${seleccion.habitacion.tipo}-${seleccion.habitacion.numero}:`, resultado.mensaje);
            }
        }

        if (fallidas > 0) {
            mensajeError(`Se registraron ${exitosas} estadía(s) correctamente, pero ${fallidas} fallaron.`);
        } else {
            console.log(`✅ Todas las estadías registradas correctamente (${exitosas})`);
        }
        
        // Limpiar selecciones pendientes
        seleccionesPendientes = [];
        indiceSeleccionActual = 0;
    }

}

// Exponemos para JS no módulo
window.UIEstadia = UIEstadia;

// Call inicializar
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => UIEstadia.inicializar());
} else {
    UIEstadia.inicializar();
}

export { UIEstadia };

// CALLBACKS para buscar-huesped.js
window.manejarSeleccionTitular = (h) => UIEstadia.manejarSeleccionTitular(h);
window.manejarSeleccionAcompaniantes = (lista) => UIEstadia.manejarSeleccionAcompanantes(lista);
