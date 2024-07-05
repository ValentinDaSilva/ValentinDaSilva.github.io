function posicionesAdyacentes(numero){
    let adyacentes = [];
    for(let i = 0; i < numero.length; i++){
        let cadena = numero, bit = numero[i];
        bit = (bit == "1")? "0":"1";
        cadena = numero.substring(0,i)+bit+numero.substring(i+1);
        adyacentes.push(cadena);
    }
    return adyacentes;
}

function tablaDeNxM(fila,columna){
    // Crear las celdas de la tabla
    let vectorFilas = (fila == 3)? ["0","1"]:["00","01","11","10"], indiceFila = 0;
    let vectorColumnas = ["00","01","11","10"], indiceColumna = 0;
    let table = document.createElement("table");
    table.id = "karnaugh";
    for (let i = 0; i < fila; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < columna; j++) {
            const td = document.createElement('td');
            td.dataset.fila = i;
            td.dataset.columna = j;
            if(i == 0 && j!=0){
                td.innerHTML = vectorColumnas[indiceColumna];
                indiceColumna++;
            }
            else if(i != 0 && j==0){
                td.innerHTML = vectorFilas[indiceFila];
                indiceFila++;
            }
            else if(i==0 && j==0) td.innerHTML = "variables";
            else{
                td.innerText = '0';
                td.style.cursor = "pointer";
                td.addEventListener('click', function() {
                    // Alternar el valor entre 0 y 1 al hacer clic
                    td.innerText = td.innerText === '0' ? '1' : '0';
                    console.log(td.dataset.fila,td.dataset.columna)
                }); 
            } 
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return table;
}

function construirTabla(...variables){
    let cantVariables = variables.length, tabla;
    if(cantVariables == 3){
        tabla = tablaDeNxM(2+1,4+1);
    }else if(cantVariables == 4){
        tabla = tablaDeNxM(4+1,4+1);
    }else{
        alert("Solamente se pueden usar 3 o 4 variables");
    }
    tabla.style.border = "2px solid black";
    document.querySelector("body").appendChild(tabla);
    return tabla;
}

function buscar1s(){
    let contadorUno = 0;
    let filas = document.getElementById("karnaugh").rows;
    for(let i = 1; i < filas.length; i++){
        for(let j = 1; j < filas[0].cells.length; j++){
            if(filas[i].cells[j].innerHTML == "1"){
                let posicion = filas[i].cells[0].innerHTML + filas[0].cells[j].innerHTML;
                let listaAdyacentes = posicionesAdyacentes(posicion);
                console.log(listaAdyacentes);
                listaAdyacentes.forEach((elem)=>{
                    let celda = devolverCelda(elem);
                    celda.style.backgroundColor = "yellow";
                })
            }
        }
    }
    return contadorUno;
}

function devolverCelda(posicionBinaria){
    let fila,columna;
    if(posicionBinaria.length == 3){
        fila = parseInt(posicionBinaria[0])+1;
        columna = posicionBinaria.slice(1);
        console.log(columna)
        switch(columna){
            case "00": columna = 1;break;
            case "01": columna = 2;break;
            case "11": columna = 3;break;
            case "10": columna = 4;break;
        }
    }else if(posicionBinaria.length == 4){
        fila = posicionBinaria.substring(0,2);
        switch(fila){
            case "00": fila = 1;break;
            case "01": fila = 2;break;
            case "11": fila = 3;break;
            case "10": fila = 4;break;
            default: alert("Ocurrio un error en devolver celda");
        }
        columna = posicionBinaria.substring(2);
        switch(columna){
            case "00": columna = 1;break;
            case "01": columna = 2;break;
            case "11": columna = 3;break;
            case "10": columna = 4;break;
            default: alert("Ocurrio un error en devolver celda");
        }
    }
    return document.getElementById("karnaugh").rows[fila].cells[columna];
}

// Definimos la función interna con async para que retorne una promesa automáticamente
async function funcionInterna() {
    // Simulamos una operación que tarda un poco en completarse
    console.log("realizo una operacion");
    await new Promise(resolve => setTimeout(resolve, 3000)); // Simulamos 3 segundos de espera
    return "Operación interna completada";
}

// Definimos la función externa como async para poder usar await dentro de ella
async function funcionExterna() {
    console.log("Inicio de la función externa");

    try {
        // Esperamos a que la función interna termine usando await
        const resultado = await funcionInterna();
        console.log(resultado); // Esto se ejecutará cuando la función interna haya completado su operación
        console.log("Continuando con la función externa");
    } catch (error) {
        // Manejo de errores si la función interna falla
        console.error("Error en la función interna:", error);
    }

    console.log("Fin de la función externa");
}

// Llamamos a la función externa para iniciar el proceso
funcionExterna();

