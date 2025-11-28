// [JS/reserva.js]
// ==============================================================
//  reserva.js — VERSIÓN REORGANIZADA
//  ✔ Maneja solo la interacción con la UI
//  ✔ Llama a GestorReserva.realizarReserva(listaSeleccion, datosTitular)
//  ✔ El fetch y el armado de DTO/dominio está en los Gestores
// ==============================================================

import GestorReserva from "../GestorReserva.js";

// ------------------------------------------------------------
// 1) MANEJAR BÚSQUEDA → cargar tabla
// ------------------------------------------------------------
function manejarBusqueda() {
  const form = document.querySelector("form");
  if (!form) return;

  form.addEventListener("submit", async e => {
    e.preventDefault();

    const desde = document.getElementById("fecha-desde").value;
    const hasta = document.getElementById("fecha-hasta").value;

    if (!desde || !hasta) {
      mensajeError("Debes completar ambas fechas.");
      return;
    }

    if (new Date(desde) >= new Date(hasta)) {
      mensajeError("La fecha de salida debe ser posterior a la de entrada.");
      return;
    }

    // Limpio selección anterior, cargo datos y genero grilla
    if (typeof limpiarHabitacionesSeleccionadas === "function") {
      limpiarHabitacionesSeleccionadas();
    }

    await asegurarHabitaciones();
    await cargarReservasEntre(desde, hasta);

    generarTablaHabitaciones(desde, hasta);

    const cont = document.querySelector(".contenedor-resultados");
    if (cont) cont.style.display = "block";
  });
}

// ------------------------------------------------------------
// 2) CLICK EN "RESERVAR" → abrir confirmación
// ------------------------------------------------------------
function manejarClickReservar() {
  const btn = document.querySelector(".boton-reservar");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const seleccion = obtenerHabitacionesSeleccionadas();
    if (!seleccion.length) {
      mensajeError("Debe seleccionar al menos una habitación.");
      return;
    }
    mostrarConfirmacion(seleccion);
  });
}

// ------------------------------------------------------------
// 3) PANEL DE CONFIRMACIÓN
// ------------------------------------------------------------
function mostrarConfirmacion(lista) {
  const base = document.querySelector(".contenedor-resultados");
  if (base) base.style.display = "none";

  const overlay = document.createElement("div");
  overlay.className = "overlay-confirmacion";
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
  panel.className = "panel-confirmacion";
  panel.style.cssText = `
    background: white;
    width: 90%;
    max-width: 600px;
    border: 2px solid #412c26;
    border-radius: 10px;
    padding: 25px;
  `;

  panel.innerHTML = `<h2>Confirmá la selección</h2>`;

  lista.forEach(sel => {
    panel.innerHTML += `
      <p style="margin:8px 0;">
        <strong>${sel.habitacion}</strong> —
        Desde <strong>${sel.fechaDesde}</strong>
        hasta <strong>${sel.fechaHasta}</strong>
      </p>
    `;
  });

  const contBot = document.createElement("div");
  contBot.style.cssText = `
    margin-top:20px;
    display:flex;
    justify-content:flex-end;
    gap:12px;
  `;

  const btnCancelar = document.createElement("button");
  btnCancelar.className = "boton-reserva-estandar";
  btnCancelar.textContent = "Cancelar";
  btnCancelar.onclick = () => {
    overlay.remove();
    if (base) base.style.display = "block";
    if (typeof limpiarHabitacionesSeleccionadas === "function") {
      limpiarHabitacionesSeleccionadas();
    }
  };

  const btnOk = document.createElement("button");
  btnOk.className = "boton-reserva-estandar";
  btnOk.textContent = "Continuar";
  btnOk.onclick = () => {
    overlay.remove();
    mostrarFormularioTitular(lista);
  };

  contBot.appendChild(btnCancelar);
  contBot.appendChild(btnOk);

  panel.appendChild(contBot);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

// ------------------------------------------------------------
// 4) FORMULARIO DE TITULAR
// ------------------------------------------------------------
function mostrarFormularioTitular(listaSeleccion) {
  const overlay = document.createElement("div");
  overlay.style.cssText = `
    position:fixed;
    inset:0;
    background:rgba(0,0,0,0.45);
    display:flex;
    align-items:center;
    justify-content:center;
    z-index:9999;
  `;

  const box = document.createElement("div");
  box.className = "formulario-datos-huesped";
  box.style.cssText = `
    width:90%;
    max-width:600px;
    background:white;
    padding:40px;
    border-radius:15px;
    box-shadow:0 8px 30px rgba(0,0,0,0.2);
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

  document.getElementById("btn-tit-cancelar").onclick = () => {
    overlay.remove();
    const base = document.querySelector(".contenedor-resultados");
    if (base) base.style.display = "block";
  };

  document.getElementById("btn-tit-confirmar").onclick = async () => {
    const nombre = document.getElementById("tit-nombre").value.trim();
    const apellido = document.getElementById("tit-apellido").value.trim();
    const telefono = document.getElementById("tit-telefono").value.trim();

    if (!nombre || !apellido || !telefono) {
      mensajeError("Complete todos los campos.");
      return;
    }

    // Acá delegamos TODO al director GestorReserva
    await GestorReserva.realizarReserva(listaSeleccion, { nombre, apellido, telefono });

    // Cierro el formulario (el resto de la UI se maneja desde los gestores)
    overlay.remove();
  };
}

// ------------------------------------------------------------
// Inicialización
// ------------------------------------------------------------
function inicializarReserva() {
  manejarBusqueda();
  manejarClickReservar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarReserva);
} else {
  inicializarReserva();
}
