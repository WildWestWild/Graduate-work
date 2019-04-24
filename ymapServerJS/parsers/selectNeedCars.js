
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

  let radius = 10; // Радиус

  let latitudeYourGeolocation = 55.76; // Широта

  let longitudeYourGeolocation = 37.64; // Долгота

    let objectRadius = getObjectRadius(
      latitudeYourGeolocation,
      longitudeYourGeolocation,
      radius
    ); // Объект из четырех ограничений по радиусу


    

    module.exports.getArrayOfCars = function(arrayOfCompanies){
      //Найти массив нужных значений из базы данных

      let infocar = mongoose.model('infocar', schema.getSchema);
      // {latitude: {$lt: objectRadius.minLatitude, $gt: objectRadius.maxLatitude},longitude:{$lt: objectRadius.minLongitude, $gt: objectRadius.maxLongitude}}
      // longitude:{$lt: objectRadius.minLongitude, $gt: objectRadius.maxLongitude}
      infocar.find( {projection:{latitude: {$lt: objectRadius.minLatitude, $gt: objectRadius.maxLatitude},longitude:{$lt: objectRadius.minLongitude, $gt: objectRadius.maxLongitude} } },(err,array) => {
        if (err) {
          console.log('Произошла ошибка', err);
        }
        else{
          console.log("Массив -> ");
          console.log(array);
        }
      })
    }