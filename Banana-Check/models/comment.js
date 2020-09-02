var mongoose = require("mongoose");
var ratingSchema = new mongoose.Schema({
    rat: Number
  
});

module.exports  = mongoose.model("rate", ratingSchema);