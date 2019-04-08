const express = require('express'); 
//const pathofScr = require('./ymapSrc');
const app = express();
const staticAsset = require('static-asset');
const path = require('path');
//app.use(staticAsset(path.join(__dirname,'./public')));
app.use(express.static('public'));
//app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//app.set('views', __dirname);
app.get('/', (req,res) => {
    //res.send("<h2> hell <h2>");
    res.sendFile('index.html');
    //res.send(`<script type="text/javascript" charset="utf-8" async src="https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A4733da2662e45c63b1e5c6106c5ae783bedb0e5315122d0a88e4912a51d2c5d8&amp;width=100%25&amp;height=720&amp;lang=ru_RU&amp;scroll=true"></script>`);
})
app.listen(80, () => {
    console.log("Сервер запущен на порту 80");
});
