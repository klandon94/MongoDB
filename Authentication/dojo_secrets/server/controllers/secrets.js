var Secret = require("../models/secret");
var User = require("../models/user");
var Comments = require("../models/comment");

module.exports = {
    findAll: (req,res) =>{
        Secret.find({}).populate({path:"comments", model:"Comment"}).populate({path:"user", model:"User"}).exec((err,secrets)=>{
            if (err) console.log("We have an error!", err);
            else {
                User.findOne({_id:req.session.user_id}, (err,user)=>{
                    if (err){
                        console.log("something went wrong", err);
                        res.redirect('/');
                    }
                    else res.render('secrets', {user:user, secrets:secrets});
                })
            }
        })
    },
    findOne: (req,res) =>{
        Secret.findById(req.params.id).populate({path:"comments", model:"Comment"}).populate({path:"user", model:"User"}).exec((err,secret)=>{
            if (err) console.log(err);
            else {
                console.log(secret)
                secret.populate({path:"comments.poster", model:"User"}, err=>{
                    res.render("secret", {session:req.session, secret:secret});
                })
            }
        })
    },
    create: (req,res) =>{
        let secret = new Secret(req.body);
        secret.save(err=>{
            if (err){
                console.log("Something went wrong", err);
                for(var key in err.errors) req.flash('secret', err.errors[key].message);
            }
            else req.flash("createsecret", "You successfully created a secret");
            res.redirect("/secrets");
        })
    },
    delete: (req,res) =>{
        Secret.remove({_id:req.body.secret_id}, err=>{
            if (err) console.log("Something went wrong", err);
            else{
                req.flash("deletesecret", "You successfully deleted your secret");
                res.redirect("/secrets");
            }
        })
    }
}