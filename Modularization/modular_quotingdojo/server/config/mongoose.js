const path = require('path');
const fs = require('fs')
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/quoting_dojo', {useNewUrlParser:true});
mongoose.Promise = global.Promise;
// creates a variable that points to the models folder
var models_path = path.join(__dirname, './../models');

// reads all of the files in the models_path and requires (runs) each of the javascript files
fs.readdirSync(models_path).forEach(function(file) {
    if(file.indexOf('.js') >= 0) {
        // require the file (this runs the model file which registers the schema)
        require(models_path + '/' + file);
    }
})