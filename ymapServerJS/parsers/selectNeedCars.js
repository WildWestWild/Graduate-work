
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

  compareAndSelectNeedGeolocation = function (objectRadius)
  {
      return {partner_id:14}; 
  }
  let radius = 0.005; // Радиус

  let latitudeYourGeolocation = 55.76; // Широта

  let longitudeYourGeolocation = 37.64; // Долгота

    let objectRadius = getObjectRadius(
      latitudeYourGeolocation,
      longitudeYourGeolocation,
      radius
    ); // Объект из четырех ограничений по радиусу


    

    module.exports.getArrayOfCars = new Promise((resolve, reject) => {
      //Найти массив нужных значений из базы данных
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