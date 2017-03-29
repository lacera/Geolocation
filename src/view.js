/**
 * Возвращаем строку-HTML с пользовательским шаблоном балуна.
 * @function
 * @name balloonHTML
 * @returns {String} Пользовательский шаблон балуна.
 */
function balloonHTML() {
    return  '<div class="popover top">' +
                '<div class="header">' +
                    '<div class="geomarker">' +
                        '<div class="geoshape"></div>' +
                    '</div>' +
                    '<div class="title">' +
                        '$[properties.balloonHeader]' +
                    '</div>' +
                    '<div class="close">&times;</div>' +
                '</div>' +
                '<div class="popover-inner">' +
                    '$[[options.contentLayout]]' +
                    /*'$[[options.contentLayout observeSize minWidth=235 maxWidth=235 maxHeight=350]]' +*/
                    '<h3>ВАШ ОТЗЫВ</h3>' +
                    '<div id="name">'+
                        '<input type="text" id="name-input" placeholder="Ваше имя">' +
                    '</div>' +
                    '<div id="place">'+
                        '<input type="text" id="place-input" placeholder="Укажите место">' +
                    '</div>' +
                    '<div id="comment">'+
                        '<textarea id="comment-textarea" placeholder="Поделитесь впечатлениями"></textarea>' +
                    '</div>' +
                '</div>' +
                '<div id="add-button">Добавить</div>' +
            '</div>';
}

/**
 * Возвращаем строку-HTML с содержимым пользовательского шаблона балуна.
 * @function
 * @name balloonContentHTML
 * @returns {String} Пользовательский шаблон балуна.
 */
function balloonContentHTML() {
    return  '<div class="popover-content">$[properties.balloonContent]</div>'
}

/**
 * Возвращаем строку-HTML с содержимым пользовательского шаблона балуна.
 * @function
 * @name balloonContentHTML
 * @returns {String} Пользовательский шаблон балуна.
 */
function carouselContentHTML() {
    // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
    return  '<div class="carousel-body">{{ properties.balloonContentBody|raw }}</div>'
            //'<div class="carousel-header">{{ properties.balloonContentHeader|raw }}</div>' +
            //'<div class="carousel-body">{{ properties.balloonContentBody|raw }}</div>' +
            //'<div class="carousel-footer">{{ properties.balloonContentFooter|raw }}</div>'
}

function colorCommentValidation(isValidAll) {
    var nameStyle    = document.querySelector('#name'),
        placeStyle   = document.querySelector('#place'),
        commentStyle = document.querySelector('#comment'),
        nameInput    = document.querySelector('#name-input'),
        placeInput   = document.querySelector('#place-input'),
        commTextArea = document.querySelector('#comment-textarea');

    if (isValidAll) {
        nameStyle.style.backgroundColor = '#fff';
        placeStyle.style.backgroundColor = '#fff';
        commentStyle.style.backgroundColor = '#fff';
    } else {
        nameStyle.style.backgroundColor = '#fad5ce';
        placeStyle.style.backgroundColor = '#fad5ce';
        commentStyle.style.backgroundColor = '#fad5ce';

        if (nameInput.value) {
            nameStyle.style.backgroundColor = '#fff';
        }
        if (placeInput.value) {
            placeStyle.style.backgroundColor = '#fff';
        }
        if (commTextArea.value) {
            commentStyle.style.backgroundColor = '#fff';
        }
    }
}