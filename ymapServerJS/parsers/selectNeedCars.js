
const mongoose = require('mongoose');

const schema = require('../connectionDatabase/schemaJSON');

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

    module.exports.getArrayOfCars = (latitudeYourGeolocation, longitudeYourGeolocation, radius) => { return new Promise((resolve, reject) => {
      //Найти массив нужных значений из базы данных
      let objectRadius = getObjectRadius(
        latitudeYourGeolocation,
        longitudeYourGeolocation,
        radius
      ); // Объект из четырех ограничений по радиусу
      let infocar = mongoose.model('infocar', schema.getSchema);
      infocar.find({latitude: {$gt: objectRadius.minLatitude, $lt: objectRadius.maxLatitude},longitude:{$gt: objectRadius.minLongitude, $lt: objectRadius.maxLongitude}},(err,array) => {
        if (err) {
          reject(err);
        }
        else{
          resolve(array);
        }
      });
    })
    .then((response)=>
    { 
      return response;
    })
    .catch(console.error);
  }