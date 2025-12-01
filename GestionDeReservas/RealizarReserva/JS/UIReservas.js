// JS/UIReservas.js
// =======================================================
// UIReservas
//  - Maneja la interacción con la UI
//  - Llama a GestorReserva para la lógica
// =======================================================

import { GestorReserva } from "../../GestorReserva.js";

class UIReservas {

  // ---------------------------------------------------
  // Inicialización general
  // ---------------------------------------------------
  static inicializar() {
    UIReservas.inicializarBusqueda();
    UIReservas.inicializarBotonReservar();
  }

  // ---------------------------------------------------
  // Formulario de búsqueda de fechas
  // ---------------------------------------------------
  static inicializarBusqueda() {
    const form = document.querySelector(".formulario-busqueda form") || document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const desde = document.getElementById("fecha-desde").value;
      const hasta = document.getElementById("fecha-hasta").value;

      const valido = GestorReserva.validarRangoFechas(desde, hasta, UIReservas);
      if (!valido) return;
      await GestorReserva.obtenerEstadoHabitaciones(desde, hasta, UIReservas);
    });
  }

  // ---------------------------------------------------
  // Botón "Reservar"
  // ---------------------------------------------------
  static inicializarBotonReservar() {
    const btn = document.querySelector(".boton-reservar");
    if (!btn) return;

    btn.addEventListener("click", () => {
      const lista = typeof obtenerHabitacionesSeleccionadas === "function"
        ? obtenerHabitacionesSeleccionadas()
        : [];

      if (!lista || !lista.length) {
        UIReservas.mostrarError("Debe seleccionar al menos una habitación.");
        return;
      }

      UIReservas.mostrarConfirmacion(lista);
    });
  }

  // ---------------------------------------------------
  // Mostrar errores (usa modales.js)
  // ---------------------------------------------------
  static mostrarError(mensaje) {
    if (typeof mensajeError === "function") {
      mensajeError(mensaje);
    } else {
      alert(mensaje);
    }
  }

  // ---------------------------------------------------
  // Mostrar grilla con resultados
  // ---------------------------------------------------
  static mostrarGrilla() {
    const cont = document.querySelector(".contenedor-resultados");
    if (cont) cont.style.display = "block";
  }

  // ---------------------------------------------------
  // Panel de confirmación: listado tipo / ingreso / egreso
  // ---------------------------------------------------
  static mostrarConfirmacion(listaSeleccion) {
    const base = document.querySelector(".contenedor-resultados");
    if (base) base.style.display = "none";

    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.45);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9998;
    `;

    const panel = document.createElement("div");
    panel.style.cssText = `
      background: white;
      width: 90%;
      max-width: 600px;
      border: 2px solid #412c26;
      border-radius: 10px;
      padding: 25px;
      font-family: sans-serif;
    `;

    panel.innerHTML = `<h2>Confirmá la selección</h2>`;

    listaSeleccion.forEach(sel => {
      panel.innerHTML += `
        <p style="margin:8px 0;">
          <strong>${sel.habitacion}</strong> —
          Desde <strong>${sel.fechaDesde}</strong>
          hasta <strong>${sel.fechaHasta}</strong>
        </p>
      `;
    });

    const contBotones = document.createElement("div");
    contBotones.style.cssText = `
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    `;

    const btnRechazar = document.createElement("button");
    btnRechazar.className = "boton-reserva-estandar";
    btnRechazar.textContent = "Rechazar";
    btnRechazar.onclick = () => {
      overlay.remove();
      if (base) base.style.display = "block";
      if (typeof limpiarHabitacionesSeleccionadas === "function") {
        limpiarHabitacionesSeleccionadas();
      }
    };

    const btnAceptar = document.createElement("button");
    btnAceptar.className = "boton-reserva-estandar";
    btnAceptar.textContent = "Aceptar";
    btnAceptar.onclick = () => {
      overlay.remove();
      UIReservas.mostrarFormularioTitular(listaSeleccion);
    };

    contBotones.appendChild(btnRechazar);
    contBotones.appendChild(btnAceptar);

    panel.appendChild(contBotones);
    overlay.appendChild(panel);
    document.body.appendChild(overlay);
  }

  // ---------------------------------------------------
  // Formulario de titular (Apellido, Nombre, Teléfono)
  // ---------------------------------------------------
  static mostrarFormularioTitular(listaSeleccion) {
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

    const box = document.createElement("div");
    box.className = "formulario-datos-huesped";
    box.style.cssText = `
      width: 90%;
      max-width: 600px;
      background: white;
      padding: 40px;
      border-radius: 15px;
      box-shadow: 0 8px 30px rgba(0,0,0,0.2);
    `;

    box.innerHTML = `
      <h2 class="titulo-formulario-huesped">Datos del Titular</h2>

      <div class="cuadricula-formulario-huesped">
        <div class="contenedor-campo-huesped">
          <label>Nombre</label>
          <input id="tit-nombre" class="campo-huesped" placeholder="Ingresá nombre">
        </div>

        <div class="contenedor-campo-huesped">
          <label>Apellido</label>
          <input id="tit-apellido" class="campo-huesped" placeholder="Ingresá apellido">
        </div>

        <div class="contenedor-campo-huesped">
          <label>Teléfono</label>
          <input id="tit-telefono" class="campo-huesped" placeholder="Ej: 341-5555555">
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:15px; margin-top:20px;">
        <button id="btn-tit-cancelar" class="boton-reserva-estandar">Cancelar</button>
        <button id="btn-tit-confirmar" class="boton-reserva-estandar">Confirmar Reserva</button>
      </div>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const btnCancelar = document.getElementById("btn-tit-cancelar");
    const btnConfirmar = document.getElementById("btn-tit-confirmar");

    btnCancelar.onclick = () => {
      overlay.remove();
      const base = document.querySelector(".contenedor-resultados");
      if (base) base.style.display = "block";
    };

    btnConfirmar.onclick = async () => {
      const nombre = document.getElementById("tit-nombre").value.trim();
      const apellido = document.getElementById("tit-apellido").value.trim();
      const telefono = document.getElementById("tit-telefono").value.trim();

      if (!nombre || !apellido || !telefono) {
        UIReservas.mostrarError("Complete todos los campos obligatorios del titular.");
        return;
      }

      const desde = document.getElementById("fecha-desde").value;
      const hasta = document.getElementById("fecha-hasta").value;

      await GestorReserva.crearReserva(
        listaSeleccion,
        { nombre, apellido, telefono },
        desde,
        hasta,
        UIReservas
      );

      overlay.remove();
    };
  }

  // ---------------------------------------------------
  // Mensaje final de éxito
  // ---------------------------------------------------
  static mostrarReservaExitosa() {
    if (typeof mensajeCorrecto === "function") {
      function reiniciarPagina() {
          location.reload();
      }
      mensajeCorrecto("Reserva registrada con éxito.", reiniciarPagina);
    } else {
      alert("Reserva registrada con éxito.");
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => UIReservas.inicializar());
} else {
  UIReservas.inicializar();
}

export { UIReservas };
window.UIReservas = UIReservas;
