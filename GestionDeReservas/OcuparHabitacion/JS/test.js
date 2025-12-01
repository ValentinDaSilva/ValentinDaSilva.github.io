// ====================================================
//   test.js - Carga automática de fechas con Alt + P
// ====================================================

document.addEventListener('keydown', function(event) {
  // Verificar si se presionó Alt + P
  if (event.altKey && event.key === 'p') {
    event.preventDefault(); // Evitar comportamiento por defecto
    
    // Obtener los campos de fecha
    const desdeInput = document.getElementById('desde');
    const hastaInput = document.getElementById('hasta');
    const form = document.getElementById('form-ocupar');
    
    if (!desdeInput || !hastaInput) {
      console.warn('No se encontraron los campos de fecha');
      return;
    }
    
    // Establecer las fechas: 01-12-2025 hasta 31-12-2025
    // Formato para input type="date": YYYY-MM-DD
    desdeInput.value = '2025-12-01';
    hastaInput.value = '2025-12-31';
    
    console.log('✅ Fechas cargadas automáticamente: 01/12/2025 - 31/12/2025');
    
    // Opcional: disparar el submit del formulario para generar la tabla automáticamente
    if (form) {
      // Crear y disparar un evento submit
      const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(submitEvent);
    }
  }
});

