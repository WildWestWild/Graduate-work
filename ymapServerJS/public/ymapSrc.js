"use strict"

/**
 * Тип маршрутизации. Может принимать одно из двух строковых значений:
"auto" — автомобильная маршрутизация;
"masstransit" - маршрутизация с использованием общественного транспорта.
"pedestrian" — пешеходная маршрутизация.
"bicycle" - велосипедный маршрут.
Значение по умолчанию "auto".
 */
var myMap;
ymaps.ready(init);
function init () {
    // Создание экземпляра карты и его привязка к контейнеру с
    // заданным id ("map").
    myMap = new ymaps.Map('map', {
        // При инициализации карты обязательно нужно указать
        // её центр и коэффициент масштабирования.
        center: [55.76, 37.64], // Москва
        zoom: 10
        //controls: ['geolocationControl']
    }, {
        searchControlProvider: 'yandex#search'  
    });
    
   
    let arrayOfCars = [];
    for (let i = 0, len = arrayOfCars.length; i < len; i++) {
        // Вычисление длительности и времени проезда до машины и возвращение в массив
    }
    
    sendXMLHttpRequest(getHumanPath(55.76, 37.64, 55.74, 37.62));
    sendXMLHttpRequest(getСarPath(55.74, 37.62, 55.77, 37.61));

}


function getСarPath(latitudeYourGeolocation, longitudeYourGeolocation, latitudeCarGeolocation, longitudeCarGeolocation)
{
    var needCarRoute = null;
    var yourGeolocation = [latitudeYourGeolocation, longitudeYourGeolocation];
    var carGeolocation = [latitudeCarGeolocation, longitudeCarGeolocation];
    var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([yourGeolocation, carGeolocation], {
    routingMode: 'auto',
    avoidTrafficJams: true
});
// Создаем отображение мультимаршрута на основе модели.
var multiRouteView = new ymaps.multiRouter.MultiRoute(multiRouteModel);
myMap.geoObjects.add(multiRouteView);
// Подписываемся на события модели мультимаршрута.
multiRouteView.model.events
    .add("requestsuccess", function (event) {
        var routes = event.get("target")
            .getRoutes();
        needCarRoute = getRouteOrError(routes, true);
        console.log("Найдено маршрутов: " + routes.length);
        for (var i = 0, l = routes.length; i < l; i++) {
            console.log("Длина маршрута " + (i + 1) + ": " + routes[i].properties.get("distance").text);
            console.log(routes[i].properties.get('durationInTraffic').text);
            }     
    })
    .add("requestfail", function (event) {
        console.log("Ошибка: " + event.get("error")
            .message);
    });
    return needCarRoute;
}

function getHumanPath(latitudeYourGeolocation, longitudeYourGeolocation, latitudeCarGeolocation, longitudeCarGeolocation){
    var needHumanRoute = {};
    var yourGeolocation = [latitudeYourGeolocation, longitudeYourGeolocation];
    var carGeolocation = [latitudeCarGeolocation, longitudeCarGeolocation];
    var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([yourGeolocation, carGeolocation], {
    routingMode: 'pedestrian'
});
// Создаем отображение мультимаршрута на основе модели.
var multiRouteView = new ymaps.multiRouter.MultiRoute(multiRouteModel);
myMap.geoObjects.add(multiRouteView);
// Подписываемся на события модели мультимаршрута.
multiRouteView.model.events
    .add("requestsuccess", function (event) {
        var routes = event.get("target")
            .getRoutes();
        getRouteOrError(routes, false);
        console.log("Найдено маршрутов: " + routes.length);
        for (var i = 0, l = routes.length; i < l; i++) {
            console.log("Длина маршрута " + (i + 1) + ": " + routes[i]
                .properties.get("distance")
                .text);
            console.log(routes[i].properties.get('duration').text);
            }   
    })
    .add("requestfail", function (event) {
        console.log("Ошибка: " + event.get("error")
            .message);
    });
    return needHumanRoute;
}
function getRouteOrError(routes, isAuto)
{
    switch (routes.length) {
        case 0:
            throw "No path";
        case 1:
            return routes[0];
        default: getMinimum(routes, isAuto);
    }
}
function getMinimum(routes, isAuto) // 'duration'  'durationInTraffic'
{
    let movement = 'duration'; // Передвижение пешком
    let needRoute = null;
    if (isAuto) 
        movement = 'durationInTraffic'; // Передвижение на автомобиле
    
    let min = routes[0].properties.get(movement).value/60;
        for (let i = 1, len = routes.length; i < len; i++) {
            let currentElement = routes[i].properties.get(movement).value/60
            if (min < currentElement) {
               min = currentElement;
        }
    } 
    return min;
}

function sendXMLHttpRequest(data)
{
    let xhr = new XMLHttpRequest();
    let url = "http://localhost/json";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json");
    data = JSON.stringify(data);  
    xhr.send(data);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log('it`s ok');  
        }
        else{
            console.log('error');
        }
    };
    
}

function sendRequest(data){
    fetch('/json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: {
                name: data,
                email: "john@example.com"
            }
        })
    });
}
