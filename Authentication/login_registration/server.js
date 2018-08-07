const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session")
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

mongoose.connect('mongodb://localhost/login_registration');
mongoose.Promise = global.Promise;

const UserSchema = new mongoose.Schema({
    first_name: {type:String, required:[true, "Please enter a first name"], minlength:[3, "First name must be at least 3 characters"]},
    last_name: {type:String, required:[true, "Please enter a last name"], minlength:[3, "Last name must be at least 3 characters"]},
    email: {type:String, 
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9.+_-]+@[a-zA-z0-9._-]+\.[a-zA-z]+$/.test(v);
            }, 
            message:"Please enter a valid email"}, 
        required:[true, "Please enter an email"]},
    password: {type:String, required:[true, "Please enter a password"], minlength:[8, "Password must be at least 8 characters"]},
    confirm_password: {type:String, required:[true, "Please confirm your password"], validate:{
        validator:function(value){
            return value == this.password;
        },
        message: "Passwords do not match"
    }},
    birthday: {type:Date, 
        validate:{
            validator: function(v){
                let date = new Date(v);
                let today = new Date();
                return date < today;
            },
            message:"Date must be in the past"
        }}
}, {timestamps:true});
UserSchema.pre('save', function(done){
    bcrypt.hash(this.password, 10)
    .then(hashed => {
        this.password = hashed;
        this.confirm_password = null;
        done();
    })
    .catch(error => {
        console.log("Something went wrong", error);
    })
}); 
mongoose.model('User', UserSchema);
var User = mongoose.model('User');

app.get('/', function(req,res){
    res.render('logreg', {session:req.session});
})

app.post('/register', function(req,res){
    req.session.first_name = req.body.first_name
    req.session.last_name = req.body.last_name
    req.session.email = req.body.email
    req.session.birthday = req.body.birthday
    console.log(typeof(req.body.birthday));
    User.find({email:req.body.email}, function(err,user){
        if (err) console.log("Something went wrong", err);
        if (user.length > 0){
            req.flash('email', "Email has already been taken");
            res.redirect('/');
        }
        else{
            var user = new User(req.body);
            user.save(err =>{
                if (err){
                    for (var key in err.errors) req.flash(key, err.errors[key].message);
                    res.redirect('/');
                }
                else{
                    req.session.user_id = user._id;
                    res.redirect('/secrets');
                }
            })
        }
    })
})

app.post('/login', function(req,res){
    User.findOne({email: req.body.email}, (err,user) => {
        if (err){
            console.log("Something went wrong", err);
            res.redirect('/');
        }
        else{
            if (user){
                bcrypt.compare(req.body.password, user.password)
                    .then(result => {
                        if (result){
                            req.session.user_id = user._id;
                            res.redirect("/secrets");
                        }
                        else{
                            req.flash('login', "You could not be logged in");
                            res.redirect('/');
                        }
                    })
                    .catch(error => {
                        console.log("Something went wrong", error);
                    })
            }
            else{
                req.flash('login', "Please register!");
                res.redirect('/');
            }
        }
    })
})

app.get('/secrets', function(req,res){
    if (!req.session.user_id){
        req.flash('badlogin', "You must be logged in to enter this website");
        return res.redirect("/");
    }
    User.findOne({_id:req.session.user_id}, (err,user)=>{
        if (err){
            console.log("something went wrong", err);
            res.redirect('/');
        }
        else res.render('secrets', {user:user});
    })
})

app.get('/logout', function(req,res){
    req.session.pageviews = 1;  //achieves similar result as req.session.destroy()?
    req.flash('logout', "You successfully logged out");
    res.redirect('/');
})

app.listen(1234,function(){
    console.log("listening on port 1234");
})