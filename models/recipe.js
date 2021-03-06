var mongoose = require("mongoose");

//Schema Definition
var recipeSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author : {
        id : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
        username : String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    ingredients: [{
        name:{type:String},
        quantity:{type:Number}
    }]
});

//Schema Model
module.exports = mongoose.model("Recipe", recipeSchema);