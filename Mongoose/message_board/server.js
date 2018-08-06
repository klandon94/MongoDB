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

mongoose.connect('mongodb://localhost/message_board');
mongoose.Promise = global.Promise;

const CommentSchema = new mongoose.Schema({
    name:{type:String, required:[true, "Must enter a name"]},
    content:{type:String, required:[true, "Must enter a comment"], minlength:[5, "Comment must be at least 5 characters"]},
}, {timestamps:true});
const MessageSchema = new mongoose.Schema({
    name:{type:String, required:[true, "Must enter a name"]},
    content:{type:String, required:[true, "Must enter a message"], minlength:[5, "Message must be at least 5 characters"]},
    comments: [CommentSchema]
}, {timestamps:true});
mongoose.model('Message', MessageSchema);
var Message = mongoose.model('Message');
mongoose.model('Comment', CommentSchema);
var Comment = mongoose.model('Comment');

app.get('/', function(req,res){
    Message.find({}).sort('-createdAt').exec(function(err,messages){
        if (err) console.log("something went wrong", err);
        else res.render("index", {msgs:messages});
    })
})

app.post('/postmsg', function(req,res){
    var message = new Message(req.body);
    message.save(function(err){
        if (err) for (var key in err.errors) req.flash('msgerror', err.errors[key].message);
        else req.flash('msgsuccess', 'you posted a message!');
        res.redirect('/');
    })
})

app.post('/postcom/:id', function(req,res){
    var comment = new Comment(req.body);
    Message.findOne({_id:req.params.id}, function(err,msg){
        msg.comments.push(comment);
        msg.save(function(err){
            if (err) for (var key in err.errors) req.flash('comerror', err.errors[key].message);
            else req.flash('comsuccess', 'you posted a comment!');
            res.redirect('/');
        })
    })
})

app.listen(1234,function(){
    console.log("listening on port 1234");
})