var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Comment = mongoose.model("Comment", new mongoose.Schema({
    text: {type:String, required:[true, "Please enter some text"]},
    secret: {type:Schema.Types.ObjectId, ref:"Secret"},
    poster: {type:Schema.Types.ObjectId, ref:"User"}
}, {timestamps:true}));

module.exports = Comment;