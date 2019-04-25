"use strict"

//import { isObject } from "util";

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
    sendRequest();
    sendXMLHttpRequest(getHumanPath(55.76, 37.64, 55.74, 37.62));
    sendXMLHttpRequest(getСarPath(55.74, 37.62, 55.77, 37.61));

}


function getСarPath(latitudeYourGeolocation, longitudeYourGeolocation, latitudeCarGeolocation, longitudeCarGeolocation)
{
    var needCarRoute = {};
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
        needHumanRoute = getRouteOrError(routes, false);
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
    let movement = 'duration'; // Передвижение пешком
    if (isAuto) 
        movement = 'durationInTraffic'; // Передвижение на автомобиле
    let needRoute = {};
    let numberOfRoute = -1;
    switch (routes.length) {
        case 0:
            throw "No path";
        case 1:numberOfRoute = 0;
            break;
        default: numberOfRoute = getMinimum(routes, movement);
    }
    needRoute.duration = routes[numberOfRoute].properties.get(movement).value/60; // Длительность В минутах
    needRoute.distance = routes[numberOfRoute].properties.get(movement).value/1000; // Дальность в километрах
    return needRoute;
}
function getMinimum(routes, movement) // 'duration'  'durationInTraffic'
{
    
    let needRoute = null;
    let min = routes[0].properties.get(movement).value/60;
    let numberOfRoute = 0;
        for (let i = 1, len = routes.length; i < len; i++) {
            let currentElement = routes[i].properties.get(movement).value/60
            if (min < currentElement) {
                min = currentElement;
                numberOfRoute = i;
        }
    } 
    return numberOfRoute;
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

function sendRequest(){
    console.log('get started Fetch ');
    fetch('/arrayOfCars')       
    .then(responce => {return responce.json()})
    .then(responce => getArrayOfRoutes(responce))
    .catch(error => console.log(error));
}
// latitude
// longitude
function getArrayOfRoutes(arrayOfCars){
    arrayOfCars = isJson(arrayOfCars);
    // В цикле запускать функции расстояния для каждого элемента массива и и добавлять результаты в массив
    for (let i = 0, len = arrayOfCars.length; i < len; i++) {
        //console.log(isJson(JSON.parse(JSON.stringify(arrayOfCars[i]))));
        latitude = Number(arrayOfCars[i].latitude);
        longitude = Number(arrayOfCars[i].longitude);
        arrayOfCars[i].timeToCar = getHumanPath(37.480220, 55.669940, latitude, longitude);
        arrayOfCars[i].timeToDestination = getСarPath(37.480220, 55.669940, latitude, longitude);
    }
}

function isJson(str) {
    let result = null;
    /*
    str = str.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
// remove non-printable and other non-valid JSON chars
str = str.replace(/[\u0000-\u0019]+/g,""); */
    try {
        return JSON.parse(str);
    } catch (e) {
        throw "Error with JSON";
    }  
}