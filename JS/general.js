
function inicializarConversionMayusculas() {
    
    const inputsTexto = document.querySelectorAll('input[type="text"], input[type="search"], input[type="email"], input[type="tel"]');
    
    
    const textareas = document.querySelectorAll('textarea');
    
    
    function convertirAMayusculas(elemento) {
        const inicio = elemento.selectionStart;
        const fin = elemento.selectionEnd;
        const valorAnterior = elemento.value;
        
        
        elemento.value = elemento.value.toUpperCase();
        
        
        
        if (valorAnterior !== elemento.value) {
            const diferencia = elemento.value.length - valorAnterior.length;
            elemento.setSelectionRange(inicio + diferencia, fin + diferencia);
        } else {
            elemento.setSelectionRange(inicio, fin);
        }
    }
    
    
    inputsTexto.forEach(input => {
        input.addEventListener('input', function() {
            convertirAMayusculas(this);
        });
        
        
        input.addEventListener('paste', function(e) {
            setTimeout(() => {
                convertirAMayusculas(this);
            }, 0);
        });
    });
    
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            convertirAMayusculas(this);
        });
        
        
        textarea.addEventListener('paste', function(e) {
            setTimeout(() => {
                convertirAMayusculas(this);
            }, 0);
        });
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarConversionMayusculas);
} else {
    
    inicializarConversionMayusculas();
}
