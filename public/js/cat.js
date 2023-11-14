const cat = document.getElementById('cat');
const question = document.getElementById('question');


cat.addEventListener('mouseover', function(ev){
    question.classList.add('active');
    question.classList.remove('remove');
})
cat.addEventListener('mouseout', function(ev){
    question.classList.remove('active');
    question.classList.add('remove');
})