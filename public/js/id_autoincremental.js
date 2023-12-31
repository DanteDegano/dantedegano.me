document.addEventListener("DOMContentLoaded", function () {
    var articles = document.querySelectorAll('.module_7_element');

    articles.forEach(function (article, index) {
        article.id = 'article_' + index;

        var crossElement = article.querySelector('.module_7_ticket_cross');

        if (crossElement) {
            crossElement.id = 'cross_' + index;
        }
    });
});
