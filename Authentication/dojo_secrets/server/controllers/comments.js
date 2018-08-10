let Comment = require('../models/comment')
let Secret = require('../models/secret')
let User = require("../models/user")

module.exports = {
    create: (req, res) => {
        let comment = new Comment(req.body);
        comment.poster = req.session.user_id;
        console.log(comment);
        Secret.findById(comment.secret, (err,secret)=>{
            if (err) console.log("Find secret error", err);
            comment.save(err=>{
                if (err){
                    console.log("Comment save error", err);
                    for (var key in err.errors) req.flash('comment', err.errors[key].message);
                }
                else{
                    secret.comments.push(comment._id);
                    secret.save(err=>{
                        if (err) console.log("Secret save error", err);
                    })
                    // User.findById(req.session.user_id, (err,user)=>{
                    //     if (err) console.log("Find user error", err);
                    //     else {
                    //         user.comments.push(comment._id);
                    //         user.save(err=>{});
                            
                    //     }
                    // })
                }
                res.redirect("/secrets/"+req.body.secret);
            })
        });
    }
}