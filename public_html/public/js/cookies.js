const cookies = document.getElementById('cookies');
const cookies_accept = document.getElementById('cookies_accept');

dataLayer = [];


if(!localStorage.getItem('cookies-accepted')){
    cookies.classList.add('flex');
    body.classList.add('no-scroll');
}else{
    dataLayer.push({'event': 'cookies-aceptada'})
}

cookies_accept.addEventListener('click', function(ev){
    cookies.classList.add('none');
    cookies.classList.remove('flex');
    body.classList.remove('no-scroll');

    localStorage.setItem('cookies-accepted', true);

    dataLayer.push({'event': 'cookies-aceptada'})
})
