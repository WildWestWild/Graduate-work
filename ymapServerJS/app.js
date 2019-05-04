const express = require('express'); 
const app = express();
const selectNeedCars = require('./parsers/selectNeedCars');
const path = require('path');
const staticAsset = require('static-asset');
const parserCarsharingSite = require('./parsers/parserCarsharingSite');

parserCarsharingSite.getDataOfSite;// Достать все данные с сайта и положить в бд

// Достать необходимые данные из бд и отобразить

app.use(staticAsset(path.join(__dirname,'./public')));
app.use(express.static('public'));

app.set('view engine', 'html');

app.get('/', (req,res) => {
    res.sendFile('index.html');
});
app.post('/fetch',(req,res) => {
    let data = req.body;
    console.log(data);
    res.json(`{"hello" + "world" }`);
    let arrayOfNeedCars = selectNeedCars.getArrayOfCars(data.latitude,data.longitude,data.radius);
    app.get('/arrayOfCars',(req,res)=>{
        return new Promise((resolve,reject)=>{
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
        .catch(error => console.log(error));
    });
});

module.exports = app;
