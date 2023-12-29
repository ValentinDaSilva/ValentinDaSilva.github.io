const d = document;
let X = 0, Y = 0;

export function moveBall(e,ball,stage){
    const $ball = d.querySelector(ball),
          $stage = d.querySelector(stage);
    const $limiteBall = $ball.getBoundingClientRect(), 
    $limiteStage = $stage.getBoundingClientRect();
    
    switch(e.keyCode){
        case 37:
            // move("left");
            if($limiteBall.left > ($limiteStage.left + 8)) X--;
            ;break;
        case 38:
            // move("up");
            if($limiteBall.top > ($limiteStage.top + 8)) Y--;
            ;break;
        case 39:
            // move("right")
            if($limiteBall.right < ($limiteStage.right -8))X++;
            ;break;
        case 40:
            // move("down");
            if($limiteBall.bottom < ($limiteStage.bottom - 8)) Y++;
            ;break;
        default:alert("Tecla no permitida");
    }  
    $ball.style.transform = `translate(${X*10}px,${Y*10}px)`;

    
}

