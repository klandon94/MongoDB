const mongoose = require('mongoose');

var Cat = mongoose.model('Cat', new mongoose.Schema({
    kind: {type:String, required:true},
    name: {type:String, required:true},
    size: {type:Number, required:true}
}, {timestamps:true}));

module.exports = Cat;