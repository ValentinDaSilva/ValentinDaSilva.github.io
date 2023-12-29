const root = document.documentElement;
const ls = localStorage;

export default function darkModeFuncion(btn){
    if(ls.getItem('darkMode') === null) ls.setItem('darkMode', 'off');
    if(ls.getItem('darkMode') === 'off'){
        btn.innerHTML = `🌙`;
        root.style.setProperty('--second-color', 'black');
        root.style.setProperty('--color-fondo', 'white');
    }else{
        btn.innerHTML = `🌞`;
        root.style.setProperty('--second-color', 'white');
        root.style.setProperty('--color-fondo', '#222');
    }
}

export function eventoDarkMode(btn){
    console.log("Hola");
    if(ls.getItem('darkMode') === 'off') ls.setItem('darkMode', 'on');
    else ls.setItem('darkMode', 'off');
    darkModeFuncion(btn);
}