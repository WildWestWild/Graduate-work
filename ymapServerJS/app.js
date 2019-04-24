const express = require('express'); 
const app = express();
const config = require('./connectionDatabase/config');
const  selectNeedCars = require('./public/selectNeedCars');

//app.use(staticAsset(path.join(__dirname,'./public')));
app.use(express.static('public'));

app.set('view engine', 'html');

app.get('/', (req,res) => {
    res.sendFile('index.html');
});

app.post('/json', (req,res)=>{  
    if (req.method == 'POST') {
        var jsonString = '';

        req.on('data', function (data) {
            jsonString += data;
        });

        req.on('end', function () {
            console.log(JSON.parse(jsonString));
        });
    }
});

module.exports = app;
