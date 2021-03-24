const mongoose = require('mongoose');

const connectDB =  () => {
    mongoose.connect("MONGO_URI", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => {
        console.log("Connected to database".blue.bold.underline);
    }).catch(() => {
        console.log("Connection Failed");
    });
}
module.exports = connectDB;