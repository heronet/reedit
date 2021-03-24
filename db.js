const mongoose = require('mongoose');

const connectDB =  () => {
    mongoose.connect("MONGODB URI", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(() => {
        console.log("Connected to database".blue);
    }).catch(() => {
        console.log("Connection Failed");
    });
}
module.exports = connectDB;