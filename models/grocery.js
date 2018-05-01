var mongoose = require("mongoose");

//Schema Definition
var grocerySchema = new mongoose.Schema({
    name: {type: String, required: true},
    quantity: {type : Number, default :1, required: true},
    price: {type: Number}
});

//Schema Model
module.exports = mongoose.model("Grocery", grocerySchema);