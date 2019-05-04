const app = require('./app');
const database = require('./connectionDatabase/database');
const config = require('./connectionDatabase/config');
//const parserYmap = require('./public/parserYmap');
const mongoose = require('mongoose');

database().then(info => {
  global.console.log(`Подключение к порту ${info.host}:${info.port}/${info.name}`);
  app.listen(config.PORT, () => 
    global.console.log(`Сервер работает на порту ${config.PORT}!`));
    //parserYmap.getDataOfSite(); 
})
.catch(() => {
  global.console.error('Не подключилась база данных!');
  process.exit(1);
});
mongoose.connect(config.MONGO_URL,{ useNewUrlParser: true }, function(err,well){
    if (err) {
      console.log("Удаление не удалось!");
    }
    else{
      console.log('Удаление прошло успешно!');
      mongoose.connection.dropDatabase();
    }
});