
const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const database = require('./connectionDatabase/database');
const config = require('./connectionDatabase/config');

  // Подключение базы данных и запуск сервера
  database().then(info => {
    global.console.log(`Подключение к порту ${info.host}:${info.port}/${info.name}`);
    app.listen(config.PORT, () => 
      global.console.log(`Сервер работает на порту ${config.PORT}!`));  
  })
  .catch((error) => {
    global.console.error('Не подключилась база данных!', error);
    process.exit(1);
  });