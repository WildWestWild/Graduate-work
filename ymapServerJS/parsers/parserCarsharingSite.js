const needle = require("needle");
const schemaJSON = require('../connectionDatabase/schemaJSON');

var URL = "https://carsharing.gde-luchshe.ru/map";


module.exports.getDataOfSite = setInterval(function(){

      var arrayOfCars = [];

      needle.get(URL, function(err, res) {
        if (err) throw err;
        // Выберем элементы массива от id до partner_id
        let regExp = /"name".+?,"partner_id":"\d+"/g;
        // Конвертируем html-страницу в строку для использования регулярного выражения
        let dataCar = res.body.toString();
        // Используем регулярное выражение и конверитруем ответ в массив JSON-файлов
        arrayOfCars = getJSONarray(dataCar.match(regExp));
        schemaJSON.getDataIntoDB(arrayOfCars);
      });

  function getJSONarray(arrayOfCars) {
    for (let i = 0, len = arrayOfCars.length; i < len; i++) {
        arrayOfCars[i] = JSON.parse("{" + arrayOfCars[i] + "}");
      }
      return arrayOfCars;
  }
},180000);