"use strict"

//import { pipeline } from "stream";

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
    acceptRequest();//Принимаем запрос от сервера с данными и начинаем их обработку
}
function getPath(latitudeYourGeolocation, longitudeYourGeolocation, latitudeCarGeolocation, longitudeCarGeolocation, isAuto){
    // Геолокация пользователя при Auto = false, и геолокации пользователя в машине при Auto = true
    var yourGeolocation = [latitudeYourGeolocation, longitudeYourGeolocation]; 
    // Геолокация машины при Auto = false (машина как искомый объект), при Auto = true (пункт назначения)
    var needObjectGeolocation = [latitudeCarGeolocation, longitudeCarGeolocation];
    let movement;//Способ передвижение (на автомобиле или пешком)
    if (isAuto) {
        
        var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([yourGeolocation, needObjectGeolocation], {
            routingMode: 'auto',
            avoidTrafficJams: true
        });
        var multiRouteView = new ymaps.multiRouter.MultiRoute(multiRouteModel, {
            // Внешний вид линии маршрута.
        routeStrokeWidth: 2,
        routeStrokeColor: "#000088",
        routeActiveStrokeWidth: 6,
        routeActiveStrokeColor: "#00BFFF",
        });

    } else {
        var multiRouteModel = new ymaps.multiRouter.MultiRouteModel([yourGeolocation, needObjectGeolocation], {
            routingMode: 'pedestrian',
            
        });
        var multiRouteView = new ymaps.multiRouter.MultiRoute(multiRouteModel ,{ 
        // Внешний вид линии пешеходного маршрута.
        //routeActivePedestrianSegmentStrokeStyle: "solid",
        routeActivePedestrianSegmentStrokeColor: "#FFA500"
        });
    }
    myMap.geoObjects.add(multiRouteView);  
    // Подписываемся на события модели мультимаршрута. 
    let asyncFuntion = (multiRouteView, isAuto) => {
        return new Promise((resolve)=> {
                multiRouteView.model.events
                    .add("requestsuccess", function (event) {
                        var routes = event.get("target")
                            .getRoutes();
                        if (routes.length > 0)
                        {
                            console.log("Найдено маршрутов: " + routes.length);
                            for (var i = 0, l = routes.length; i < l; i++) {
                                console.log("Длина маршрута " + (i + 1) + ": " + routes[i]
                                    .properties.get("distance")
                                    .text);
                                console.log(routes[i].properties.get('duration').text);
                                }
                            let data = {};
                            data.MultiRoute = multiRouteView;
                            data.movement = isAuto;
                            data.arrRoutes = routes;
                            resolve(data);
                        }
                    })
                    .add("requestfail", function (event) {
                        console.log("Ошибка: " + event.get("error")
                            .message);
                    });  
            });
            
        }
        return asyncFuntion(multiRouteView, isAuto).then(resolve => {
            return getRouteOrError(resolve);   
            })
    }

function getRouteOrError(object)
{
    let movement = 'duration'; // Передвижение пешком
    if (object.movement) 
        movement = 'durationInTraffic'; // Передвижение на автомобиле
    let numberOfRoute = -1;
    switch (object.arrRoutes.length) {
        case 0:
            throw "No path";
        case 1:numberOfRoute = 0;
            break;
        default: numberOfRoute = getMinimum(object.arrRoutes, movement);
    }
    if (object.movement) {
        object.durationCar = object.arrRoutes[numberOfRoute].properties.get(movement).value/60; // Длительность В минутах
        object.distanceCar = object.arrRoutes[numberOfRoute].properties.get('distance').value/1000; // Дальность в километрах     
    } else {
        object.durationHuman = object.arrRoutes[numberOfRoute].properties.get(movement).value/60; // Длительность В минутах
        object.distanceHuman = object.arrRoutes[numberOfRoute].properties.get('distance').value; // Дальность в метрах
    }
    delete object.movement;
    delete object.arrRoutes; 
    return object;   
}

function getMinimum(routes, movement) // 'duration'  'durationInTraffic'
{
    
    let needRoute = null;
    let min = routes[0].properties.get(movement).value/60;
    let numberOfRoute = 0;
        for (let i = 1, len = routes.length; i < len; i++) {
            let currentElement = routes[i].properties.get(movement).value/60
            if (min > currentElement) {
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

function acceptRequest(){
    console.log('get started Fetch ');
    fetch('/arrayOfCars')       
    .then(responce => {return responce.json()})
    .then(responce => addTimePathOnArrayOfCars(responce))
    .catch(error => console.log(error));
}
// latitude
// longitude
function addTimePathOnArrayOfCars(arrayOfCars){
    let latitude // Широта
    let longitude // Долгота
    // В цикле запускать функции расстояния для каждого элемента массива и и добавлять результаты в массив
    for (let i = 0, len = arrayOfCars.length; i < len; i++) {
        //console.log(isJson(JSON.parse(JSON.stringify(arrayOfCars[i]))));
        latitude = Number(arrayOfCars[i].latitude);
        longitude = Number(arrayOfCars[i].longitude);
        let promiseHuman = new Promise((resolve)=>
        {
            // Получим данные о пути от пешехода до машины
            resolve(getPath(55.76, 37.64, latitude, longitude, false));
        })
        .then(resolve => arrayOfCars[i].routeHuman = resolve);
        let promiseCar = new Promise((resolve)=>
        {
            // Получим данные о пути на машине до пункта назначения
            resolve(getPath(55.74, 37.68, latitude, longitude,true));
        })
        .then(resolve => arrayOfCars[i].routeCar = resolve);
    }
    console.log(arrayOfCars);
}