// [JS/test.js]
function testFechas() {
  console.log("▶ Ejecutando testFechas()...");

  const desde = document.getElementById("fecha-desde");
  const hasta = document.getElementById("fecha-hasta");
  const form = document.querySelector("form");

  if (!desde || !hasta || !form) {
    console.error("❌ No se encontraron campos de fecha o formulario.");
    return;
  }

  // Setear fechas automáticamente
  desde.value = "2025-12-01";
  hasta.value = "2025-12-30";

  console.log("📅 Fechas seteadas: 01/12/2025 → 30/12/2025");

  // Disparar el submit del formulario automáticamente
  form.dispatchEvent(new Event("submit", { bubbles: true }));

  console.log("🔎 Ejecutando búsqueda automáticamente...");
}

// Ejecutar testFechas() con ALT + P
document.addEventListener("keydown", (e) => {
  // ALT + P
  if (e.altKey && e.key.toLowerCase() === "p") {
    e.preventDefault();
    console.log("⏩ Atajo ALT + P detectado → ejecutando testFechas()");
    testFechas();
  }
});

