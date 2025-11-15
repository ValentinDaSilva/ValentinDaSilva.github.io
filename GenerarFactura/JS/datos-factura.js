/* Datos y lógica de factura */

/**
 * Función auxiliar para manipular elementos del DOM
 * @param {string} id - ID del elemento
 * @param {string} atributo - Atributo a modificar (opcional)
 * @param {string} valor - Valor del atributo (opcional)
 * @returns {HTMLElement} - El elemento encontrado
 */
function $(id, atributo, valor) {
  let elemento = document.querySelector(id);
  if (atributo && valor) {
    console.log("Elemento: ", elemento);
    if (atributo in elemento.style) {
      elemento.style[atributo] = valor;
    } else {
      elemento.setAttribute(atributo, valor);
    }
  }
  return elemento;
}




