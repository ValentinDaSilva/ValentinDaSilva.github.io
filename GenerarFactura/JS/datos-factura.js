


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






