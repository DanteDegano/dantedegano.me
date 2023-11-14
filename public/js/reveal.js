function reveal(){
    var reveals = document.querySelectorAll(".reveal");

    reveals.forEach((reveal) => {
        var windowheight = window.innerHeight;
        var elementTop = reveal.getBoundingClientRect().top;
        var elementVisible = 50;

        if (elementTop < windowheight - elementVisible){
            reveal.classList.add("active");
        } else {
            reveal.classList.remove("active");
        }
    });
}

window.addEventListener("scroll", reveal)