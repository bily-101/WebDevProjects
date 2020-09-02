var mongoose = require("mongoose");
var ratingSchema = new mongoose.Schema({
    rate: Number
  
})

module.exports  = mongoose.model("rate", ratingSchema);