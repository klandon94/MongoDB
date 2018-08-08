const mongoose = require('mongoose');

var Task = mongoose.model('Task', new mongoose.Schema({
    title: {type:String, required:true},
    desc: {type: String, default:""},
    completed: {type:Boolean, default:false}
}, {timestamps:true}));

module.exports = Task;