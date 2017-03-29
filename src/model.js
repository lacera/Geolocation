/**
 * Инициализация карты от yandex/maps.
 * @function
 * @name loadMap
 * @returns {Promise} Промис разрешается готовностью карты.
 */
function loadMap() {
    return new Promise(function (resolve, reject) {
        var map;

        ymaps.ready(function init() {
            map = new ymaps.Map('map', {
                center: [57.62847090, 39.89700039], // Карта открывается центрированной на Ярославле
                zoom: 12
            });

            if (map) {
                resolve(map);
            } else {
                reject(new Error('Не удалось выполнить !'));
            }
        });
    });
}

/**
 * Получаем текущую дату, форматируем, выводим в строку
 * @function
 * @name getFormattedDateString
 * @returns {String} Возвращает дату-строку
 */
function getFormattedDateString() {
    var date = new Date();
    return  date.getFullYear() + '.' +
            (date.getMonth() < 9 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' +
            (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' +
            (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':' +
            (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' +
            (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
}

function settingsObjClusterer(customItemContentLayout) {
    return {
        preset: 'islands#invertedVioletClusterIcons',
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна.
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 380,
        clusterBalloonContentLayoutHeight: 200,
        hideIconOnBalloonOpen: false,
        // Устанавливаем максимальное количество элементов в нижней панели на одной странице
        clusterBalloonPagerSize: 5
        // Настройка внешего вида нижней панели.
        // Режим marker рекомендуется использовать с небольшим количеством элементов.
        // clusterBalloonPagerType: 'marker',
        // Можно отключить зацикливание списка при навигации при помощи боковых стрелок.
        // clusterBalloonCycling: false,
        // Можно отключить отображение меню навигации.
        // clusterBalloonPagerVisible: false
    }
}

function propertiesObjPlacemark() {
    return {
        balloonHeader: 'Адрес',
        balloonContent: 'Отзывов пока нет...',
        balloonContentHeader: 'Я хэдер',
        balloonContentBody: 'Я боди',
        balloonContentFooter: 'Я футер'
    }
}

function optionsObjPlacemark(MyBalloonLayout, MyBalloonContentLayout) {
    return {
        preset: 'islands#violetIcon',
        balloonShadow: false,
        balloonLayout: MyBalloonLayout,
        balloonContentLayout: MyBalloonContentLayout,
        balloonPanelMaxMapArea: 0,
        hideIconOnBalloonOpen: false,   // Не скрываем иконку при открытом балуне.
        balloonOffset: [3, -10],        // Смещаем балун относительно иконки.
        visible: false
    }
}