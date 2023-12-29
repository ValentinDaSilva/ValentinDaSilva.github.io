const d = document;
export default function search($barraBuscador,$copiaCards){
    const $cardsContainer = d.querySelector(".cardContainer");//lista de tarjetas original
    const contenido = $barraBuscador.value;// contenido de
    let texto;
    while ($cardsContainer.firstChild) {
        $cardsContainer.removeChild($cardsContainer.firstChild);
    }
    for (const node of $copiaCards) {
        texto = node.textContent;
        texto = texto.trim();
        if(empiezaCon(texto,contenido)){
            $cardsContainer.appendChild(node);
        }
    }
}

function empiezaCon(string, comienzo){
    string = string.toLowerCase();
    comienzo = comienzo.toLowerCase();
    function analizarString(string,comienzo){
        if(comienzo == '') return true;
        else if (string[0] == comienzo[0]) return analizarString(string.substring(1),comienzo.substring(1));
        else return false;
    }
    return analizarString(string,comienzo);
}