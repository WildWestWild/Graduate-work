const express = require('express'); 
const app = express();
const selectNeedCars = require('./parsers/selectNeedCars');
const parserCarsharingSite = require('./parsers/parserCarsharingSite');
const Browser = require('zombie');
const bodyParser = require('body-parser');
const config = require('./connectionDatabase/config')

browser = new Browser();

parserCarsharingSite.getDataOfSite;// Достать все данные с сайта и положить в бд
var flag = true; // Замыкание с использованием flag для browser.wait
var jsonParser = bodyParser.json(); // Парсер req.body в json формат

app.use(express.static(__dirname + '/public')); // Статический путь для всех папок

app.get('/browser', (req,res) => {
    let conStr = 'http://' + req.connection.remoteAddress + ':' + req.connection.remotePort; 
    browser.visit(config.GLOBAL_URL_SERVER, ()=>{
            try {
                browser.wait(()=>
                {
                  while (flag);
                });
            } catch (err) {
            console.log("Ошибка обработки браузера"); 
            } 
    });
    app.post('/Mobile', jsonParser, (req,res)=>{
        console.log('Массив ?');
        flag = false;
        let resultMobileRequest = req.body;
        if (resultMobileRequest != undefined) {
            app.get(conStr, (request,responce) => {
                console.log(conStr);
                console.log(resultMobileRequest);
                responce.json(resultMobileRequest);
            })
        } else {
            throw "Ошибка! req.body = undefinded!"; 
        }
    })
});

app.get('/', (req,res) => {
    res.sendFile('index.html');
});

app.post('/fetch',  jsonParser, (req,res) => {
    console.log("JSON!!11");
    let data = req.body;
    console.log(data);
    let arr = ['14']; 
    app.get('/arrayOfCars',(req,res)=>{
        return new Promise((resolve,reject)=>{
            let arrayOfNeedCars = selectNeedCars.getArrayOfCars(data.longitude, data.deLongitude, data.latitude, data.deLatitude, data.radius, data.arrCompany);
            if (arrayOfNeedCars != null) {
                resolve(arrayOfNeedCars);
            } else {
                reject(error);
            }
        })
        .then(resolve => {
            console.log(resolve);
            console.log("is send");
            res.json(resolve);
        })
        .catch(error => console.error(error));
    });
});
module.exports = app;
