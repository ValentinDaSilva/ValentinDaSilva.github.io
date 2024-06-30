document.getElementById('Conversion').addEventListener('click', () => showContainer('conversor'));
document.getElementById('Suma').addEventListener('click', () => showContainer('suma'));
document.getElementById('Resta').addEventListener('click', () => showContainer('resta'));
document.getElementById('Multiplicacion').addEventListener('click', () => showContainer('multiplicacion'));
document.getElementById('Division').addEventListener('click', () => showContainer('division'));
document.getElementById('Hamming').addEventListener('click', () => showContainer('hamming'));
document.getElementById('SumaBCDN').addEventListener('click', () => showContainer('sumaBCDN'));
document.getElementById('RestaBCDN').addEventListener('click', () => showContainer('restaBCDN'));

function showContainer(containerId) {
    document.getElementById('menuContainer').style.display = 'none';
    document.querySelector('.contenedorGrande').style.display = 'flex'
    document.getElementById(containerId).style.display = 'block';
    document.getElementById('Atras').style.display = 'block';
}

function goBackToMenu() {
    document.getElementById('menuContainer').style.display = 'flex';
    const containers = document.querySelectorAll('.contenedorGrande .container');
    document.querySelector('.contenedorGrande').style.display = 'none';
    containers.forEach(container => {
        container.style.display = 'none';
    });
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
        cadena = "0";
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
    while(ultimoIndice >= 0){
        let aux = sumarDosDigitosBinarios(n1[ultimoIndice],n2[ultimoIndice],acarreoAnterior);
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
        document.getElementById("resultadoOutput3").innerHTML = "Resultado: "+resultado.acarreo+" "+resultado.resultado;
        if(resultado.acarreo == "0")document.getElementById("resultadoOutput4").innerHTML = "Valor Absoluto: "+CA2(resultado.resultado);
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
    while(longitudN2 > 0){
        if(n2[longitudN2 - 1] == "1"){
            let n1ConCeros = agregarNCeros(n1,cantCeros);
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
    return resultado;
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

// Función para convertir un número decimal a binario (en formato string)
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
    // Convertimos los números binarios a decimales
    
    let decimal1 = binaryToDecimal(bin1);
    let decimal2 = binaryToDecimal(bin2);

    // Realizamos la división
    let resultDecimal = decimal1 / decimal2;

    // Redondeamos el resultado a dos decimales
    resultDecimal = parseFloat(resultDecimal.toFixed(2));

    // Convertimos el resultado de nuevo a binario
    let resultBinary = decimalToBinary(resultDecimal);
	 document.getElementById("resultadoOutput6").innerHTML = "Resultado: "+resultBinary;
    return resultBinary;
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
    let bitsTotales = numero.length, bitsParidad = 0;
    while(Math.pow(2,bitsParidad) < numero.length + bitsParidad + 1){
        bitsParidad++; bitsTotales++;
    }
    let numFinal = new Array(bitsTotales), i = 0;
    for(let i = bitsTotales, w = 0, j = 0; i >= 1; i--, w++){
        if(!esPotenciaDeDos(i)){
            numFinal[w] = numero[j];
            j++;
        }
    }
    let contador = 1, vueltas = 0;
    numFinal = numFinal.reverse();
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
        for(let i = 0; i < arrayAux.length; i++){
            if(arrayAux[i] == 1){
                bit = XOR(bit,parseInt(numFinal[i]));
            }
        }
        numFinal[contador-1] = (bit == false)? "0": "1";
        contador*=2;
        vueltas++;
    }while(vueltas < bitsParidad);
    document.getElementById("resultadoOutput7").innerHTML = "Resultado: " + numFinal.reverse().join(' ');
    return numFinal.reverse().join(' ');
}

function sumarDosDigitosBCDN(n1,n2,acarreo){
    if(n1.length != 4 || n2.length != 4) alert("El numero de digitos debe ser si o si 4");
    else{
        let aux = sumarDosNumerosBinarios(n2,acarreo),
            suma = aux.resultado;
            aux = sumarDosNumerosBinarios(suma,n1);
            suma = aux.resultado;
            let acarreoFinal1 = aux.acarreo,
            acarreoFinal2 = "0";
        if(parseInt(suma) > 1001 || acarreoFinal1 == "1"){
            aux = sumarDosNumerosBinarios(suma,"0110");
            suma = aux.resultado;
            acarreoFinal2 = aux.acarreo;
        }
        let acarreoFinal = (acarreoFinal1 == "1" || acarreoFinal2 == "1")? "1":"0";
        return {resultado:suma,acarreoFinal};
    } 
}

function tieneComa(n1){
    return (n1.includes("."));
}

function sumarDosNumerosBCDN(n1,n2){
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
    console.log("Entrada dividir de a 4: ",cadena)
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

function restaBCDN(){
    let numero1 = modificarEntradaBCDN(document.getElementById("restaBCDN1").value),
        numero2 = modificarEntradaBCDN(document.getElementById("restaBCDN2").value);
        numero1 = igualarNumeros(numero1,numero2).n1;
        numero2 = igualarNumeros(numero1,numero2).n2;
        numero2 = CA9(numero2);
        resultado = sumarDosNumerosBCDN(numero1,numero2);
        if(resultado.acarreoFinal == "0001"){
            if(!resultado.resultado.includes(".")){
                resultado.resultado = sumarDosNumerosBCDN(resultado.resultado,resultado.acarreoFinal).resultado;
            }else{
                let posicionComa = resultado.resultado.indexOf(".");
                resultado.resultado = borrarComa(resultado.resultado);
                let suma = sumarDosNumerosBCDN(resultado.resultado,resultado.acarreo);
                resultado.resultado = suma.resultado;
                resultado.resultado = resultado.resultado.substr(0,posicionComa) + "." + resultado.resultado.substr(posicionComa);
            }
        }
        console.log("resultado: ",resultado.resultado);
        let resultadoFinal = "", vector;
        vector = dividirDeA4(resultado.resultado);
        console.log("vector: ",vector)
        vector.forEach((elem)=>{
            resultadoFinal += (elem+" ");
        })
        console.log("resultado Final: ",resultadoFinal);
        if(resultado.acarreoFinal == "0001"){
            document.getElementById("resultadoOutput9").innerHTML = "Resultado = (positivo) " + resultadoFinal;
        }else{
            document.getElementById("resultadoOutput9").innerHTML = "Resultado = (negativo) " + resultadoFinal;
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