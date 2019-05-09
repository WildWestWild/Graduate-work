module.exports = {
    PORT: process.env.PORT || 81,
    MONGO_URL: 'mongodb://localhost:27017/carsharingDB',
    GLOBAL_MONGO_URL:'mongodb+srv://mainmaxxx:$skam1962@cluster0-awhdg.mongodb.net/test?retryWrites=true',
    SERVER_URL: 'http://127.0.0.1:80'
};

// GLOBAL => MONGO_URL: 'mongodb+srv://mainmaxxx:<password>@cluster0-awhdg.mongodb.net/test?retryWrites=true'
// LOCAL =>  MONGO_URL: 'mongodb://localhost:27017/carsharingDB'