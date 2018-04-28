var mongoose = require("mongoose");

//Schema Definition
var commentSchema = new mongoose.Schema({
    text: String,
    author: {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    }
});

//Schema Model
module.exports = mongoose.model("Comment", commentSchema);