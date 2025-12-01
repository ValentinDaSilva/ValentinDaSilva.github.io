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
    // LLAMADO DESDE seleccion-habitaciones.js
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

        // Habitación no reservada - no se puede ocupar
        if (!evaluacion.ok && evaluacion.tipo === "no-reservada") {
            mensajeError("Solo se pueden ocupar habitaciones que estén RESERVADAS. Esta habitación está disponible (libre) en el rango seleccionado.");
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
    static async continuarCU07(habitacion, desde, hasta, reserva) {
        habitacionActual       = habitacion;
        desdeActual            = desde;
        hastaActual            = hasta;
        reservaAsociadaActual  = reserva || null;
        titularActual          = null;
        acompanantesActual     = [];

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

        const container = document.querySelector('.container');
        const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
        if (container) container.style.display = 'none';
        if (resultadoBusqueda) resultadoBusqueda.style.display = 'none';
        
        // Ocultar overlay del fondo cuando se oculta el buscador
        const overlayFondo = document.getElementById('overlay-fondo-opaco');
        if (overlayFondo) overlayFondo.style.display = 'none';

        // Preguntar si quiere acompañantes
        advertencia(
            "¿Desea agregar acompañantes?",
            "NO, CONTINUAR",
            "SÍ, AGREGAR"
        );

        const btnNo  = document.getElementById("boton-advertencia-aceptar");
        const btnSi  = document.getElementById("boton-advertencia-corregir");

        if (btnNo) {
            btnNo.onclick = () => {
                const modal = document.getElementById("modal-advertencia");
                if (modal) modal.style.display = "none";
                UIEstadia.crearYRegistrarEstadia([]);
            };
        }

        if (btnSi) {
            btnSi.onclick = () => {
                const modal = document.getElementById("modal-advertencia");
                if (modal) modal.style.display = "none";
                UIEstadia.mostrarBuscadorAcompanantes();
            };
        }
    }

    // --------------------------------------------------
    // CALLBACK GLOBAL: seleccionados ACOMPAÑANTES
    // (lo llama buscar-huesped.js → window.manejarSeleccionAcompaniantes)
    // --------------------------------------------------
    static async manejarSeleccionAcompanantes(listaJSON) {
        acompanantesActual = Array.isArray(listaJSON) ? listaJSON : [];

        const container = document.querySelector('.container');
        const resultadoBusqueda = document.querySelector('.resultadoBusqueda');
        if (container) container.style.display = 'none';
        if (resultadoBusqueda) resultadoBusqueda.style.display = 'none';
        
        // Ocultar overlay del fondo cuando se oculta el buscador
        const overlayFondo = document.getElementById('overlay-fondo-opaco');
        if (overlayFondo) overlayFondo.style.display = 'none';

        UIEstadia.crearYRegistrarEstadia(acompanantesActual);
    }

    // --------------------------------------------------
    // Construir datos y llamar a GestorEstadia.registrarOcupacion
    // --------------------------------------------------
    static async crearYRegistrarEstadia(listaAcompanantes) {
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

        UIEstadia.menuFinalCU07();
    }

    // --------------------------------------------------
    // Menú final CU07 (seguir / otra hab / salir)
    // Según diagrama de secuencia: SEGUIR CARGANDO, CARGAR OTRA HABITACIÓN, SALIR
    // --------------------------------------------------
    static menuFinalCU07() {
        // Crear modal con tres opciones
        const overlay = document.createElement("div");
        overlay.style.cssText = `
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.45);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
        `;

        const panel = document.createElement("div");
        panel.style.cssText = `
            background: white;
            width: 90%;
            max-width: 500px;
            border: 2px solid #412c26;
            border-radius: 10px;
            padding: 25px;
            font-family: sans-serif;
        `;

        panel.innerHTML = `
            <h2 style="margin-top: 0;">Ocupación registrada correctamente</h2>
            <p>¿Qué desea hacer?</p>
        `;

        const contBotones = document.createElement("div");
        contBotones.style.cssText = `
            margin-top: 20px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        const btnSeguir = document.createElement("button");
        btnSeguir.className = "boton-reserva-estandar";
        btnSeguir.textContent = "SEGUIR CARGANDO";
        btnSeguir.onclick = () => {
            overlay.remove();
            UIEstadia.mostrarBuscadorAcompanantes();
        };

        const btnOtra = document.createElement("button");
        btnOtra.className = "boton-reserva-estandar";
        btnOtra.textContent = "CARGAR OTRA HABITACIÓN";
        btnOtra.onclick = () => {
            overlay.remove();
            window.location.reload();
        };

        const btnSalir = document.createElement("button");
        btnSalir.className = "boton-reserva-estandar";
        btnSalir.textContent = "SALIR";
        btnSalir.onclick = () => {
            overlay.remove();
            window.location.href = "/index.html";
        };

        contBotones.appendChild(btnSeguir);
        contBotones.appendChild(btnOtra);
        contBotones.appendChild(btnSalir);
        panel.appendChild(contBotones);
        overlay.appendChild(panel);
        document.body.appendChild(overlay);
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
