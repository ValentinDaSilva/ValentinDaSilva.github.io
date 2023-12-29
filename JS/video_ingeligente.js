var d = document;
export default function smartView(){
    const $videos = d.querySelectorAll("video");
    
    const reproducir = (elementos) => {
        elementos.forEach((elem) => {
            if(elem.isIntersecting){
                elem.target.play();
            }else{
                elem.target.pause();
            }
            window.addEventListener("visibilitychange",(e) =>{
                d.visibilityState === "visible"?
                elem.target.play() :
                elem.target.pause()
            });            
        });
    }
    const oberver = new IntersectionObserver(reproducir,{threshold: 0.5});
    $videos.forEach((elem) => oberver.observe(elem));
}