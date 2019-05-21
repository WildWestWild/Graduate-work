
const mongoose = require('mongoose');

const schema = require('../connectionDatabase/schemaJSON');

const connectionDatabase = require('../connectionDatabase/database');

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

    module.exports.getArrayOfCars = (latitudeYourGeolocation, longitudeYourGeolocation, radius, arrayOfCompany) => { return new Promise((resolve, reject) => {
      //Найти массив нужных значений из базы данных
      connectionDatabase();// Подлючение к базе данных
      let objectRadius = getObjectRadius(
        latitudeYourGeolocation,
        longitudeYourGeolocation,
        radius
      ); // Объект из четырех ограничений по радиусу
      let infocar = mongoose.model('infocar', schema.getSchema, 'infocar');
      // partner_id:{$in : arrayOfCompany} 
      infocar.find({latitude: {$gt: objectRadius.minLatitude, $lt: objectRadius.maxLatitude}, longitude:{$gt: objectRadius.minLongitude, $lt: objectRadius.maxLongitude}, partner_id:{$in: arrayOfCompany}} ,(err,array) => {
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