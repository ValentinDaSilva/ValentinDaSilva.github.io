document.getElementById('Conversion').addEventListener('click', () => showContainer('conversor'));
document.getElementById('Johnson').addEventListener('click', () => showContainer('johnson'));
document.getElementById('Gray').addEventListener('click', () => showContainer('gray'));
document.getElementById('Suma').addEventListener('click', () => showContainer('suma'));
document.getElementById('Resta').addEventListener('click', () => showContainer('resta'));
document.getElementById('Multiplicacion').addEventListener('click', () => showContainer('multiplicacion'));
document.getElementById('Division').addEventListener('click', () => showContainer('division'));
document.getElementById('Hamming').addEventListener('click', () => showContainer('hamming'));
document.getElementById('SumaBCDN').addEventListener('click', () => showContainer('sumaBCDN'));
document.getElementById('RestaBCDN').addEventListener('click', () => showContainer('restaBCDN'));
document.getElementById('SumaBCDEx3').addEventListener('click', () => showContainer('sumaBCDEx3'));
document.getElementById('RestaBCDEx3').addEventListener('click', () => showContainer('restaBCDEx3'));

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if(document.getElementById("conversor").style.display == 'block') conversion();
        else if(document.getElementById("johnson").style.display == 'block') codigoJohnson();
        else if(document.getElementById("gray").style.display == 'block') codigoGray();
        else if(document.getElementById("suma").style.display == 'block') sumaBinaria();
        else if(document.getElementById("resta").style.display == 'block') restaBinaria();
        else if(document.getElementById("multiplicacion").style.display == 'block') multiplicacionBinaria();
        else if(document.getElementById("division").style.display == 'block') dividirDosNumeros();
        else if(document.getElementById("hamming").style.display == 'block') calcularCodigoHamming();
        else if(document.getElementById("sumaBCDN").style.display == 'block') sumaBCDN();
        else if(document.getElementById("restaBCDN").style.display == 'block') restaBCDN();
        else if(document.getElementById("sumaBCDEx3").style.display == 'block') sumaBCDEx3();
        else if(document.getElementById("restaBCDEx3").style.display == 'block') restaBCDEx3();
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('jonhson1').value = "16";
    document.getElementById('gray1').value = "16";
    document.getElementById('numeroInput1').value = "1011110,101";
    document.getElementById('numeroInput2').value = "110101,01";
    document.getElementById('numeroResta1').value = "1100";
    document.getElementById('numeroResta2').value = "1010";
    document.getElementById('numeroMultiplicar1').value = "1010";
    document.getElementById('numeroMultiplicar2').value = "111";
    document.getElementById('numeroDividir1').value = "1010010.01";
    document.getElementById('numeroDividir2').value = " 110.1";
    document.getElementById('numeroHamming').value = "1010";
    document.getElementById('sumaBCDN1').value = "1001 0100. 0011"; //94,3 + 44,5 
    document.getElementById('sumaBCDN2').value = "0100 0100. 0101";
    document.getElementById('restaBCDN1').value = "0100 1000"; // 48 - 98,2
    document.getElementById('restaBCDN2').value = "1001 1000. 0010";
    document.getElementById('sumaBCDEx31').value = "0111 1011"; // 48 + 98,2
    document.getElementById('sumaBCDEx32').value = "1100 1011. 0100";
    document.getElementById('restaBCDEx31').value = "0101 0110. 1010";
    document.getElementById('restaBCDEx32').value = "0100 1100";
});


function showContainer(containerId) {
    document.getElementById('menuContainer').style.display = 'none';
    document.querySelector('.contenedorGrande').style.display = 'flex'
    document.getElementById(containerId).style.display = 'block';
    document.getElementById('Atras').style.display = 'block';
    document.querySelector(`#${containerId} .converter input`).focus();
    eliminarTodosLosHijos("pasos");
}

function goBackToMenu() {
    document.getElementById('menuContainer').style.display = 'flex';
    const containers = document.querySelectorAll('.contenedorGrande .container');
    document.querySelector('.contenedorGrande').style.display = 'none';
    containers.forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById("pasos").style.display = "none";
    document.getElementById('Atras').style.display = 'none';
}

function convertirDeLetraANumero(letra){
    switch(letra){
        case 'A': return 10;
        case 'B': return 11;
        case 'C': return 12;
        case 'D': return 13;
        case 'E': return 14;
        case 'F': return 15;
        default: return letra;
    }
}

function convertirDeNumeroALetra(numero){
    switch(numero){
        case '10': return 'A';
        case '11': return 'B';
        case '12': return 'C';
        case '13': return 'D';
        case '14': return 'E';
        case '15': return 'F';
        default: return numero;
    }
}

function eliminarCerosFinal(cadena){
    if(cadena.includes(".")){
        let indiceFinal = cadena.length - 1;
        while(cadena[indiceFinal] == "0" || cadena[indiceFinal] == "."){
            cadena = cadena.substr(0,indiceFinal);
            indiceFinal--;
        }
    }
    return cadena;
}

function eliminarCerosInicio(cadena){
    while(cadena[0] == "0"){
        cadena = cadena.substr(1);
    }
    return cadena;
}

function agregar0Adelante(cadena){
    cadena = "0" + cadena;
    return cadena;
}

function agregar0Atras(cadena){
    cadena = cadena + "0";
    return cadena;
}

function parteEntera(cadena){
    if(cadena.includes(".")){
        cadena = cadena.substr(0,cadena.indexOf("."));
    }
    return cadena;
}

function parteDecimal(cadena){
    if(cadena.includes(".")){
        cadena = cadena.substr(cadena.indexOf(".") + 1);
    }else{
        cadena = "";
    }
    return cadena;
}

function convertirDecimalAOtro(origen,base){
    let resultado = "";
    function convertirParteDecimal(numero, base){
        resultado += ".";
            //Se supone que ya me da el numero como un float
            let contador = 0;
            numero = numero - parseInt(numero);
            while(contador < 3){
                let multiplicacion = numero * base;
                resultado += parseInt(multiplicacion).toString();
                numero = multiplicacion - parseInt(multiplicacion);  
                contador++;
            }
    }
    //ParteEntera
    function convertirParteEntera(numero,base){
        if(numero < base){
            if(numero >= 10 && numero <= 15){
                resultado += convertirDeNumeroALetra(numero.toString());
            }
            else resultado += numero.toString();
        }else{
            convertirParteEntera(parseInt(numero/base),base);
            resultado += (numero%base).toString();
        }
    }
    convertirParteEntera(parseInt(origen),parseInt(base));
    if(origen.includes(".")) convertirParteDecimal(parseFloat(origen),parseInt(base));
    resultado = eliminarCerosFinal(resultado);
    return resultado;
}

function convertirDeOtroADecimal(numero, baseOrigen){
    baseOrigen = parseInt(baseOrigen);
    let ultimoIndice = numero.length - 1, resultado = 0, potencia;
    if(numero.includes(".")) potencia = numero.substr(0,numero.indexOf(".")).length-1;
    else potencia = numero.length - 1;
    for (let i = 0; i < numero.length; i++){
        if(numero[i] != "."){
            let digito = numero[i];
            digito = convertirDeLetraANumero(digito);
            resultado += parseInt(digito)*Math.pow(baseOrigen,potencia);
            potencia--;
        }
    }
    resultado = resultado.toString();
    return resultado;
}

function conversion(){
    let valorOrigen = modificarEntrada(document.getElementById("numeroInput").value),
        baseOrigen = modificarEntrada(document.getElementById("baseOrigen").value),
        baseDestino = modificarEntrada(document.getElementById("baseDestino").value),
        resultado;
    if(baseOrigen == 10) resultado = convertirDecimalAOtro(valorOrigen,baseDestino);
    else if(baseDestino == 10) resultado = convertirDeOtroADecimal(valorOrigen,baseOrigen);
    else{
        resultado = convertirDeOtroADecimal(valorOrigen,baseOrigen);
        resultado = convertirDecimalAOtro(resultado,baseDestino);
    }
    document.getElementById("resultadoOutput").innerHTML = "Resultado: "+resultado;
}

function XOR(n1,n2){
    n1 = parseInt(n1);
    n2 = parseInt(n2);
    if(n1 == 1 && n2 == 0) return 1;
    if(n1 == 0 && n2 == 1) return 1;
    else return 0;
}

function sumarDosDigitosBinarios(n1,n2,n3){
    n1 = parseInt(n1);
    n2 = parseInt(n2);
    n3 = parseInt(n3);
    let resultado1 = XOR(n1,n2);
    let resultado = XOR(resultado1,n3);
    let acarreo1 = (n1 && n2)? 1 : 0;
    let acarreo2 = (resultado1 && n3)? 1 : 0;
    let acarreo = (acarreo1 || acarreo2)? 1:0;
    return {acarreo,resultado};
}

function cantLugaresDespuesDeLaComa(cadena){
    let ultimoIndice = cadena.length - 1;
    let contador = 0;
    if(cadena.includes(".")){
        while(cadena[ultimoIndice] !== "."){
            contador++;
            ultimoIndice--;
        }
    }
    return contador;
}

function cantLugaresAntesDeLaComa(cadena){
    let contador = 0;
    while(cadena[contador] != ".") contador++;
    return contador;
}

function borrarComa(cadena){
    if(cadena.includes(".")) 
        return cadena.substr(0,cadena.indexOf("."))+cadena.substr(cadena.indexOf(".")+1);
    else 
        return cadena;
}

function sumarDosNumerosBinarios(n1,n2){
    let lugaresComa = Math.max(cantLugaresDespuesDeLaComa(n1),cantLugaresDespuesDeLaComa(n2));
    let resultado = "", acarreoAnterior = 0;
    if(n1.includes(".") && !n2.includes(".")) n2+=".";
    if(!n1.includes(".") && n2.includes(".")) n1+=".";
    while(parteEntera(n1).length < parteEntera(n2).length) n1 = agregar0Adelante(n1);
    while(parteEntera(n2).length < parteEntera(n1).length) n2 = agregar0Adelante(n2);
    while(parteDecimal(n1).length < parteDecimal(n2).length) n1 = agregar0Atras(n1);
    while(parteDecimal(n2).length < parteDecimal(n1).length) n2 = agregar0Atras(n2);
    n1 = borrarComa(n1);
    n2 = borrarComa(n2);
    let ultimoIndice = n1.length - 1;
    let sumando1 = "", sumando2 = "", resultadoMostrado = "";
    while(ultimoIndice >= 0){
        let aux = sumarDosDigitosBinarios(n1[ultimoIndice],n2[ultimoIndice],acarreoAnterior);
        if(acarreoAnterior == "0"){
             sumando1 = `${n1[ultimoIndice]} ${sumando1}`;
             sumando2 = `${n2[ultimoIndice]} ${sumando2}`;
             resultadoMostrado = `${aux.resultado} ${resultadoMostrado}`;
        }
        else{
            sumando1 = `${n1[ultimoIndice]} <sup>${acarreoAnterior}</sup> ${sumando1} `;
            sumando2 = `${n2[ultimoIndice]} <sup style="visibility: hidden;">${acarreoAnterior}</sup> ${sumando2} `;
            resultadoMostrado = `${aux.resultado} <sup style="visibility: hidden;">${acarreoAnterior}</sup> ${resultadoMostrado} `;
        } 
        
        resultado = aux.resultado + resultado; 
        acarreoAnterior = aux.acarreo;
        ultimoIndice--;
    }
    let aux = "", longitud = resultado.length - 1;
    if(lugaresComa != 0){
        while(longitud >= 0){
            if(lugaresComa !=0){
                aux = resultado[longitud] + aux;
                longitud--;
                lugaresComa--;
            }else{
                aux = "." + aux;
                lugaresComa--;
            }
        }
        resultado = aux;
    }
    eliminarTodosLosHijos("pasos");
    if(acarreoAnterior == "1" && document.getElementById("suma").style.display == "block"){
        sumando1 = `0 <sup>${acarreoAnterior}</sup> ${sumando1} `;
        sumando2 = `0 <sup style="visibility: hidden;">${acarreoAnterior}</sup> ${sumando2} `;
        resultadoMostrado = `${acarreoAnterior} <sup style="visibility: hidden;">${acarreoAnterior}</sup> ${resultadoMostrado}`;
    }else if(acarreoAnterior == "1" && document.getElementById("resta").style.display == "block"){
        sumando1 = `<sup style="visibility: hidden;">${acarreoAnterior}</sup> ${sumando1} `;
        sumando2 = `<sup style="visibility: hidden;">${acarreoAnterior}</sup> ${sumando2} `;
        resultadoMostrado = `<sup><s>${acarreoAnterior}</s></sup> ${resultadoMostrado}`;
    }
    document.getElementById("pasos").style.display ="block";
    let vector = ["<b>Pasos de la operacion: </b>",sumando1,sumando2,"---------------------",resultadoMostrado];
    vector.forEach((elem)=>{
        let elementoP = document.createElement("p");
        elementoP.innerHTML = elem;
        document.getElementById("pasos").appendChild(elementoP);
    })
    return {resultado,acarreo:acarreoAnterior};
}

function sumaBinaria(){
    let numero1 = modificarEntrada(document.getElementById("numeroInput1").value),
        numero2 = modificarEntrada(document.getElementById("numeroInput2").value),
        resultado = sumarDosNumerosBinarios(numero1,numero2);
    if(resultado.acarreo != "0"){
        document.getElementById("resultadoOutput2").innerHTML = "Resultado: "+resultado.acarreo+resultado.resultado;
    }
    else {
        document.getElementById("resultadoOutput2").innerHTML = "Resultado: "+resultado.resultado;
    }
}

function CA2(n1){
    //Se supone que ya se le agregaron todos los ceros adelante y atras que se necesitan.
    let lugaresComa = cantLugaresDespuesDeLaComa(n1);
    n1 = borrarComa(n1);
    let resultado = "";
    for(let i = 0; i < n1.length; i++){
        resultado += (n1[i] == "1")? "0" : "1";
    }
    let aux = sumarDosNumerosBinarios(resultado,"1");
    resultado = aux.resultado;
    aux = "", longitud = resultado.length - 1;
    if(lugaresComa != 0){
        while(longitud >= 0){
            if(lugaresComa !=0){
                aux = resultado[longitud] + aux;
                longitud--;
                lugaresComa--;
            }else{
                aux = "." + aux;
                lugaresComa--;
            }
        }
        resultado = aux;
    }
    return resultado;
}

function restarDosNumerosBinarios(n1,n2){
    if(n1.includes(".") && !n2.includes(".")) n2+=".";
    if(!n1.includes(".") && n2.includes(".")) n1+=".";
    while(parteEntera(n1).length < parteEntera(n2).length) n1 = agregar0Adelante(n1);
    while(parteEntera(n2).length < parteEntera(n1).length) n2 = agregar0Adelante(n2);
    while(parteDecimal(n1).length < parteDecimal(n2).length) n1 = agregar0Atras(n1);
    while(parteDecimal(n2).length < parteDecimal(n1).length) n2 = agregar0Atras(n2);
    n2 = CA2(n2);
    let suma = sumarDosNumerosBinarios(n1,n2);
    return {resultado:suma.resultado,acarreo:suma.acarreo};
}

function restaBinaria(){
    let numero1 = modificarEntrada(document.getElementById("numeroResta1").value),
        numero2 = modificarEntrada(document.getElementById("numeroResta2").value),
        resultado = restarDosNumerosBinarios(numero1,numero2);
        document.getElementById("resultadoOutput3").innerHTML = "Resultado: " + resultado.resultado;
        if(resultado.acarreo == "0") document.getElementById("resultadoOutput4").innerHTML = "(Negativo)";
        else document.getElementById("resultadoOutput4").innerHTML = "(Positivo)";
}

function agregarNCeros(cadena,cantidad){
    let aux = cadena;
    for(let i = 0; i < cantidad; i++){
        aux += '0';
    }
    return aux;
}

function multiplicarDosNumeros(n1,n2){
    n1 = eliminarCerosFinal(n1);
    n2 = eliminarCerosFinal(n2);
    let cantPosiciones = cantLugaresDespuesDeLaComa(n1) + cantLugaresDespuesDeLaComa(n2);
    n1 = borrarComa(n1);
    n2 = borrarComa(n2);
    let longitudN2 = n2.length, resultado = "0", cantCeros = 0;
    let vectorMostrar = ["<b>Pasos para la multiplicacion: </b>",`${n1}`,`X ${n2}`,"-----------------"];
    while(longitudN2 > 0){
        if(n2[longitudN2 - 1] == "1"){
            let n1ConCeros = agregarNCeros(n1,cantCeros);
            vectorMostrar.push(n1ConCeros);
            let aux = sumarDosNumerosBinarios(resultado,n1ConCeros);
            resultado =  (aux.acarreo == "1")? aux.acarreo + aux.resultado : aux.resultado;
        }
        cantCeros++;
        longitudN2--;
    }
    let aux = "", longitud = resultado.length - 1;
    if(cantPosiciones != 0){
        while(longitud >= 0){
            if(cantPosiciones !=0){
                aux = resultado[longitud] + aux;
                longitud--;
                cantPosiciones--;
            }else{
                aux = "." + aux;
                cantPosiciones--;
            }
        }
        resultado = aux;
    }
    vectorMostrar.push("-----------------"); vectorMostrar.push(resultado);
    eliminarTodosLosHijos("pasos");
    vectorMostrar.forEach((elem,indice)=>{
        let elemento = elem;
        if(indice > 3 && EntradaBinaria(elemento)) while(elemento.length < resultado.length) elemento = "0" + elemento;
        let elementoP = document.createElement("p");
        elementoP.innerHTML = elemento;
        document.getElementById("pasos").appendChild(elementoP);
    })
    document.getElementById("pasos").style.display = "block";
    return resultado;
}

function EntradaBinaria(cadena){
    for(let i = 0; i < cadena.length; i++){
        if(cadena[i] != "0" && cadena[i]!="1") return false;
    }
    return true;
}

function eliminarTodosLosHijos(ID){
    const elemento = document.getElementById(ID);
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function multiplicacionBinaria(){
    let numero1 = modificarEntrada(document.getElementById("numeroMultiplicar1").value),
        numero2 = modificarEntrada(document.getElementById("numeroMultiplicar2").value),
        resultado = multiplicarDosNumeros(numero1,numero2);
        document.getElementById("resultadoOutput5").innerHTML = "Resultado: "+resultado;
}

function binaryToDecimal(binary) {
    return parseInt(binary, 2);
}

function decimalToBinary(decimal) {
    // Convertimos la parte entera
    let integerPart = Math.floor(decimal);
    let binaryIntegerPart = integerPart.toString(2);

    // Convertimos la parte fraccionaria
    let fractionalPart = decimal - integerPart;
    let binaryFractionalPart = '';

    let count = 0;
    while (fractionalPart !== 0 && count < 2) {
        fractionalPart *= 2;
        if (fractionalPart >= 1) {
            binaryFractionalPart += '1';
            fractionalPart -= 1;
        } else {
            binaryFractionalPart += '0';
        }
        count++;
    }

    return binaryFractionalPart.length > 0 ? `${binaryIntegerPart}.${binaryFractionalPart}` : binaryIntegerPart;
}

// Función para dividir dos números binarios y obtener el resultado en binario
function dividirDosNumeros(bin1, bin2) {
    
	if(bin1 === undefined) bin1 = parseFloat(document.getElementById("numeroDividir1").value);
    if(bin2 === undefined) bin2 = parseFloat(document.getElementById("numeroDividir2").value);
    while(bin1.toString().includes(".") || bin2.toString().includes(".")){
        bin1 = bin1 * 10;
        bin2 = bin2 * 10;
    }
    let resultado = division(bin1.toString(),bin2.toString());

	document.getElementById("resultadoOutput6").innerHTML = "Resultado: "+resultado;
    return resultado;
}

function esPotenciaDeDos(n) {
    if (n <= 0) {
        return false;
    }
    return (n & (n - 1)) === 0;
}

function calcularCodigoHamming(numero){
    //Calcular cantidad de bits totales y bits de paridad
    if(numero == undefined) numero = document.getElementById("numeroHamming").value;
    if(numero.includes(" ") || numero.includes(".") || numero.includes(",")){
        alert("Los datos de entrada no son validos");
        return "";
    }
    let vectorMostrar = [`<b>Pasos para calcular codigo Hamming de ${numero}</b>`];
    let bitsTotales = numero.length, bitsParidad = 0;
    while(Math.pow(2,bitsParidad) < numero.length + bitsParidad + 1){
        bitsParidad++; bitsTotales++;
    }
    vectorMostrar.push(`2<sup>${bitsParidad}</sup> &ge; ${numero.length} + ${bitsParidad} + 1`);
    let numFinal = new Array(bitsTotales), i = 0;
    for(let i = bitsTotales, w = 0, j = 0; i >= 1; i--, w++){
        if(!esPotenciaDeDos(i)){
            numFinal[w] = numero[j];
            j++;
        }
    }
    let cadenaAux = "Numeros acomodados: ";
    for(let i = 0; i < numFinal.length; i++){
        let elem = numFinal[i];
        if(elem != undefined){
            cadenaAux += `<u>${elem}</u> `;
        }else{
            cadenaAux += `<b>_</b> `;
        }
    }
    vectorMostrar.push(cadenaAux);
    let contador = 1, vueltas = 0;
    numFinal = numFinal.reverse();
    let vectorMostrarAuxiliar = [];
    let vectorMostrarAuxiliar2 = [];
    do{
        let posicionVector = 0, bit = 0;
            let arrayAux = new Array(bitsTotales+1);
        while(posicionVector <= bitsTotales){
            for(let i = 0; i < contador && posicionVector <= bitsTotales; i++){
                arrayAux[posicionVector] = 0;
                posicionVector++;
            }
            for(let i = 0; i < contador && posicionVector <= bitsTotales; i++){
                arrayAux[posicionVector] = 1;
                posicionVector++;
            }
        }
        arrayAux = arrayAux.slice(1);
        let bitC = `c${contador} = `;
        let bitCConNumeros = `c${contador} = `;
        for(let i = 0; i < arrayAux.length; i++){
            if(arrayAux[i] == 1){
                bit = XOR(bit,parseInt(numFinal[i]));
                let posicion = `b${i+1} ⊕ `;
                bitC += posicion;
                if(numFinal[i] != undefined){
                    let posicion2 = `${numFinal[i]} ⊕ `;
                    bitCConNumeros += posicion2;
                }else{
                    bitCConNumeros += posicion;
                }
            }
        }
        bitC = bitC.substring(0,bitC.length - 3);
        bitCConNumeros = bitCConNumeros.substring(0,bitC.length - 3);
        vectorMostrar.push(bitC);
        vectorMostrarAuxiliar.push(bitCConNumeros);
        numFinal[contador-1] = (bit == false)? "0": "1";
        vectorMostrarAuxiliar2.push(`b${contador} = ${(bit == false)? "0": "1"}`);
        contador*=2;
        vueltas++;
    }while(vueltas < bitsParidad);
    vectorMostrar.push("<br>");
    vectorMostrar = vectorMostrar.concat(vectorMostrarAuxiliar);
    vectorMostrar.push("<br>");
    vectorMostrar = vectorMostrar.concat(vectorMostrarAuxiliar2);
    vectorMostrar.push("<br>");
    vectorMostrar.push(`Numero Final: ${[numFinal.reverse().join(' ')]}`);
    eliminarTodosLosHijos("pasos");
    vectorMostrar.forEach((elem,indice)=>{
        let elementoP = document.createElement("p");
        elementoP.innerHTML = elem;
        document.getElementById("pasos").appendChild(elementoP);
    })
    document.getElementById("pasos").style.display = "block";
    document.getElementById("resultadoOutput7").innerHTML = "Resultado: " + numFinal.join(' ');
    return numFinal.join(' ');
}

function sumarDosDigitosBCDN(n1,n2,acarreo){
    if(n1.length != 4 || n2.length != 4) alert("El numero de digitos debe ser si o si 4");
    else{
        let acarreoAtras = false;
        let acarreoAdelante = false;
        let N1Mostrar = n1;
        let N2Mostrar = n2;
        let R1Mostrar = "";
        let R2Mostrar = "";
        let ResultadoMostrar = "";
        let hayAcarreoInicial = (acarreo == "0000")? false:true;
        if(hayAcarreoInicial){
            N1Mostrar += `<sup>1</sup>`;
            N2Mostrar += `<sup style="visibility: hidden;">1</sup>`;
            R1Mostrar += `<sup style="visibility: hidden;">1</sup>`;
            R2Mostrar += `<sup style="visibility: hidden;">1</sup>`;
            ResultadoMostrar = `<sup style="visibility: hidden;">1</sup>`;
            acarreoAtras = true;
        }
        let aux = sumarDosNumerosBinarios(n2,acarreo),
            suma = aux.resultado;
            aux = sumarDosNumerosBinarios(suma,n1);
            suma = aux.resultado;
            let auxResultado = suma;
            if(aux.acarreo == 1){
                N1Mostrar = `<sup style="visibility: hidden;">1</sup>` + N1Mostrar;
                N2Mostrar = `<sup style="visibility: hidden;">1</sup>` + N2Mostrar;
                R1Mostrar = `<sup>1</sup>` + suma + R1Mostrar;
                R2Mostrar = `<sup style="visibility: hidden;">1</sup>` + R2Mostrar;
                ResultadoMostrar = `<sup style="visibility: hidden;">1</sup>` + ResultadoMostrar;
                acarreoAdelante = true;
            }else{
                R1Mostrar = suma + R1Mostrar;
            }
            let acarreoFinal1 = aux.acarreo,
            acarreoFinal2 = "0";
            if(parseInt(suma) > 1001 || acarreoFinal1 == "1"){
                aux = sumarDosNumerosBinarios(suma,"0110");
                suma = aux.resultado;
                acarreoFinal2 = aux.acarreo;
                if(acarreoAdelante){
                    let indice = R2Mostrar.indexOf("</sup>") + 5;
                    R2Mostrar = R2Mostrar.substring(0,indice+1)+"0110"+R2Mostrar.substring(indice+1)
                }else{
                    R2Mostrar = "0110" + R2Mostrar;
                }
            }else{
                if(acarreoAdelante){
                    let indice = R2Mostrar.indexOf("</sup>") + 5;
                    R2Mostrar = R2Mostrar.substring(0,indice+1)+"0000"+R2Mostrar.substring(indice+1);
                }else{
                    R2Mostrar = "0000" + R2Mostrar;
                }
            }
        if(acarreoAdelante){
            let indice = R2Mostrar.indexOf("</sup>") + 5;
                ResultadoMostrar = ResultadoMostrar.substring(0,indice+1)+suma+ResultadoMostrar.substring(indice+1)
        }else{
            ResultadoMostrar = suma + ResultadoMostrar;
        }
        let acarreoFinal = (acarreoFinal1 == "1" || acarreoFinal2 == "1")? "1":"0";
        if(acarreoAdelante && acarreoFinal2 == "1"){
            reemplazarPrimera(resultadoFinal,`<sup style="visibility: hidden;">1</sup>`,`<sup>1</sup>`);
        }else if(!acarreoAdelante && acarreoFinal2 == "1"){
            N1Mostrar = `<sup style="visibility: hidden;">1</sup>` + N1Mostrar;
            N2Mostrar = `<sup style="visibility: hidden;">1</sup>` + N2Mostrar;
            R1Mostrar = `<sup style="visibility: hidden;">1</sup>` + R1Mostrar;
            R2Mostrar = `<sup style="visibility: hidden;">1</sup>` + R2Mostrar;
            ResultadoMostrar = `<sup>1</sup>` + ResultadoMostrar;
        }
        SumaBCDNvectorMostrarL1.unshift(N1Mostrar);
        SumaBCDNvectorMostrarL2.unshift(N2Mostrar);
        SumaBCDNvectorMostrarL3.unshift(R1Mostrar);
        SumaBCDNvectorMostrarL4.unshift(R2Mostrar);
        SumaBCDNvectorMostrarL5.unshift(ResultadoMostrar);
        let auxiliar = "";
        for(let i = 0; i < ResultadoMostrar.length; i++){
            if(ResultadoMostrar[i] != "1"){
                auxiliar += ResultadoMostrar[i];
            }else if(ResultadoMostrar[i] == "1"){
                auxiliar += "0";
            }
        }
        uno.unshift(reemplazarTodaOcurrencia(auxiliar,"<sup>",`<sup style="visibility:hidden;">`));
        return {resultado:suma,acarreoFinal};
    } 
}

function reemplazarPrimera(cadena, palabra1, palabra2) {
    let indice = cadena.indexOf(palabra1);
    if (indice !== -1) {
        return cadena.slice(0, indice) + palabra2 + cadena.slice(indice + palabra1.length);
    }
}

function reemplazarTodaOcurrencia(cadena, palabra1, palabra2) {
    let indice = cadena.indexOf(palabra1);
    while (cadena.indexOf(palabra1) !== -1) {
        cadena = cadena.slice(0, indice) + palabra2 + cadena.slice(indice + palabra1.length);
    }
    return cadena;
}

function tieneComa(n1){
    return (n1.includes("."));
}

var SumaBCDNvectorMostrarL1 = [];
var SumaBCDNvectorMostrarL2 = [];
var SumaBCDNvectorMostrarL3 = [];
var SumaBCDNvectorMostrarL4 = [];
var SumaBCDNvectorMostrarL5 = [];

function sumarDosNumerosBCDN(n1,n2){
        SumaBCDNvectorMostrarL1 = [];
        SumaBCDNvectorMostrarL2 = [];
        SumaBCDNvectorMostrarL3 = [];
        SumaBCDNvectorMostrarL4 = [];
        SumaBCDNvectorMostrarL5 = [];
        
        let acarreoAnterior = "0000", resultado = "";
        if(tieneComa(n1) && !tieneComa(n2)) n2 += ".";
        if(!tieneComa(n1)  && tieneComa(n2)) n1 += ".";
        if(tieneComa(n1)  || tieneComa(n2)){
            let parteDecimalN1 = parteDecimal(n1),
                parteDecimalN2 = parteDecimal(n2);
            while(parteDecimalN1.length < parteDecimalN2.length){
                parteDecimalN1 = agregar0Atras(parteDecimalN1);
            } 
            while(parteDecimalN2.length < parteDecimalN1.length) {
                parteDecimalN2 = agregar0Atras(parteDecimalN2);
            }
            let ultimoIndice = parteDecimalN1.length - 1;
            while(ultimoIndice > 0){
                let contador = 0, digitoN1 = "", digitoN2 = "";
                while(contador < 4){
                    digitoN1 = parteDecimalN1[ultimoIndice] + digitoN1;
                    digitoN2 = parteDecimalN2[ultimoIndice] + digitoN2;
                    ultimoIndice--;
                    contador++;
                }
                let sumaAux = sumarDosDigitosBCDN(digitoN1,digitoN2,acarreoAnterior);
                resultado = sumaAux.resultado + resultado;
                acarreoAnterior = (sumaAux.acarreoFinal == "1")? "0001":"0000";
            }
            resultado = "." + resultado;
        }
        let parteEnteraN1 = parteEntera(n1),
        parteEnteraN2 = parteEntera(n2);
        while(parteEnteraN1.length < parteEnteraN2.length) parteEnteraN1 = agregar0Adelante(parteEnteraN1);
        while(parteEnteraN2.length < parteEnteraN1.length) parteEnteraN2 = agregar0Adelante(parteEnteraN2);
        let ultimoIndice = parteEnteraN1.length - 1;
        while(ultimoIndice > 0){
            let contador = 0, digitoN1 = "", digitoN2 = "";
            while(contador < 4){
                digitoN1 = parteEnteraN1[ultimoIndice] + digitoN1;
                digitoN2 = parteEnteraN2[ultimoIndice] + digitoN2;
                ultimoIndice--;
                contador++;
            }
            let sumaAux = sumarDosDigitosBCDN(digitoN1,digitoN2,acarreoAnterior);
            resultado = sumaAux.resultado + resultado;
            acarreoAnterior = (sumaAux.acarreoFinal == "1")? "0001":"0000";
        }
        let resultadoMostrar = resultado, cantGuiones = resultado.length;
        if(acarreoAnterior === "0001" && document.getElementById("sumaBCDN").style.display == "block"){
            SumaBCDNvectorMostrarL1.unshift(`0000<sup>1</sup>`);
            SumaBCDNvectorMostrarL2.unshift(`0000<sup style="visibility:hidden;">1</sup>`);
            SumaBCDNvectorMostrarL3.unshift(`0001<sup style="visibility:hidden;">1</sup>`);
            SumaBCDNvectorMostrarL4.unshift(`0000<sup style="visibility:hidden;">1</sup>`);
            SumaBCDNvectorMostrarL5.unshift(`0001<sup style="visibility:hidden;">1</sup>`);
            cantGuiones+=4;
        }
            eliminarTodosLosHijos("pasos");

            let elemento0 = document.createElement("p");
            elemento0.innerHTML = "<b>Pasos para realizar la operacion BCDN: </b>";
            document.getElementById("pasos").appendChild(elemento0);

            let elemento1 = document.createElement("p");
            elemento1.innerHTML = SumaBCDNvectorMostrarL1.join(" ");
            document.getElementById("pasos").appendChild(elemento1);

            let elemento2 = document.createElement("p");
            elemento2.innerHTML = SumaBCDNvectorMostrarL2.join(" ");
            document.getElementById("pasos").appendChild(elemento2);

            let elemento2_5 = document.createElement("p");
            let i = 0;
            while(i < cantGuiones * 2){
                elemento2_5.innerHTML += "-";
                i++;
            } 
            document.getElementById("pasos").appendChild(elemento2_5);

            let elemento3 = document.createElement("p");
            elemento3.innerHTML = SumaBCDNvectorMostrarL3.join(" ");
            document.getElementById("pasos").appendChild(elemento3);

            let elemento4 = document.createElement("p");
            elemento4.innerHTML = SumaBCDNvectorMostrarL4.join(" ");
            document.getElementById("pasos").appendChild(elemento4);

            let elemento4_5 = document.createElement("p");
            i = 0;
            while(i < cantGuiones * 2){
                elemento4_5.innerHTML += "-";
                i++;
            }
            document.getElementById("pasos").appendChild(elemento4_5);

            let elemento5 = document.createElement("p");
            elemento5.innerHTML = SumaBCDNvectorMostrarL5.join(" ");
            document.getElementById("pasos").appendChild(elemento5);

            document.getElementById("pasos").style.display = "block";
            
        return {resultado,acarreoFinal: acarreoAnterior};
}

function sumaBCDN(){
    let numero1 = modificarEntradaBCDN(document.getElementById("sumaBCDN1").value),
        numero2 = modificarEntradaBCDN(document.getElementById("sumaBCDN2").value);
        resultado = sumarDosNumerosBCDN(numero1,numero2);
        let resultadoFinal = "", vector;
        vector = dividirDeA4(resultado.resultado);
        vector.forEach((elem)=>{
            resultadoFinal += (elem+" ");
        })
        if(resultado.acarreoFinal == "0001") resultadoFinal = resultado.acarreoFinal + " " + resultadoFinal;
        document.getElementById("resultadoOutput8").innerHTML = "Resultado = " + resultadoFinal;
}

function dividirDeA4(cadena) {
    let array = [], longitudCadena = cadena.length, i = 0, posicionVector = 0;
    while(i < longitudCadena){
        array.push(cadena.slice(i,i+4));
        i+=4;
        if(cadena[i]=="."){
            array[posicionVector]+=".";
            i++;
        }
        posicionVector++;
    }
    return array;
}

function modificarEntradaBCDN(entrada){
    while(entrada.includes(" ")){
        entrada = entrada.substr(0,entrada.indexOf(" ")) + entrada.substr(entrada.indexOf(" ") + 1);
    }
    if(entrada.includes(".") && ((entrada.length -1) %4 != 0)){
        alert("La cantidad de digitos debe ser multiplo de 4");
    }else if(!entrada.includes(".") && (entrada.length)%4 != 0){
        alert("La cantidad de digitos debe ser multiplo de 4");
    }
    let vector = dividirDeA4(entrada), i = 0;
    vector.forEach((elem)=>{
        if(parseInt(elem.slice(0,4)) > 1001) alert("No puede haber numeros mayores que 9");
    })
    return entrada;
}

function modificarEntrada(entrada){
    if(entrada.includes(",")){
        entrada = entrada.substr(0,entrada.indexOf(",")) + "." +entrada.substr(entrada.indexOf(",") + 1);
    }
    while(entrada.includes(" ")){
        entrada = entrada.substr(0,entrada.indexOf(" ")) + entrada.substr(entrada.indexOf(" ") + 1);
    }
    return entrada;
}
var contadorSumas = 0;

function sumarDosNumerosBinariosSinMostrar(n1,n2){
    let lugaresComa = Math.max(cantLugaresDespuesDeLaComa(n1),cantLugaresDespuesDeLaComa(n2));
    let resultado = "", acarreoAnterior = 0;
    if(n1.includes(".") && !n2.includes(".")) n2+=".";
    if(!n1.includes(".") && n2.includes(".")) n1+=".";
    while(parteEntera(n1).length < parteEntera(n2).length) n1 = agregar0Adelante(n1);
    while(parteEntera(n2).length < parteEntera(n1).length) n2 = agregar0Adelante(n2);
    while(parteDecimal(n1).length < parteDecimal(n2).length) n1 = agregar0Atras(n1);
    while(parteDecimal(n2).length < parteDecimal(n1).length) n2 = agregar0Atras(n2);
    n1 = borrarComa(n1);
    n2 = borrarComa(n2);
    let ultimoIndice = n1.length - 1;
    let sumando1 = "", sumando2 = "", resultadoMostrado = "";
    while(ultimoIndice >= 0){
        let aux = sumarDosDigitosBinarios(n1[ultimoIndice],n2[ultimoIndice],acarreoAnterior);
        if(acarreoAnterior == "0"){
             sumando1 = `${n1[ultimoIndice]} ${sumando1}`;
             sumando2 = `${n2[ultimoIndice]} ${sumando2}`;
             resultadoMostrado = `${aux.resultado} ${resultadoMostrado}`;
        }
        else{
            sumando1 = `${n1[ultimoIndice]} <sup>${acarreoAnterior}</sup> ${sumando1} `;
            sumando2 = `${n2[ultimoIndice]} <sup style="visibility: hidden;">${acarreoAnterior}</sup> ${sumando2} `;
            resultadoMostrado = `${aux.resultado} <sup style="visibility: hidden;">${acarreoAnterior}</sup> ${resultadoMostrado} `;
        } 
        
        resultado = aux.resultado + resultado; 
        acarreoAnterior = aux.acarreo;
        ultimoIndice--;
    }
    let aux = "", longitud = resultado.length - 1;
    if(lugaresComa != 0){
        while(longitud >= 0){
            if(lugaresComa !=0){
                aux = resultado[longitud] + aux;
                longitud--;
                lugaresComa--;
            }else{
                aux = "." + aux;
                lugaresComa--;
            }
        }
        resultado = aux;
    }
    return {resultado,acarreo:acarreoAnterior};
}

var uno = [];

function restaBCDN(){
    uno = [];
    let numero1 = modificarEntradaBCDN(document.getElementById("restaBCDN1").value),
        numero2 = modificarEntradaBCDN(document.getElementById("restaBCDN2").value);
        numero1 = igualarNumeros(numero1,numero2).n1;
        numero2 = igualarNumeros(numero1,numero2).n2;
        numero2 = CA9(numero2);
        resultado = sumarDosNumerosBCDN(numero1,numero2);
        if(resultado.acarreoFinal == "0001"){
            if(!resultado.resultado.includes(".")){
                resultado.resultado = sumarDosNumerosBinariosSinMostrar(resultado.resultado,resultado.acarreoFinal).resultado;
            }else{
                let posicionComa = resultado.resultado.indexOf(".");
                resultado.resultado = borrarComa(resultado.resultado);
                let suma = sumarDosNumerosBinariosSinMostrar(resultado.resultado,resultado.acarreoFinal);
                resultado.resultado = suma.resultado;
                resultado.resultado = resultado.resultado.substr(0,posicionComa) + "." + resultado.resultado.substr(posicionComa);
            }
            uno[uno.length - 1] =  uno[uno.length - 1].substring(0, uno[uno.length - 1].length - 1) + "1";
            let elemento = document.createElement("p");
            elemento.innerHTML = uno.join(" ");
            document.getElementById("pasos").appendChild(elemento);
            let elemento4_5 = document.createElement("p");
            i = 0;
            while(i < resultado.resultado.length * 2){
                elemento4_5.innerHTML += "-";
                i++;
            }
            document.getElementById("pasos").appendChild(elemento4_5);
            let elemento2 = document.createElement("p");
            elemento2.innerHTML = `<sup style="visibility:hidden">1</sup>${dividirDeA4(resultado.resultado).join(" ")}`;
            document.getElementById("pasos").appendChild(elemento2);
        }
        let resultadoFinal = "", vector;
        vector = dividirDeA4(resultado.resultado);
        vector.forEach((elem)=>{
            resultadoFinal += (elem+" ");
        })
        if(resultado.acarreoFinal == "0001"){
            document.getElementById("resultadoOutput9").innerHTML = "Resultado = " + resultadoFinal;
            document.getElementById("resultadoOutput10").innerHTML = "(Positivo)";
        }else{
            document.getElementById("resultadoOutput9").innerHTML = "Resultado = " + resultadoFinal;
            document.getElementById("resultadoOutput10").innerHTML = "(Negativo)";
        }
}

function igualarNumeros(n1,n2){
    if(n1.includes(".") && !n2.includes(".")) n2+=".";
    if(!n1.includes(".") && n2.includes(".")) n1+=".";
    while(parteEntera(n1).length < parteEntera(n2).length) n1 = agregar0Adelante(n1);
    while(parteEntera(n2).length < parteEntera(n1).length) n2 = agregar0Adelante(n2);
    while(parteDecimal(n1).length < parteDecimal(n2).length) n1 = agregar0Atras(n1);
    while(parteDecimal(n2).length < parteDecimal(n1).length) n2 = agregar0Atras(n2);
    return {n1,n2}
}

function CA9UnDigito(numero){
    numero = parseInt(convertirDeOtroADecimal(numero,2));
    let resultado = 9 - numero;
    resultado = convertirDecimalAOtro(resultado.toString(),2);
    while(resultado.length < 4) resultado = agregar0Adelante(resultado);
    return resultado;
}

function CA9(numero){
    let resultado = "";
    if(numero.includes(".")){
        let parteDecimalN = parteDecimal(numero), ultimoIndice = parteDecimalN.length - 1;
        while(ultimoIndice > 0){
            let contador = 0, digito = "";
            while(contador < 4){
                digito = parteDecimalN[ultimoIndice] + digito;
                ultimoIndice--;
                contador++;
            }
            resultado = CA9UnDigito(digito) + resultado;
        }
        resultado = "." + resultado;
    }
    let parteEnteraN = parteEntera(numero), ultimoIndice = parteEnteraN.length - 1;
        while(ultimoIndice > 0){
            let contador = 0, digito = "";
            while(contador < 4){
                digito = parteEnteraN[ultimoIndice] + digito;
                ultimoIndice--;
                contador++;
            }
            resultado = CA9UnDigito(digito) + resultado;
        }
    return resultado;
}

function CA10UnDigito(numero){
    numero = parseInt(convertirDeOtroADecimal(numero,2));
    let resultado = 10 - numero;
    resultado = convertirDecimalAOtro(resultado.toString(),2);
    while(resultado.length < 4) resultado = agregar0Adelante(resultado);
    return resultado;
}

function CA10(numero){
    let resultado = "";
    if(numero.includes(".")){
        let parteDecimalN = parteDecimal(numero), ultimoIndice = parteDecimalN.length - 1;
        while(ultimoIndice > 0){
            let contador = 0, digito = "";
            while(contador < 4){
                digito = parteDecimalN[ultimoIndice] + digito;
                ultimoIndice--;
                contador++;
            }
            resultado = CA10UnDigito(digito) + resultado;
        }
        resultado = "." + resultado;
    }
    let parteEnteraN = parteEntera(numero), ultimoIndice = parteEnteraN.length - 1;
        while(ultimoIndice > 0){
            let contador = 0, digito = "";
            while(contador < 4){
                digito = parteEnteraN[ultimoIndice] + digito;
                ultimoIndice--;
                contador++;
            }
            resultado = CA9UnDigito(digito) + resultado;
        }
    return resultado;
}

function sumarDosDigitosBCDEx3(n1,n2,acarreo){
    if(n1.length != 4 || n2.length != 4) alert("El numero de digitos debe ser si o si 4" + " " + n1.length + " " + n2.length);
    else{
        let acarreoAtras = false;
        let acarreoAdelante = false;
        let N1Mostrar = n1;
        let N2Mostrar = n2;
        let R1Mostrar = "";
        let R2Mostrar = "";
        let ResultadoMostrar = "";
        let hayAcarreoInicial = (acarreo == "0000")? false:true;
        if(hayAcarreoInicial){
            N1Mostrar += `<sup>1</sup>`;
            N2Mostrar += `<sup style="visibility: hidden;">1</sup>`;
            R1Mostrar += `<sup style="visibility: hidden;">1</sup>`;
            R2Mostrar += `<sup style="visibility: hidden;">1</sup>`;
            ResultadoMostrar = `<sup style="visibility: hidden;">1</sup>`;
            acarreoAtras = true;
        }
        let aux = sumarDosNumerosBinarios(n2,acarreo),
            suma = aux.resultado;
            aux = sumarDosNumerosBinarios(suma,n1);
            suma = aux.resultado;
            if(aux.acarreo == 1){
                N1Mostrar = `<sup style="visibility: hidden;">1</sup>` + N1Mostrar;
                N2Mostrar = `<sup style="visibility: hidden;">1</sup>` + N2Mostrar;
                R1Mostrar = `<sup>1</sup>` + suma + R1Mostrar;
                R2Mostrar = `<sup style="visibility: hidden;">1</sup>` + R2Mostrar;
                ResultadoMostrar = `<sup style="visibility: hidden;">1</sup>` + ResultadoMostrar;
                acarreoAdelante = true;
            }else{
                R1Mostrar = suma + R1Mostrar;
            }
            let acarreoFinal1 = aux.acarreo;
        if(acarreoFinal1 == "1"){
            aux = sumarDosNumerosBinarios(suma,"0011");
            suma = aux.resultado;
            if(acarreoAdelante){
                let indice = R2Mostrar.indexOf("</sup>") + 5;
                R2Mostrar = R2Mostrar.substring(0,indice+1)+"0011"+R2Mostrar.substring(indice+1)
            }else{
                R2Mostrar = "0011" + R2Mostrar;
            }
        }else{
            aux = restarDosNumerosBinarios(suma,"0011");
            suma = aux.resultado;
            if(acarreoAdelante){
                let indice = R2Mostrar.indexOf("</sup>") + 5;
                R2Mostrar = R2Mostrar.substring(0,indice+1)+"1101"+R2Mostrar.substring(indice+1);
            }else{
                R2Mostrar = "1101" + R2Mostrar;
            }
        }
        if(acarreoAdelante){
            let indice = R2Mostrar.indexOf("</sup>") + 5;
                ResultadoMostrar = ResultadoMostrar.substring(0,indice+1)+suma+ResultadoMostrar.substring(indice+1)
        }else{
            ResultadoMostrar = suma + ResultadoMostrar;
        }
        let acarreoFinal = (acarreoFinal1 == "1")? "1":"0";
        SumaBCDEx3vectorMostrarL1.unshift(N1Mostrar);
        SumaBCDEx3vectorMostrarL2.unshift(N2Mostrar);
        SumaBCDEx3vectorMostrarL3.unshift(R1Mostrar);
        SumaBCDEx3vectorMostrarL4.unshift(R2Mostrar);
        SumaBCDEx3vectorMostrarL5.unshift(ResultadoMostrar);
        let auxiliar = "";
        for(let i = 0; i < ResultadoMostrar.length; i++){
            if(ResultadoMostrar[i] != "1"){
                auxiliar += ResultadoMostrar[i];
            }else if(ResultadoMostrar[i] == "1"){
                auxiliar += "0";
            }
        }
        uno.unshift(reemplazarTodaOcurrencia(auxiliar,"<sup>",`<sup style="visibility:hidden;">`));
        return {resultado:suma,acarreoFinal};
    } 
}

var SumaBCDEx3vectorMostrarL1 = [];
var SumaBCDEx3vectorMostrarL2 = [];
var SumaBCDEx3vectorMostrarL3 = [];
var SumaBCDEx3vectorMostrarL4 = [];
var SumaBCDEx3vectorMostrarL5 = [];

function sumarDosNumerosBCDEx3(n1,n2){
    SumaBCDEx3vectorMostrarL1 = [];
    SumaBCDEx3vectorMostrarL2 = [];
    SumaBCDEx3vectorMostrarL3 = [];
    SumaBCDEx3vectorMostrarL4 = [];
    SumaBCDEx3vectorMostrarL5 = [];

    let acarreoAnterior = "0000", resultado = "";
    if(tieneComa(n1) && !tieneComa(n2)) n2 += ".";
    if(!tieneComa(n1)  && tieneComa(n2)) n1 += ".";
    if(tieneComa(n1)  || tieneComa(n2)){
        let parteDecimalN1 = parteDecimal(n1),
            parteDecimalN2 = parteDecimal(n2);
        while(parteDecimalN1.length < parteDecimalN2.length){
            parteDecimalN1 += "0011";
        } 
        while(parteDecimalN2.length < parteDecimalN1.length) {
            parteDecimalN2 += "0011";
        }
        let ultimoIndice = parteDecimalN1.length - 1;
        while(ultimoIndice > 0){
            let contador = 0, digitoN1 = "", digitoN2 = "";
            while(contador < 4){
                digitoN1 = parteDecimalN1[ultimoIndice] + digitoN1;
                digitoN2 = parteDecimalN2[ultimoIndice] + digitoN2;
                ultimoIndice--;
                contador++;
            }
            let sumaAux = sumarDosDigitosBCDEx3(digitoN1,digitoN2,acarreoAnterior);
            resultado = sumaAux.resultado + resultado;
            acarreoAnterior = (sumaAux.acarreoFinal == "1")? "0001":"0000";
        }
        resultado = "." + resultado;
    }
    let parteEnteraN1 = parteEntera(n1),
        parteEnteraN2 = parteEntera(n2);
        while(parteEnteraN1.length < parteEnteraN2.length) parteEnteraN1 = "0011" + parteEnteraN1;
        while(parteEnteraN2.length < parteEnteraN1.length) parteEnteraN2 = "0011" + parteEnteraN2;
        let ultimoIndice = parteEnteraN1.length - 1;
    while(ultimoIndice > 0){
        let contador = 0, digitoN1 = "", digitoN2 = "";
        while(contador < 4){
            digitoN1 = parteEnteraN1[ultimoIndice] + digitoN1;
            digitoN2 = parteEnteraN2[ultimoIndice] + digitoN2;
            ultimoIndice--;
            contador++;
        }
        let sumaAux = sumarDosDigitosBCDEx3(digitoN1,digitoN2,acarreoAnterior);
        resultado = sumaAux.resultado + resultado;
        acarreoAnterior = (sumaAux.acarreoFinal == "1")? "0001":"0000";
    }
    let resultadoMostrar = resultado, cantGuiones = resultado.length;
        if(acarreoAnterior === "0001" && document.getElementById("sumaBCDEx3").style.display == "block"){
            SumaBCDEx3vectorMostrarL1.unshift(`0011<sup>1</sup>`);
            SumaBCDEx3vectorMostrarL2.unshift(`0011<sup style="visibility:hidden;">1</sup>`);
            SumaBCDEx3vectorMostrarL3.unshift(`0111<sup style="visibility:hidden;">1</sup>`);
            SumaBCDEx3vectorMostrarL4.unshift(`1101<sup style="visibility:hidden;">1</sup>`);
            SumaBCDEx3vectorMostrarL5.unshift(`0100<sup style="visibility:hidden;">1</sup>`);
            cantGuiones+=4;
        }
    eliminarTodosLosHijos("pasos");

    let elemento0 = document.createElement("p");
    elemento0.innerHTML = "<b>Pasos para realizar la operacion BCD-Ex3: </b>";
    document.getElementById("pasos").appendChild(elemento0);

    let elemento1 = document.createElement("p");
    elemento1.innerHTML = SumaBCDEx3vectorMostrarL1.join(" ");
    document.getElementById("pasos").appendChild(elemento1);
    let elemento2 = document.createElement("p");
    elemento2.innerHTML = SumaBCDEx3vectorMostrarL2.join(" ");
    document.getElementById("pasos").appendChild(elemento2);
    let elemento2_5 = document.createElement("p");
    let i = 0;
    while(i < cantGuiones * 2){
        elemento2_5.innerHTML += "-";
        i++;
    } 
    document.getElementById("pasos").appendChild(elemento2_5);
    let elemento3 = document.createElement("p");
    elemento3.innerHTML = SumaBCDEx3vectorMostrarL3.join(" ");
    document.getElementById("pasos").appendChild(elemento3);
    let elemento4 = document.createElement("p");
    elemento4.innerHTML = SumaBCDEx3vectorMostrarL4.join(" ");
    document.getElementById("pasos").appendChild(elemento4);
    let elemento4_5 = document.createElement("p");
    i = 0;
    while(i < cantGuiones * 2){
        elemento4_5.innerHTML += "-";
        i++;
    }
    document.getElementById("pasos").appendChild(elemento4_5);
    let elemento5 = document.createElement("p");
    elemento5.innerHTML = SumaBCDEx3vectorMostrarL5.join(" ");
    document.getElementById("pasos").appendChild(elemento5);
    document.getElementById("pasos").style.display = "block";
    return {resultado,acarreoFinal: acarreoAnterior};
}


function sumaBCDEx3(){
    let numero1 = modificarEntradaBCDEx3(modificarEntrada(document.getElementById("sumaBCDEx31").value)),
        numero2 = modificarEntradaBCDEx3(modificarEntrada(document.getElementById("sumaBCDEx32").value));
        resultado = sumarDosNumerosBCDEx3(numero1,numero2);
        let resultadoFinal = "", vector;
        vector = dividirDeA4(resultado.resultado);
        vector.forEach((elem)=>{
            resultadoFinal += (elem+" ");
        })
        if(resultado.acarreoFinal == "0001") resultadoFinal = "0100" + " " + resultadoFinal;
        document.getElementById("resultadoOutput11").innerHTML = "Resultado = " + resultadoFinal;
}

function modificarEntradaBCDEx3(entrada){
    while(entrada.includes(" ")){
        entrada = entrada.substr(0,entrada.indexOf(" ")) + entrada.substr(entrada.indexOf(" ") + 1);
    }
    if(entrada.includes(".") && ((entrada.length -1) %4 != 0)){
        alert("La cantidad de digitos debe ser multiplo de 4" + " " + entrada);
    }else if(!entrada.includes(".") && (entrada.length)%4 != 0){
        alert("La cantidad de digitos debe ser multiplo de 4" + " " +  entrada);
    }
    let vector = dividirDeA4(entrada), i = 0;
    vector.forEach((elem)=>{
        if(parseInt(elem.slice(0,4)) > 1100 || parseInt(elem.slice(0,4)) < 11) alert("No puede haber numeros mayores que 9 (1100) o menores que 0 (0011)" + " " + parseInt(elem.slice(0,4)) + " " + elem.slice(0,4));
    })
    return entrada;
}

function restaBCDEx3(){
    uno = [];
    let numero1 = modificarEntradaBCDEx3(modificarEntrada((document.getElementById("restaBCDEx31").value))),
        numero2 = modificarEntradaBCDEx3(document.getElementById("restaBCDEx32").value);
        numero1 = igualarNumerosBCDEx3(numero1,numero2).n1;
        numero2 = igualarNumerosBCDEx3(numero1,numero2).n2;
        numero2 = invertirDigitos(numero2);
        resultado = sumarDosNumerosBCDEx3(numero1,numero2);
        if(resultado.acarreoFinal == "0001"){
            if(!resultado.resultado.includes(".")){
                resultado.resultado = sumarDosNumerosBinariosSinMostrar(resultado.resultado,resultado.acarreoFinal).resultado;
            }else{
                let posicionComa = resultado.resultado.indexOf(".");
                resultado.resultado = borrarComa(resultado.resultado);
                let suma = sumarDosNumerosBinariosSinMostrar(resultado.resultado,resultado.acarreoFinal);
                resultado.resultado = suma.resultado;
                resultado.resultado = resultado.resultado.substr(0,posicionComa) + "." + resultado.resultado.substr(posicionComa);
            }
            uno[uno.length - 1] =  uno[uno.length - 1].substring(0, uno[uno.length - 1].length - 1) + "1";
            let elemento = document.createElement("p");
                elemento.innerHTML = uno.join(" ");
                document.getElementById("pasos").appendChild(elemento);
                let elemento4_5 = document.createElement("p");
                i = 0;
                while(i < resultado.resultado.length * 2){
                    elemento4_5.innerHTML += "-";
                    i++;
                }
                document.getElementById("pasos").appendChild(elemento4_5);
                let elemento2 = document.createElement("p");
                elemento2.innerHTML = `<sup style="visibility:hidden">1</sup>${dividirDeA4(resultado.resultado).join(" ")}`;
                document.getElementById("pasos").appendChild(elemento2);
        }
        let resultadoFinal = "", vector;
        vector = dividirDeA4(resultado.resultado);
        vector.forEach((elem)=>{
            resultadoFinal += (elem+" ");
        })
        if(resultado.acarreoFinal == "0001"){
            document.getElementById("resultadoOutput12").innerHTML = "Resultado = " + resultadoFinal;
            document.getElementById("resultadoOutput13").innerHTML = "(BCD-Ex3 Positivo)";
        }else{
            document.getElementById("resultadoOutput12").innerHTML = "Resultado = " + resultadoFinal;
            document.getElementById("resultadoOutput13").innerHTML = "(BCD-Ex3 Negativo)";
        }
}

function igualarNumerosBCDEx3(n1,n2){
    if(n1.includes(".") && !n2.includes(".")) n2+=".";
    if(!n1.includes(".") && n2.includes(".")) n1+=".";
    while(parteEntera(n1).length < parteEntera(n2).length) n1 = "0011" + n1;
    while(parteEntera(n2).length < parteEntera(n1).length) n2 = "0011" + n2;
    while(parteDecimal(n1).length < parteDecimal(n2).length) n1 += "0011";
    while(parteDecimal(n2).length < parteDecimal(n1).length) n2 += "0011";
    return {n1,n2}
}

function invertirDigitos(n1){
    let resultado = "";
    for(let i = 0; i < n1.length; i++){
        if(n1[i] != "."){
            if(n1[i] == "0") resultado += "1";
            else resultado += "0";
        }else{
            resultado += ".";
        }
    }
    return resultado;
}

function codigoJohnson(numero){
    eliminarTodosLosHijos("pasos");
    if(numero == undefined) numero = parseInt(document.getElementById("jonhson1").value);
    function agregar1(cadena){
        if (cadena.length <= 1) {
            return cadena; // Si la cadena es de un solo carácter o está vacía, no se hace nada
        }
        // Mover todos los caracteres una posición a la izquierda
        return cadena.slice(1) + "1";
    }

    function agregar0(cadena){
        if (cadena.length <= 1) {
            return cadena; // Si la cadena es de un solo carácter o está vacía, no se hace nada
        }
        // Mover todos los caracteres una posición a la izquierda
        return cadena.slice(1) + "0";
    }

    let resultado = "0", parte1 = true, vectorMostrar = ["<b>Pasos codigo Johnson:</b>"];
    let bitsNecesarios = Math.ceil((numero + 1) / 2);
    while(resultado.length < bitsNecesarios){
        resultado = agregar0Adelante(resultado);
    }  
    let mitad = resultado;
    while(mitad.includes("0")) mitad = reemplazarPrimera(mitad,"0","1");
    for(let i = 1; i <= numero;  i++){
        let auxI = (i - 1).toString();
        while(auxI.length < numero.toString().length) auxI = agregar0Adelante(auxI);
        vectorMostrar.push(`${auxI} --> ${resultado}`);
        resultado = (parte1)? agregar1(resultado):agregar0(resultado);
        if(resultado == mitad) parte1 = false;
    }
    vectorMostrar.push(`${numero} --> ${resultado}`);
    vectorMostrar.forEach((elem,indice)=>{
        let elemento = elem;
        if(indice != 0 && indice != 1) while(elemento.length < resultado.length) elemento = "0" + elemento;
        let elementoP = document.createElement("p");
        elementoP.innerHTML = elemento;
        document.getElementById("pasos").appendChild(elementoP);
    })
    document.getElementById("pasos").style.display = "block";
    document.getElementById("resultadoJohnson").innerHTML = `Resultado: ${resultado}`;
    return resultado;
}

function binarioACodigoGray(binario) {
    // Convertir el número binario (en formato string) a un número entero
    let binarioEntero = parseInt(binario, 2);

    // Aplicar la fórmula de conversión a código Gray
    let grayEntero = binarioEntero ^ (binarioEntero >> 1);

    // Convertir el número Gray (entero) a una cadena binaria
    let grayBinario = grayEntero.toString(2);

    // Rellenar con ceros a la izquierda para que tenga la misma longitud que la entrada binaria
    while (grayBinario.length < binario.length) {
        grayBinario = '0' + grayBinario;
    }

    return grayBinario;
}

function codigoGray(numero){
    if(numero == undefined) numero = document.getElementById("gray1").value;
    eliminarTodosLosHijos("pasos");
    let resultado = binarioACodigoGray(convertirDecimalAOtro(numero,2));
    let vectorMostrar = ["Tabla de codigo Gray: "];
    document.getElementById("resultadoGray").innerHTML = `Resultado: ${resultado}`;
    for(let i = 0 ; i <= parseInt(numero); i++){
        let iString = i.toString();
        while(iString.length < numero.length) iString = agregar0Adelante(iString);
        let numeroEnBinario = convertirDecimalAOtro(iString,2);
        let auxResultado = binarioACodigoGray(numeroEnBinario);
        while(auxResultado.length < resultado.length) auxResultado = agregar0Adelante(auxResultado);
        vectorMostrar.push(`${iString} --> ${auxResultado}`);
    }
    vectorMostrar.forEach((elem,indice)=>{
        let elemento = elem;
        if(indice != 0 && indice != 1) while(elemento.length < resultado.length) elemento = "0" + elemento;
        let elementoP = document.createElement("p");
        elementoP.innerHTML = elemento;
        document.getElementById("pasos").appendChild(elementoP);
    })
    document.getElementById("pasos").style.display = "block";
    return resultado;
}

function createCheckbox() {
    const checkboxContainer = document.getElementById('checkboxContainer');

    // Crear el elemento checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'dynamicCheckbox';

    // Crear una etiqueta para el checkbox
    const label = document.createElement('label');
    label.htmlFor = 'dynamicCheckbox';
    label.textContent = 'Este es un checkbox dinámico';

    // Añadir el checkbox y la etiqueta al contenedor
    checkboxContainer.appendChild(checkbox);
    checkboxContainer.appendChild(label);
    return checkboxContainer;
}

function cambiarEspaciosDivision(){
    const checkbox = document.getElementById('staticCheckbox');
    if(document.getElementById("numeroDividir1").value != "" && document.getElementById("numeroDividir1").value != ""){
            if (checkbox.checked) {
                espacios = "0";
                espaciosBarras = "-";
                dividirDosNumeros();
            } else {
                espacios = " ";
                espaciosBarras = " ";
                dividirDosNumeros();
            }
    }else{
        alert("Los campos deben contener numeros primero");
        checkbox.checked = false;
    }
}

var espacios = " ";
var espaciosBarras =  " ";
function division(dividendo,divisor){
    let grid = createGrid();
    grid.querySelector(".dividendo").appendChild(crearP(dividendo));
    grid.querySelector(".divisor").appendChild(crearP(divisor));
    let indice = 0, numero = dividendo[indice], resultado = "", ultimoIndice = false;
    do{
        while(parseInt(numero) < parseInt(divisor) && indice < dividendo.length && !ultimoIndice){
            indice++;
            numero+=dividendo[indice];
            resultado+="0";
            if(indice == dividendo.length - 1){
                if(typeof window.AuxiliarTotal === 'undefined'){
                    auxiliarTotal = dividendo.substr(0,indice + 1)
                }else{
                    let auxiliarTotal = dividendo.substr(0,indice + 1);
                }
                ultimoIndice = true;
                let auxiliarNumero = parseInt(numero).toString();
                console.log("auxiliarNumero",auxiliarNumero);
                while(auxiliarNumero.length < auxiliarTotal.length) auxiliarNumero = espacios + auxiliarNumero;
                if(grid.querySelector(".operaciones").lastChild)grid.querySelector(".operaciones").removeChild(grid.querySelector(".operaciones").lastChild);
                grid.querySelector(".operaciones").appendChild(crearP(auxiliarNumero));
            } 
        }
        if(!ultimoIndice){
            resultado+="1";
            //IntefazGrafica
            let auxiliarTotal = dividendo.substr(0,indice + 1), auxiliarDivisor = divisor, barras = "", auxiliarResta;
            while(auxiliarDivisor.length < auxiliarTotal.length) auxiliarDivisor = espacios + auxiliarDivisor;
            while(barras.length < parseInt(numero).toString().length) barras = "-" + barras;
            while(barras.length < auxiliarTotal.length) barras = espaciosBarras + barras;
            grid.querySelector(".operaciones").appendChild(crearP(auxiliarDivisor));
            grid.querySelector(".operaciones").appendChild(crearP(barras));
            let resta = restarDosNumerosBinarios(numero,divisor).resultado;
            indice++; resta+=dividendo[indice]; 
            numero = resta;
            auxiliarTotal = dividendo.substr(0,indice + 1);
            auxiliarResta = parseInt(numero).toString(); 
            console.log("entre aca")
            while(auxiliarResta.length < auxiliarTotal.length) auxiliarResta = espacios + auxiliarResta;
            //if(parseInt(auxiliarResta).length == 1) auxiliarTotal = agregar0Adelante(auxiliarResta);
            grid.querySelector(".operaciones").appendChild(crearP(auxiliarResta));
        }
        if(indice == dividendo.length - 1){
            ultimoIndice = true;
            if(parseInt(numero) < parseInt(divisor)) resultado += "0";
            else{
              resultado+="1";
              let auxiliarTotal = dividendo.substr(0,indice + 1), auxiliarDivisor = divisor, barras = "", auxiliarResta;
              while(auxiliarDivisor.length < auxiliarTotal.length) auxiliarDivisor = espacios + auxiliarDivisor;
              while(barras.length < parseInt(numero).toString().length) barras = "-" + barras;
              while(barras.length < auxiliarTotal.length) barras = espaciosBarras + barras;
              grid.querySelector(".operaciones").appendChild(crearP(auxiliarDivisor));
              grid.querySelector(".operaciones").appendChild(crearP(barras));
              let resta = restarDosNumerosBinarios(parseInt(numero).toString(),divisor).resultado;
              numero = resta;
              auxiliarTotal = dividendo.substr(0,indice + 1);
              auxiliarResta = parseInt(numero).toString(); 
              while(auxiliarResta.length < auxiliarTotal.length) auxiliarResta = espacios + auxiliarResta;
              grid.querySelector(".operaciones").appendChild(crearP(auxiliarResta));
              console.log("entre aca", auxiliarResta)
            } 
        }
    }while(!ultimoIndice);
    if(parseInt(numero) != 0){
        resultado+=".";
        dividendo+="0";
        indice++;
        grid.querySelector(".dividendo p").innerHTML = dividendo;
        numero = parseInt(numero) + "0";
        let auxiliarTotal = dividendo.substr(0,indice + 1);
        while(numero.length < auxiliarTotal.length) numero = espacios + numero;
        grid.querySelector(".operaciones").removeChild(grid.querySelector(".operaciones").lastChild);
        grid.querySelector(".operaciones").appendChild(crearP(numero));
        let contador = 0, vueltas = 0;
        do{
            vueltas++;
            let contadorInterno = 0;
            while(parseInt(numero) < parseInt(divisor) && parseInt(numero) != 0){
                //Manejo del dividendo
                dividendo+="0";
                indice++;
                auxiliarTotal = dividendo.substr(0,indice + 1);
                grid.querySelector(".dividendo p").innerHTML = dividendo;
                //Manejo de la resta/numero
                numero+="0";
                let auxiliarNumero = numero;
                while(auxiliarNumero.length < auxiliarTotal.length) auxiliarNumero = espacios + auxiliarNumero;
                grid.querySelector(".operaciones").removeChild(grid.querySelector(".operaciones").lastChild);
                grid.querySelector(".operaciones").appendChild(crearP(auxiliarNumero));
                //Resultado
                resultado+="0";
                contadorInterno++;
            }
            resultado+="1";
            contador++;
            //Resta - parte divisor
            auxiliarTotal = dividendo.substr(0,indice + 1);
            let auxiliarDivisor = divisor;
            while(auxiliarDivisor.length < auxiliarTotal.length) auxiliarDivisor = espacios + auxiliarDivisor;
            grid.querySelector(".operaciones").appendChild(crearP(auxiliarDivisor));
            //Resta Barras
            let barras = "";
            while(barras.length < parseInt(numero).toString().length) barras = "-" + barras;
            while(barras.length < auxiliarTotal.length) barras = espaciosBarras + barras;
            grid.querySelector(".operaciones").appendChild(crearP(barras));
            //Resta resultado
            let resta = restarDosNumerosBinarios(parseInt(numero).toString(),divisor).resultado;
            dividendo+="0"; indice++; auxiliarTotal = dividendo.substr(0,indice + 1);
            grid.querySelector(".dividendo p").innerHTML = dividendo;
            resta += "0"; auxiliarTotal = dividendo.substr(0,indice + 1);
            numero = parseInt(resta).toString();
            let auxiliarResta = parseInt(numero).toString();
            while(auxiliarResta.length < auxiliarTotal.length) auxiliarResta = espacios + auxiliarResta;
            grid.querySelector(".operaciones").appendChild(crearP(auxiliarResta));
        }while(contador<3 && parseInt(numero) != 0);
    }
    eliminarTodosLosHijos("pasos");
    grid.querySelector(".resultado").appendChild(crearP(parseFloat(resultado).toString()));
    document.getElementById("pasos").style.display = "block";
    document.getElementById("pasos").appendChild(grid);
    return resultado;
}

function createGrid() {
    let gridContainer = document.createElement('div');
    gridContainer.classList.add('grid-container');
    gridContainer.id = 'division';

    // Crear los elementos de la grid
    const items = ['dividendo', 'divisor', 'operaciones', 'resultado'];
    items.forEach(item => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('grid-item', item);
        gridContainer.appendChild(gridItem);
    });
    return gridContainer;
}

function crearP(texto){
    let elemento = document.createElement("p");
    elemento.innerHTML = texto;
    return elemento;
}

function borrarCampos(id1, id2,id3,id4){
    if(id1 !== undefined){
        document.getElementById(id1).value = "";
    }
    if(id2 !== undefined){
        document.getElementById(id2).value = "";
    }
    if(id3 !== undefined){
        document.getElementById(id3).innerHTML = "";
    }
    if(id4 !== undefined){
        document.getElementById(id4).innerHTML = "";
    }
    eliminarTodosLosHijos("pasos");
    document.getElementById("pasos").style.display = "none";
}

function sumaDeProductosComoVector(cadena){
    for(let i = 0; i < cadena.length; i++){
        if(cadena[i] == " " || cadena[i] == ")" || cadena[i] == "(" || cadena[i] == "." || cadena[i] == "*"){
            cadena = cadena.substring(0,i) + cadena.substring(i+1);
            i--;
        } 
    }
    return cadena.split("+");
}


function eliminarRepetidos(vector) {
    let conjunto = new Set(vector);
    return [...conjunto];
}

function sonAdyacentes(combinacion1,combinacion2){
    let contadorDiferentes = 0;
    let elementoDiferente, numCombinacion;
    for(let i = 0, j = 0; (Math.min(i,j)) < Math.min(combinacion1.length,combinacion2.length); i++, j++){
        let caracter1;
        if(combinacion1[i+1] == "'"){
            caracter1 = combinacion1[i] + combinacion1[i+1];
            i++;
        }else{
            caracter1 = combinacion1[i];
        }
        console.log(caracter1);
        let caracter2;
        if(combinacion2[j+1] == "'"){
            caracter2 = combinacion2[j] + combinacion2[j+1];
            j++;
        }else{
            caracter2 = combinacion2[j];
        }
        console.log(caracter2);
        if(caracter1 != caracter2){
            contadorDiferentes++;
            elementoDiferente = caracter1;
        }
        if(contadorDiferentes == 2){
            return false;
        }
    }
    return elementoDiferente;
}

function eliminarCaracter(cadena, caracter) {
    for(let i = 0; i < cadena.length; i++){
        let caracter1;
        if((i+1) < cadena.length && cadena[i+1] == "'"){
            caracter1 = cadena[i] + cadena[i+1];
        }else{
            caracter1 = cadena[i];
        }
        if(caracter1 == caracter){
            return cadena.substring(0, i) + cadena.substring(i + caracter.length);
        }
        if(caracter1.length > 1) i++;
    }
    return cadena;
}

function simplificarExpresion(expresion){
    let vector = sumaDeProductosComoVector(expresion);
    vector = eliminarRepetidos(vector);
    vector.forEach((elementoExterno, indiceExterno)=>{
        console.log(elementoExterno);
        vector.forEach((elementoInterno,indiceInterno)=>{
            if(indiceExterno != indiceInterno){
                console.log("   ",elementoInterno);
                let Adyacentes = sonAdyacentes(elementoExterno,elementoInterno);
                if(Adyacentes !== false){
                    vector.splice(indiceInterno,1);
                    vector[indiceExterno] = eliminarCaracter(elementoExterno,Adyacentes);
                }
            }
        })
    })
    return vector;
}