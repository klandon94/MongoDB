const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session")
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}))
app.use(flash());
app.use(express.static(__dirname + '/static'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/quoting_dojo'); 
mongoose.Promise = global.Promise;

var QuoteSchema = new mongoose.Schema({
    name: {type:String, required:true, minlength:3},
    quote: {type:String, required:true}
}, {timestamps:true});
mongoose.model('Quote', QuoteSchema);
var Quote = mongoose.model('Quote');

app.get('/', function(req,res){
    res.render('index');
})

app.post('/quotes', function(req,res){
    var quote = new Quote(req.body);
    quote.save(function(err){
        if (err){
            // console.log("We have an error!", err);
            for (var key in err.errors) req.flash('creation', err.errors[key].message)
        }
        else {
            // console.log("successfully created a quote");
            req.flash('success', "you made a quote!");
        }
        res.redirect("/");
    })
})

app.get('/quotes', function(req,res){
    Quote.find({}).sort('-createdAt').exec(function(err,quotes){
        if (err){
            console.log("something went wrong");
            res.redirect("/");
        }
        else res.render('quotes', {quotes:quotes});
    })
})

app.listen(1234,function(){
    console.log("listening on port 1234");
})