var swiper = new Swiper(".mySwiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: "3",
    loop: true,
    coverflowEffect: {
      rotate: 0,
      stretch: true,
      depth: 150,
      modifier: 1,
      slideShadows: false,
    },
    autoplay: {
        delay: 2000,
      },
    pagination: {
      el: ".swiper-pagination",
    },    
  });

