let d = document,
    w = window;

export default function scrollTopButton(btn){
    const $scrollBtn = d.querySelector(btn);
    w.addEventListener("scroll", e =>{
        let scroll = d.documentElement.scrollTop;
        if(scroll > 200){
            $scrollBtn.style.opacity = '1';
            $scrollBtn.style.visibility = 'visible';
        }else{
            $scrollBtn.style.opacity = '0';
            $scrollBtn.style.visibility = 'hidden';
        }
    });
    $scrollBtn.addEventListener("click", e => {
            w.scrollTo({
                behavior: "smooth",
                top: 0
            });
    });
}