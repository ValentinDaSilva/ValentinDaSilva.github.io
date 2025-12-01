// [JS/leyenda.js]
function mostrarLeyenda() {
  const resultado = document.querySelector('.contenedor-resultados');
  if (!resultado) return;

  // Ocultar contenido real
  resultado.style.display = "none";

  // Overlay por encima de todo
  const overlay = document.createElement("div");
  overlay.className = "overlay-leyenda";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  `;

  // Caja principal
  const box = document.createElement("div");
  box.className = "leyenda-box";
  box.style.cssText = `
    position: relative;
    background: white;
    padding: 30px;
    border-radius: 15px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 8px 20px rgba(0,0,0,0.25);
    color: #412c26;
  `;

  box.innerHTML = `
    <span class="icono-cerrar-leyenda">&times;</span>

    <fieldset class="leyenda-section">
      <h3>Estados de habitaciones:</h3>

      <div class="item-leyenda"><div class="caja-color color-libre"></div> Libre</div>
      <div class="item-leyenda"><div class="caja-color color-ocupada"></div> Ocupada</div>
      <div class="item-leyenda"><div class="caja-color color-reservada"></div> Reservada</div>
      <div class="item-leyenda"><div class="caja-color color-seleccionada"></div> Seleccionada</div>
      <div class="item-leyenda"><div class="caja-color color-fuera-servicio"></div> Fuera de Servicio</div>
    </fieldset>

    <fieldset class="leyenda-section" style="margin-top:20px;">
      <h3>Tipos de Habitación</h3>
      <p>IND → Individual</p>
      <p>DOBE → Doble Estándar</p>
      <p>DOBS → Doble Superior</p>
      <p>DOBL → Doble (sin categoría)</p>
      <p>FAM → Family Plan</p>
      <p>SUITE → Suite Doble</p>
    </fieldset>
  `;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  // Evento cerrar
  const btnCerrar = box.querySelector(".icono-cerrar-leyenda");
  btnCerrar.style.cssText = `
    position:absolute;
    top:10px;
    right:15px;
    font-size:32px;
    color:#64443a;
    cursor:pointer;
  `;

  btnCerrar.onclick = () => {
    overlay.remove();
    resultado.style.display = "block";
  };
}

function inicializarLeyenda() {
  const icono = document.querySelector('.icono-informacion');
  if (icono) icono.onclick = mostrarLeyenda;
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", inicializarLeyenda);
} else {
  inicializarLeyenda();
}



