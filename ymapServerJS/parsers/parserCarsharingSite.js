const needle = require("needle");
const schemaJSON = require("../connectionDatabase/schemaJSON");
const mongoose = require("mongoose");
const config = require("../connectionDatabase/config");

var URL = "https://carsharing.gde-luchshe.ru/map";

module.exports.getDataOfSite = setInterval(function() {
  var arrayOfCars = [];
  deleteData(); //Удаляем старые данные
  needle.get(URL, function(err, res) {
    if (err) throw err;
    // Выберем элементы массива от id до partner_id   /\(\d+%/g
    let regExp = /"name".+?\}/g;
    // Конвертируем html-страницу в строку для использования регулярного выражения
    let dataCar = res.body.toString();
    // Используем регулярное выражение и конверитруем ответ в массив JSON-файлов
    arrayOfCars = getJSONarray(dataCar.match(regExp));
    // Заполняем базу данных новыми
    schemaJSON.getDataIntoDB(arrayOfCars);
  });

  function getJSONarray(arrayOfCars) {
    let resultArray = [];
    let regExpProc = /\(\d+%/;
    let regExpDigit = /\d+/;
    for (let i = 0, len = arrayOfCars.length; i < len; i++) {
      arrayOfCars[i] = JSON.parse("{" + arrayOfCars[i]);
      if (checkFuel(arrayOfCars[i].content, regExpProc)) {
        let object = {};
        object.name = arrayOfCars[i].name;
        object.latitude = Number.parseFloat(arrayOfCars[i].latitude);
        object.longitude = Number.parseFloat(arrayOfCars[i].longitude);
        object.partner_id = Number.parseFloat(arrayOfCars[i].partner_id);
        object.fuel = checkFuel(
          checkFuel(arrayOfCars[i].content, regExpProc),
          regExpDigit
        );
        resultArray.push(object);
      }
    }
    return resultArray;
  }
}, 180000);

module.exports.getDataOfSite = function() {};

function deleteData() {
  mongoose.connect(config.GLOBAL_MONGO_URL, { useNewUrlParser: true }, function(
    err,
    well
  ) {
    if (err) {
      console.log("Удаление не удалось!");
    } else {
      console.log("Удаление прошло успешно!");
      mongoose.connection.dropDatabase();
    }
  });
}

function checkFuel(result, regExp) {
  result = result.match(regExp);
  if (result) {
    return result.toString();
  } else {
    false;
  }
}
