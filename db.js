const mongoose = require('mongoose');

const connectDB = () => {
    mongoose.connect("URI", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => {
        console.log("Connected to database".blue.bold.underline);
    }).catch((err) => {
        console.log("Connection Failed " + err);
    });
}
module.exports = connectDB;