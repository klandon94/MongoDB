Quote = require('../models/quote.js');

module.exports = {
    create:function(req,res){
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
    },
    show:function(req,res){
        Quote.find({}).sort('-createdAt').exec(function(err,quotes){
            if (err){
                console.log("something went wrong");
                res.redirect("/");
            }
            else res.render('quotes', {quotes:quotes});
        })
    }
}