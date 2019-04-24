
const mongoose = require('mongoose');

const schema = require('../connectionDatabase/schemaJSON');

function checksForValueInArea(latitude, longitude, objectRadius) {
    if (
      objectRadius.minLatitude < latitude &&
      objectRadius.maxLatitude > latitude &&
      (objectRadius.minLongitude < longitude &&
        objectRadius.maxLongitude > longitude)
    ) {
      return true;
    } else {
      return false;
    }
  }
  
  function getObjectRadius(
    latitudeYourGeolocation,
    longitudeYourGeolocation,
    radius
    ) {
    let objectRadius = {};
    objectRadius.minLatitude = latitudeYourGeolocation - radius;
    objectRadius.maxLatitude = latitudeYourGeolocation + radius;
    objectRadius.minLongitude = longitudeYourGeolocation - radius;
    objectRadius.maxLongitude = longitudeYourGeolocation + radius;
    return objectRadius;
  }

  let radius = 0.005; // Радиус

  let latitudeYourGeolocation = 55.76; // Широта

  let longitudeYourGeolocation = 37.64; // Долгота

    let objectRadius = getObjectRadius(
      latitudeYourGeolocation,
      longitudeYourGeolocation,
      radius
    ); // Объект из четырех ограничений по радиусу


    

    module.exports.getArrayOfCars = function(){
      //Найти массив нужных значений из базы данных
      let infocar = mongoose.model('infocar', schema.getSchema);

      infocar.find((err,array) => {
        if (err) {
          console.log('Произошла ошибка', err);
        }
        else{
          console.log("Массив -> ");
          console.log(array);
        }
      })
    }
    /**
     * if (
      checksForValueInArea(
        Number(arrayOfCars[i].latitude),
        Number(arrayOfCars[i].longitude),
        objectRadius
      )
     */