const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, required: true
    },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    creatorName: String,
    date: {
        type: Date,
        default: Date.now
    },
    imagePath: {
        type: String
    },
    imagePuplicId: String,
    comments: [{author: String, opinion: String}],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            unique: true
        }
    ]
});

module.exports = mongoose.model("Post", PostSchema);