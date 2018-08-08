Person = require("../models/person.js");

module.exports = {
    showAll: function(req,res){
        Person.find({}, (err,people) => {
            if (err) {
                console.log("There was an error", err);
                res.json({message:"Error", error:err});
            }
            else res.json(people);
        })
    },
    create: function(req,res){
        var person = new Person({name:req.params.name});
        person.save(err => {
            if (err) console.log("There was an error", err);
            res.redirect('/')
        })
    },
    destroy: function(req,res){
        Person.findOne({name:req.params.name}, (err,user) => {
            if (user){
                Person.remove({name:req.params.name}, err => {
                    if (err) return res.json(err);
                    else console.log("Successfully removed a name");
                    res.redirect("/");
                })
            }
            else res.json("Could not find anyone with that name");
        })
    },
    showOne: function(req,res){
        Person.find({name:req.params.name}, function (err,person){
            if(!person[0]) res.json("That person doesn't exist");
            else res.json(person);
        })
    }
}