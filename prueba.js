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
            console.log("hubo acarreo inicial");
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
                console.log("hubo acarreo adelante");
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
            console.log("Linea 602");
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
        console.log("ResultadoAMostrar: ",ResultadoMostrar)
        SumaBCDNvectorMostrarL1.unshift(N1Mostrar);
        SumaBCDNvectorMostrarL2.unshift(N2Mostrar);
        SumaBCDNvectorMostrarL3.unshift(R1Mostrar);
        SumaBCDNvectorMostrarL4.unshift(R2Mostrar);
        SumaBCDNvectorMostrarL5.unshift(ResultadoMostrar);
        console.log("fin");
        return {resultado:suma,acarreoFinal};
    } 
}