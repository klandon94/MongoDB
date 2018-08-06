var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// How we connect to the mongodb database using mongoose -- "basic_mongoose" is the name of our 
// db in mongodb -- this should match the name of the db you are going to use for you project 
// (if it doesn't exist, it will be automatically created!)
mongoose.connect('mongodb://localhost/basic_mongoose'); 
mongoose.Promise = global.Promise;

var UserSchema = new mongoose.Schema({
    name: String,
    age: Number
})
mongoose.model('User', UserSchema); // We are setting this Schema in our Models as 'User'
var User = mongoose.model('User'); // We are retrieving this Schema from our Models, named 'User'

app.get('/', function(req,res){
    User.find({}, function(err, users){
        if (err) console.log("something went wrong")
        else{
            res.render('index', {users:users});
        }
    })
})

app.post('/users', function(req,res){
    console.log("POST DATA", req.body);
    // create a new User with the name and age corresponding to those from req.body
    var user = new User({name: req.body.name, age:req.body.age});
    // Try to save that new user to the databse (this is the method that actually inserts into the db) and run
    // a callback function with an error(if any) from the operation
    user.save(function(err){
        // if there is an error console.log that something went wrong
        if (err) console.log("something went wrong");
        else { //else console.log that we did well and then redirect to the root route
            console.log("successfully added a user");
            res.redirect("/");
        }
    })
})

app.listen(1234, function() {
    console.log("listening on port 1234");
})