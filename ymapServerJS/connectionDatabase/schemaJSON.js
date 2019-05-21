const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    partner_id: Number
})

schema.set('toJSON',{
    virtuals: true
});

module.exports.getSchema = schema;

module.exports.getDataIntoDB = function(arrayOfCars){

    let infocar = mongoose.model('infocar', schema, 'infocar');

    infocar.collection.insertMany(arrayOfCars,(error,well)=>{
        if (error) {
            console.log("Произошла ошибка!");
        }
        else{
            console.log("Запись успешно завершена!");
        }
    });
}

