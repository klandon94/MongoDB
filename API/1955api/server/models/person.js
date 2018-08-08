const mongoose = require('mongoose');

var Person = mongoose.model('Person', new mongoose.Schema({
    name: {type: String, required:true, minlength:3}
}, {timestamps:true}));

module.exports = Person;