
export function imprimirFecha(){
    let $imprimir = document.querySelector(".diferencia");
    setInterval(() => {
        let resultado = guardarFecha();
        $imprimir.innerHTML = `<h2>Años: ${resultado.anios} <br> Dias: ${resultado.dias}<br> Horas: ${resultado.horas}<br> Minutos: ${resultado.minutos} <br> Segundos: ${resultado.segundos}</h2>`;
    },1000);
}

export function guardarFecha(){
   let dia, mes, anio, fecha, fechaActual, diferencia;
   let $dia = document.querySelector("#dia"),
       $mes = document.querySelector("#mes"),
       $anio = document.querySelector("#anio");
    
    dia = parseInt($dia.value);
    mes = parseInt($mes.value) - 1;
    anio = parseInt($anio.value);
    fecha = new Date(anio,mes,dia);
    fechaActual = new Date();
    diferencia = fecha - fechaActual;
    return convertirAFecha(diferencia);
}

function convertirAFecha(milisegundos){
// Cálculos para obtener años, días, horas, minutos y segundos
    const anios = Math.floor(milisegundos/ (1000 * 60 * 60 * 24 * 356));
    milisegundos =  milisegundos - (anios * (1000 * 60 * 60 * 24 * 356));
    const dias = Math.floor(milisegundos / (1000 * 60 * 60 * 24));
    milisegundos = milisegundos - (dias * (1000 * 60 * 60 * 24));
    const horas = Math.floor(milisegundos / (1000 * 60 * 60));
    milisegundos = milisegundos - (horas * (1000 * 60 * 60));
    const minutos = Math.floor(milisegundos / (1000 * 60));
    milisegundos = milisegundos - (minutos * (1000 * 60));
    const segundos = Math.floor(milisegundos / 1000);
    return {
        anios,
        dias,
        horas,
        minutos,
        segundos
    }
}