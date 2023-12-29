const d = document;
let intervaloReloj, clockHour, clockHour24Hs, Intervalo;

export function digitalClock(clock, btnPlay, btnStop){
    d.addEventListener("click", e => {
        if(e.target.matches(btnPlay)){
            intervaloReloj = setInterval(()=>{
                if(clockHour === undefined){
                    clockHour = new Date();
                    clockHour = clockHour.getHours() * 3600 + clockHour.getMinutes() * 60 + clockHour.getSeconds()
                }else{
                    clockHour+=1;
                }
                clockHour24Hs = cambiarA24Hs(clockHour);
                d.querySelector(clock).innerHTML = `<h3>${clockHour24Hs}</h3>`;
            },1000);
            d.querySelector(btnStop).disabled = false;
            e.target.disabled = true;
        }
        if(e.target.matches(btnStop)){
            clearInterval(intervaloReloj);
            d.querySelector(btnPlay).disabled = false;
            e.target.disabled = true;
        }
    })
}

export function alarma(reloj , btnPlay,btnStop){
    let $reloj = d.querySelector(reloj);
    let $audio = d.createElement("audio");
    $reloj.appendChild($audio);
    $audio.src = "/assets/audios/alarma.mp3";
    // $audio.controls = true;
    d.addEventListener("click", e => {
        if(e.target.matches(btnPlay)){
            let horaActivacion = prompt("A que hora quiere que suene la alarma? Formato: HH:MM:SS");
            if(horaActivacion[1] == ":"){
                horaActivacion = insertCharacterAtPosition(horaActivacion,"0",0);
            }
            if(horaActivacion[4] == ":"){
                horaActivacion = insertCharacterAtPosition(horaActivacion,"0",3);
            }
            if(horaActivacion.length < 8 ){
                horaActivacion = insertCharacterAtPosition(horaActivacion,"0",6);
            }
            console.log(horaActivacion);
            d.querySelector(btnStop).disabled = false;
            d.querySelector(btnPlay).disabled = true;
            Intervalo = setInterval(() => {
                if(
                    (clockHour24Hs[0] + clockHour24Hs[1]) == (horaActivacion[0] + horaActivacion[1]) &&
                    (clockHour24Hs[3] + clockHour24Hs[4]) == (horaActivacion[3] + horaActivacion[4]) &&
                    (clockHour24Hs[6] + clockHour24Hs[7]) == (horaActivacion[6] + horaActivacion[7])
                ){
                    
                    $audio.play();
                }
            }, 1000);
        }
        if(e.target.matches(btnStop)){
            clearInterval(Intervalo);
            $audio.pause();
            $audio.corruntTime = 0;
            d.querySelector(btnStop).disabled = true;
            d.querySelector(btnPlay).disabled = false;
        }

    })
}


function cambiarA24Hs(numeroEnSegundos){
    let Horas = Math.floor(numeroEnSegundos / 3600);
    numeroEnSegundos -= Horas * 3600;
    Horas = Horas.toString();
    Horas = Horas.padStart(2,`0`);
    let Minutos = Math.floor(numeroEnSegundos / 60);
    numeroEnSegundos -= Minutos * 60;
    Minutos = Minutos.toString();
    Minutos = Minutos.padStart(2,`0`);
    let Segundos = numeroEnSegundos;
    Segundos = Segundos.toString();
    Segundos = Segundos.padStart(2,`0`);
    return `${Horas}:${Minutos}:${Segundos}`
}

function insertCharacterAtPosition(string, character, position) {
    return string.substring(0, position) + character + string.substring(position);
  }