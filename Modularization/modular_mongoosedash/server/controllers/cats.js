Cat = require('../models/cat.js');

module.exports = {
    create:function(req,res){
        var cat = new Cat(req.body);
        cat.save(function(err){
            if (err){
                console.log("We have an error");
                for (var key in err.errors) req.flash('creation', err.errors[key].message);
            }
            else req.flash('success', 'you created a cat!');
        res.redirect('/cats/new');
        })
    },
    edit:function(req,res){
        Cat.updateOne({_id:req.params.id}, {$set:{kind:req.body.kind, name:req.body.name, size: req.body.size}}, function(err){
            if (err) console.log(err);
            else res.redirect("/cats/" + req.params.id);
        });
    },
    delete:function(req,res){
        Cat.remove({_id:req.params.id}, function(err){
            if (err) console.log(err);
            else res.redirect("/");
        })
    },
    showAll:function(req,res){
        Cat.find({}).sort('kind').exec(function(err,cats){
            if (err) console.log("something went wrong", err);
            else res.render('cats', {cats:cats});
        })
    },
    showOne:function(req,res){
        Cat.findOne({_id:req.params.id}, function(err,cat){
            // console.log(cat);
            res.render("onecat", {cat:cat});
        });
    },
    editPage:function(req,res){
        Cat.findOne({_id:req.params.id}, function(err,cat){
            res.render("editcat", {cat:cat});
        });
    }
}