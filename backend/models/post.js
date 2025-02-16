const mongoose = require('mongoose');

const postSchema = new mongoose.Schema ({
    title: {
        type : String,
        require: true
    },

    content: {
        type: String,
        require: true
    },

    imagePath: {
        type: String,
        require: true
    },

    creater: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",       // reference the user document
        require: true
    }
});

const postModel = mongoose.model('Post', postSchema);
module.exports = postModel;

