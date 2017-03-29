require('./style.css');
require('./shapes.css');
require('./scrollbar.css');

window.addEventListener('load', () => {
    loadMap()
        .then(result => {
            var clusterer = clusterSet();

            return [result, clusterer];
        })
        .then((result) => { return loadCommentsDataFromStorage(result) })
        .then((result) => placemarkSet(result))
        .catch((reject) => console.log('Ошибка выполнения loadMap:' + reject));
});

function loadCommentsDataFromStorage(data) {
    var map = data[0],
        clusterer = data[1],
        placemarksAndComments = JSON.parse(localStorage.commentsData) || {},
        placemarksArr = [];

    console.log(placemarksAndComments);

    for (let coordsStr in placemarksAndComments) {
        var coords = coordsStr.split(',').map((item) => {return parseFloat(item)});

        for (let i = 0; i < placemarksAndComments[coordsStr].length; i++) {
            var myPlacemark = createPlacemark(map, coords, placemarksAndComments, clusterer, placemarksArr, true);
            getAddress(coords, myPlacemark, placemarksAndComments, i);

            myPlacemark.options.set('visible', true);

            placemarksArr[placemarksAndComments[coordsStr][i].id - 1] = myPlacemark;

            setBalloonContent(myPlacemark, placemarksAndComments[coords]);
        }
    }

    clusterer.add(placemarksArr);
    map.geoObjects.add(clusterer);
    return [map, clusterer, placemarksAndComments, placemarksArr];
}

function addButtonSetHandler(elem, myPlacemark, map, coords, placemarksAndComments, clusterer, placemarksArr, alreadyCreated) {
    elem.addEventListener('click', () => {
        if (document.querySelector('#name-input').value && document.querySelector('#place-input').value &&
            document.querySelector('#comment-textarea').value) {

            colorCommentValidation(true);

            var parent = elem.parentNode;

            if (!placemarksAndComments[coords]) placemarksAndComments[coords] = [];

            placemarksAndComments[coords].push({
                id: placemarksArr.length + 1,
                name: parent.querySelector('#name-input').value,
                place: parent.querySelector('#place-input').value,
                text: parent.querySelector('#comment-textarea').value,
                date: getFormattedDateString()
            });

            var myPlacemark2 = createPlacemark(map, coords, placemarksAndComments, clusterer, placemarksArr, true);

            console.log(placemarksAndComments);
            myPlacemark2.options.set({
                visible: true
            });

            placemarksArr.push(myPlacemark2);

            getAddress(coords, myPlacemark2, placemarksAndComments, placemarksAndComments[coords].length - 1);
            setBalloonContent(myPlacemark, placemarksAndComments[coords]);
            setBalloonContent(myPlacemark2, placemarksAndComments[coords]);

            console.log(placemarksArr);

            clusterer.add(placemarksArr);
            map.geoObjects.add(clusterer);

            document.querySelector('#name-input').value = '';
            document.querySelector('#place-input').value = '';
            document.querySelector('#comment-textarea').value = '';
        } else {
            colorCommentValidation(false);
        }
    });
}

function placemarkSet(data) {
    var map = data[0],
        clusterer = data[1],
        placemarksAndComments = data[2],
        placemarksArr = data[3],
        myPlacemark,
        currentPlacemark;

    map.events.add('click', function (e) {
        var coords = e.get('coords');

        myPlacemark = createPlacemark(map, coords, placemarksAndComments, clusterer, placemarksArr, true);
        map.geoObjects.add(myPlacemark);

        getAddress(coords, myPlacemark);

        myPlacemark.balloon.open();
    });

    clusterer.events.add('balloonopen', function () {
        document.querySelector('.carousel-body a').addEventListener('click', (e) => {
            e.preventDefault();
            currentPlacemark = placemarksArr[e.target.dataset.id - 1];
            map.geoObjects.add(currentPlacemark);
            //if (placemarksAndComments[currentPlacemark.geometry.getCoordinates()].length > 1)
            currentPlacemark.options.set( 'visible', false );
            setBalloonContent(currentPlacemark, placemarksAndComments[currentPlacemark.geometry.getCoordinates()]);
            currentPlacemark.balloon.open();
        });

        // Создаем и стартуем MutationObserver для добавления события на ссылку-адрес
        // (чтобы открывать балун метки с комментами)
        var target = document.querySelector('.ymaps-2-1-48-balloon__content');

        var observer = new MutationObserver(function(mutations) {
            if (document.querySelector('.carousel-body a')) {
                document.querySelector('.carousel-body a').addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPlacemark = placemarksArr[e.target.dataset.id - 1];
                    map.geoObjects.add(currentPlacemark);
                    currentPlacemark.options.set( 'visible', false );
                    setBalloonContent(currentPlacemark, placemarksAndComments[currentPlacemark.geometry.getCoordinates()]);
                    currentPlacemark.balloon.open();
                });
            }
        });

        var config = { childList: true, subtree: true };

        observer.observe(target, config);

        clusterer.events.add('balloonclose', function () {
            observer.disconnect();
            if (currentPlacemark && placemarksAndComments[currentPlacemark.geometry.getCoordinates()].length < 2) {
                currentPlacemark.events.add('balloonclose', () => currentPlacemark.options.set( 'visible', true ));
            }
        });
    });
}

// Определяем адрес по координатам (обратное геокодирование).
function getAddress(coords, myPlacemark) {
    var comments = arguments[2];
    var comment = comments ? comments[coords][arguments[3]] : null;

    ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        myPlacemark.properties
            .set({
                balloonHeader: firstGeoObject.properties.get('text')
            });

        if (comment) {
            comment.address = firstGeoObject.properties.get('text');
            setCarouselContent(myPlacemark, comment);

            localStorage.commentsData = JSON.stringify(comments);
        }
    });
}

// Создание метки.
function createPlacemark(map, coords, placemarksAndComments, clusterer, placemarksArr, alreadyCreated) {
    var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
        balloonHTML(), {
            /**
             * Строит экземпляр макета на основе шаблона и добавляет его в родительский HTML-элемент.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#build
             * @function
             * @name build
             */
            build: function () {
                this.constructor.superclass.build.call(this);

                var parent = this.getParentElement();
                this._$element = parent.querySelector('.popover');

                var closeBtn = this._$element.querySelector('.close');
                closeBtn.addEventListener('click', this.onCloseClick);

                var addBtn = this._$element.querySelector('#add-button');
                addButtonSetHandler(addBtn, myPlacemark, map, coords, placemarksAndComments, clusterer, placemarksArr, alreadyCreated);
            },

            /**
             * Удаляет содержимое макета из DOM.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/layout.templateBased.Base.xml#clear
             * @function
             * @name clear
             */
            clear: function () {
                var closeBtn = this._$element.querySelector('.close');
                closeBtn.removeEventListener('click', this.onCloseClick);

                this.constructor.superclass.clear.call(this);
            },

            /**
             * Закрывает балун при клике на крестик.
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IBalloonLayout.xml#event-userclose
             * @function
             * @name onCloseClick
             */
            onCloseClick: function () {
                map.geoObjects.remove(myPlacemark);
                myPlacemark.balloon.close();
            },

            /**
             * Используется для автопозиционирования (balloonAutoPan).
             * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/ILayout.xml#getClientBounds
             * @function
             * @name getClientBounds
             * @returns {Number[][]} Координаты левого верхнего и правого нижнего углов шаблона относительно точки привязки.
             */
            getShape: function () {
                var position = {left: this._$element.offsetLeft, top: this._$element.offsetTop};

                return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                    [position.left, position.top], [
                        position.left + this._$element.offsetWidth,
                        position.top + this._$element.offsetHeight
                    ]
                ]));
            }
        }),

        // Создание вложенного макета содержимого балуна.
        MyBalloonContentLayout = ymaps.templateLayoutFactory.createClass(
            balloonContentHTML()
        ),

        // Создание метки с пользовательским макетом балуна.
        myPlacemark = new ymaps.Placemark(
            coords,
            propertiesObjPlacemark(),
            optionsObjPlacemark(MyBalloonLayout, MyBalloonContentLayout)
        );

    return myPlacemark;
}

function clusterSet() {
    // Создаем собственный макет с информацией о выбранном геообъекте.
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        carouselContentHTML()
    );

    return new ymaps.Clusterer(settingsObjClusterer(customItemContentLayout));
}

function setBalloonContent(placemark, content) {
    placemark.properties.set({
        balloonContent: createCommentsDiv(content, require('../balloon-comment.hbs'))
    });
}

function setCarouselContent(placemark, content) {
    placemark.properties.set({
        balloonContentBody: createCommentsDiv(content, require('../carousel-comment.hbs'))
    });
}

function createCommentsDiv(comments, template) {
    return template({
        comments: comments
    });
}