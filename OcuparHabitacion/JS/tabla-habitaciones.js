/* Gestión de la tabla de habitaciones y estados */

/**
 * Aplica los estilos correspondientes a las celdas según su estado
 */
function aplicarEstilosCeldas() {
  const celdas = document.querySelectorAll('.tabla-habitaciones td');
  celdas.forEach(celda => {
    // Si está seleccionada, mantener el amarillo
    if (celda.classList.contains('estado-seleccionada') || celda.style.backgroundColor === 'yellow') {
      celda.style.backgroundColor = 'yellow';
      return;
    }
    
    const claseEstado = celda.className.trim();
    
    switch (claseEstado) {
      case 'estado-libre':
        celda.style.backgroundColor = '#c3e6cb';
        celda.style.color = '#155724';
        break;
      case 'estado-ocupada':
        celda.style.backgroundColor = '#f5c6cb';
        celda.style.color = '#721c24';
        break;
      case 'estado-reservada':
        celda.style.backgroundColor = '#ffeeba';
        celda.style.color = '#856404';
        break;
      case 'estado-fuera-servicio':
        celda.style.backgroundColor = '#c6c8ca';
        celda.style.color = '#383d41';
        break;
    }
  });
}

// Inicializar estilos cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', aplicarEstilosCeldas);
} else {
  aplicarEstilosCeldas();
}

