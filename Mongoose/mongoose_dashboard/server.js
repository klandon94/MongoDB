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

mongoose.connect('mongodb://localhost/cat_dashboard');
mongoose.Promise = global.Promise;

var CatSchema = new mongoose.Schema({
    kind: {type:String, required:true},
    name: {type:String, required:true},
    size: {type:Number, required:true}
}, {timestamps:true});
mongoose.model('Cat', CatSchema);
var Cat = mongoose.model('Cat');

app.get('/', function(req,res){
    Cat.find({}).sort('kind').exec(function(err,cats){
        if (err) console.log("something went wrong", err);
        else res.render('cats', {cats:cats});
    })
})

app.get('/cats/new', function(req,res){
    res.render('newcat');
})

app.post('/cats', function(req,res){
    var cat = new Cat(req.body);
    cat.save(function(err){
        if (err){
            console.log("We have an error");
            for (var key in err.errors) req.flash('creation', err.errors[key].message);
        }
        else req.flash('success', 'you created a cat!');
        res.redirect('/cats/new');
    })
})

app.get('/cats/:id', function(req,res){
    Cat.findOne({_id:req.params.id}, function(err,cat){
        // console.log(cat);
        res.render("onecat", {cat:cat});
    });
})

app.get('/cats/edit/:id', function(req,res){
    Cat.findOne({_id:req.params.id}, function(err,cat){
        res.render("editcat", {cat:cat});
    });
})

app.post('/cats/:id', function(req,res){
    Cat.updateOne({_id:req.params.id}, {$set:{kind:req.body.kind, name:req.body.name, size: req.body.size}}, function(err){
        if (err) console.log(err);
        else res.redirect("/cats/" + req.params.id);
    });
})

app.post('/cats/delete/:id', function(req,res){
    Cat.remove({_id:req.params.id}, function(err){
        if (err) console.log(err);
        else res.redirect("/");
    })
})

app.listen(1234,function(){
    console.log("listening on port 1234");
})