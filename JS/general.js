/**
 * Convierte automáticamente el texto a mayúsculas en todos los campos de entrada de texto
 * Se aplica a: input type="text", textarea, email, tel, y otros campos de texto
 * Excluye: password, date, time, number, y otros tipos con formatos muy específicos
 */
function inicializarConversionMayusculas() {
    // Seleccionar inputs de texto (incluyendo email y tel)
    const inputsTexto = document.querySelectorAll('input[type="text"], input[type="search"], input[type="email"], input[type="tel"]');
    
    // Seleccionar textareas
    const textareas = document.querySelectorAll('textarea');
    
    // Función para convertir a mayúsculas preservando la posición del cursor
    function convertirAMayusculas(elemento) {
        const inicio = elemento.selectionStart;
        const fin = elemento.selectionEnd;
        const valorAnterior = elemento.value;
        
        // Convertir todo el valor a mayúsculas
        elemento.value = elemento.value.toUpperCase();
        
        // Restaurar posición del cursor
        // Si el valor cambió, ajustar la posición del cursor
        if (valorAnterior !== elemento.value) {
            const diferencia = elemento.value.length - valorAnterior.length;
            elemento.setSelectionRange(inicio + diferencia, fin + diferencia);
        } else {
            elemento.setSelectionRange(inicio, fin);
        }
    }
    
    // Aplicar a todos los inputs de texto
    inputsTexto.forEach(input => {
        input.addEventListener('input', function() {
            convertirAMayusculas(this);
        });
        
        // También convertir al pegar texto
        input.addEventListener('paste', function(e) {
            setTimeout(() => {
                convertirAMayusculas(this);
            }, 0);
        });
    });
    
    // Aplicar a todos los textareas
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            convertirAMayusculas(this);
        });
        
        // También convertir al pegar texto
        textarea.addEventListener('paste', function(e) {
            setTimeout(() => {
                convertirAMayusculas(this);
            }, 0);
        });
    });
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarConversionMayusculas);
} else {
    // Si el DOM ya está cargado, ejecutar inmediatamente
    inicializarConversionMayusculas();
}
