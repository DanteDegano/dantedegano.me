const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const menu_wrp = document.getElementById('menu_wrp');
const cross_menu = document.getElementById('cross_menu');
const btn_menu = document.getElementById('btn_menu');
const ul_menu = document.getElementById('ul_menu');


burger.addEventListener('click', function(ev){
    menu_wrp.classList.add('translatex');
    menu.classList.add('open_menu');
    body.classList.add('no-scroll');
})

cross_menu.addEventListener('click', function(ev){
    menu_wrp.classList.remove('translatex');
    menu.classList.remove('open_menu');
    body.classList.remove('no-scroll');
})

/*
btn_menu.addEventListener('click', function(ev){
    ul_menu.classList.toggle('block');
    btn_menu.classList.toggle('change_color_orange');
    btn_menu.classList.toggle('border_radius_button_none');
})
*/