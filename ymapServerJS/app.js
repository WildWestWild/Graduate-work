const express = require('express'); 
const app = express();
const selectNeedCars = require('./parsers/selectNeedCars');
const parserCarsharingSite = require('./parsers/parserCarsharingSite');
const Browser = require('zombie');
const bodyParser = require('body-parser');
const config = require('./connectionDatabase/config')

parserCarsharingSite.getDataOfSite;// Достать все данные с сайта и положить в бд

var jsonParser = bodyParser.json(); // Парсер req.body в json формат

app.use(express.static(__dirname + '/public')); // Статический путь для всех папок



app.use(function(req, res, next){
    next();
})
function startBrowser(){
    return new Promise((resolve, reject) => {
        console.log("Запуск браузера");
        browser = new Browser({
            maxWait: 35000,
            waitDuration: 30000
        });
        browser.visit(config.GLOBAL_URL_SERVER, ()=>{
            try {
                browser.wait()
                .then(console.log('Все скрипты отработали!'));
            } catch (err) {
                console.log("Ошибка обработки браузера"); 
            } 
            app.post('/Mobile',jsonParser, (req,res, next)=>{
                console.log('Массив ?');
                next();
                resolve(req.body);
            }),function(req,res, next) {
                res.status(201).end();
            }
        });
    }).then(resolve => info(resolve))
}
app.get('/');// Отправка данных в браузер

//var data = undefined;

app.all('/fetch', (request,response, next)=>{
    next();
})

app.post('/fetch',  jsonParser, (request,responce, next) => {
    console.log("JSON!!11");
    data = checkData(request.body); // Данные с JSON ответа от обраузера
    console.log(data);
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
    
    let promiseJSON = new Promise((resolve, reject)=>{
        let resultJSON = startBrowser();
        if (resultJSON != undefined) {
           resolve(resultJSON);
        } else {
            reject('error - resultJSON is undefined');
        }
    })
    return promiseJSON
            .then((resolve)=> {return responce.json(resolve)})
            .catch(reject => console.log(reject));
});


app.post('/test', jsonParser, (req,res)=> {
    app.get('/test2', (req,res)=> {
        
    })
    return res.json({name: "hey"});
})


function checkData(data){
    if (data.hasOwnProperty('radius')) {
        return data
    } else {
        throw "Неверные данные!";
    }
}

function info(data){
    console.log(data);
    return data;
}

module.exports = app;

