const mongoose = require("mongoose");
const mongooseUniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    hobbies: {
        type: Array
    },
    job: String,
    born: Date
});

UserSchema.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("User", UserSchema);