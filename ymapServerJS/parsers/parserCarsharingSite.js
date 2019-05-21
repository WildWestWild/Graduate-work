const needle = require("needle");
const schemaJSON = require('../connectionDatabase/schemaJSON');
const mongoose = require('mongoose');
const config = require('../connectionDatabase/config');

var URL = "https://carsharing.gde-luchshe.ru/map";


module.exports.getDataOfSite = setInterval(function(){

      var arrayOfCars = [];
      deleteData(); //Удаляем старые данные
      needle.get(URL, function(err, res) {
        if (err) throw err;
        // Выберем элементы массива от id до partner_id
        let regExp = /"name".+?,"partner_id":"\d+"/g;
        // Конвертируем html-страницу в строку для использования регулярного выражения
        let dataCar = res.body.toString();
        // Используем регулярное выражение и конверитруем ответ в массив JSON-файлов
        arrayOfCars = getJSONarray(dataCar.match(regExp));
        // Заполняем базу данных новыми
        schemaJSON.getDataIntoDB(arrayOfCars);
      });

  function getJSONarray(arrayOfCars) {
    for (let i = 0, len = arrayOfCars.length; i < len; i++) {
        arrayOfCars[i] = JSON.parse("{" + arrayOfCars[i] + "}");
        arrayOfCars[i].latitude = Number.parseFloat(arrayOfCars[i].latitude);
        arrayOfCars[i].longitude = Number.parseFloat(arrayOfCars[i].longitude);
        arrayOfCars[i].partner_id = Number.parseFloat(arrayOfCars[i].partner_id);
      }
      return arrayOfCars;
  }
},180000);



function deleteData(){
  mongoose.connect(config.GLOBAL_MONGO_URL,{ useNewUrlParser: true }, function(err,well){
    if (err) {
      console.log("Удаление не удалось!");
    }
    else{
      console.log('Удаление прошло успешно!');
      mongoose.connection.dropDatabase();
    }
});
}