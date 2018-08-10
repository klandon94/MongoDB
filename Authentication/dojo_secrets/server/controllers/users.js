var User = require("../models/user");
const bcrypt = require('bcryptjs');

module.exports = {
    register: (req, res) =>{
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
    },
    login: (req,res) =>{
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
    }
}