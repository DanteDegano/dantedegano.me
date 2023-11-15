const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
const menu_wrp = document.getElementById('menu_wrp');
const cross_menu = document.getElementById('cross_menu');
const btn_menu = document.getElementById('btn_menu');
const ul_menu = document.getElementById('ul_menu');
const login = document.getElementById('login');
const loginBody = document.getElementById('loginBody');
const loginMenu = document.getElementById('loginMenu');
const loginMenuBottom = document.getElementById('loginMenuBottom');



burger.addEventListener('click', function(ev){
    menu_wrp.classList.add('translatex');
    menu.classList.add('open_menu');
    body.classList.add('no-scroll');
});

login.addEventListener('click', function(ev){
    loginBody.classList.add('flex');
});

document.addEventListener('click', function(ev) {
    if (!login.contains(ev.target)) {
        loginBody.classList.remove('flex');
    }
});

loginMenu.addEventListener('click', function(ev){
    loginMenuBottom.classList.add('flex');
});

document.addEventListener('click', function(ev) {
    if (!loginMenu.contains(ev.target)) {
        loginMenuBottom.classList.remove('flex');
    }
});

cross_menu.addEventListener('click', function(ev){
    menu_wrp.classList.remove('translatex');
    menu.classList.remove('open_menu');
    body.classList.remove('no-scroll');
});