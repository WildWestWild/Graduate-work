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

module.exports.getDataIntoDB = function(arrayOfCars){

    let Club = mongoose.model('infocar', schema);

    Club.collection.insertMany(arrayOfCars,(error,well)=>{
        if (error) {
            console.log("Произошла ошибка!");
        }
        else{
            console.log("Запись успешно завершена!");
        }
    });
}

