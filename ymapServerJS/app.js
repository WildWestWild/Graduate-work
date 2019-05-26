const express = require('express'); 
const app = express();
const selectNeedCars = require('./parsers/selectNeedCars');
const parserCarsharingSite = require('./parsers/parserCarsharingSite');

parserCarsharingSite.getDataOfSite;// Достать все данные с сайта и положить в бд

app.use(express.static(__dirname + '/public'));


app.get('/', (req,res) => {
    res.sendFile('index.html');
});

app.post('/fetch',(req,res) => {
    let data = req.body;
    console.log(data);
    let lat = 55.76;
    let log = 37.64;
    let rad = 0.005;
    let logDest = 37.642;
    let latDest = 55.768;
    let arr = ['14']; 
    res.json(`{"hello" + "world" }`);
    app.get('/arrayOfCars',(req,res)=>{
        return new Promise((resolve,reject)=>{
            let arrayOfNeedCars = selectNeedCars.getArrayOfCars(lat, latDest, log, logDest, rad, arr);
            
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
