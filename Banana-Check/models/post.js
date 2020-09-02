var mongoose = require("mongoose");
var postSchema = new mongoose.Schema({
    user: {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    product: String,
    image: String,
    site: String,
    body: String,
    created: {type: Date, default: Date.now},
    rating: Number , default:0
})



module.exports  = mongoose.model("post", postSchema);