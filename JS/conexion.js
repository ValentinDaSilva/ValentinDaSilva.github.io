let d = document;
export default function offline(){
    let $div1 = d.createElement("div"),
    $div2 = d.createElement("div"),
    $div3 = d.createElement("div");
    $div1.classList.add("offlineConteiner");
    $div2.classList.add("offline");
    $div3.classList.add("textOffline")
    $div2.innerHTML = `!`;
    $div3.innerHTML = `Conexion Perdida`;
    $div1.appendChild($div2);
    $div1.appendChild($div3);
    let primerElemento = document.body.firstChild;
    document.body.insertBefore($div1, primerElemento);
}

export function online(){
    eliminarPrimerHijoBody();
    let $div1 = d.createElement("div"),
    $div2 = d.createElement("div"),
    $div3 = d.createElement("div");
    $div1.classList.add("offlineConteiner");
    $div2.classList.add("offline");
    $div3.classList.add("textOffline")
    $div2.innerHTML = `✔️`;
    $div3.innerHTML = `Conexion Reestablecida`;
    $div2.style.backgroundColor = `rgba(66, 231, 0, 0.925)`;
    $div1.appendChild($div2);
    $div1.appendChild($div3);
    let primerElemento = document.body.firstChild;
    document.body.insertBefore($div1, primerElemento);
    setTimeout(()=> {eliminarPrimerHijoBody();},3000);
}

function eliminarPrimerHijoBody(){
    var body = document.body;
    var primerHijo = body.firstChild;

    // Verificar si el primer hijo es un nodo de tipo Element (para evitar nodos de texto u otros tipos)
    while (primerHijo && primerHijo.nodeType !== 1) {
        primerHijo = primerHijo.nextSibling;
    }

    if (primerHijo) {
    body.removeChild(primerHijo);
    }
}