Task = require("../models/task");

module.exports = {
    showAll: function(req,res){
        Task.find({}, (err,tasks) => {
            if (err) res.json(err);
            else res.json(tasks);
        })
    },
    find: function(req,res){
        Task.findOne({_id:req.params.id}, (err,task)=>{
            if (!task) res.json("That task does not exist");
            else res.json(task);
        })
    },
    create: function(req,res){
        let task = new Task(req.body);
        task.save(err => {
            if (err) return res.json(err);
            let result = {message:"Success", task:task}
            res.json(result);
        })
    },
    edit: function(req,res){
        // If we don't need the document returned in our application, just update the property in database directly
        // Task.update({_id:req.params.id}, req.body, (err)=>{
        //     if (err) return res.json(err);
        //     res.redirect("/tasks");
        // })
        // Combines findbyId method with using set to change the properties that were passed in req.body
        Task.findById(req.params.id, (err,task)=>{
            if (err) return res.status(404).send(err);
            task.set(req.body);
            task.save((err, updatedTask)=>{
                if (err) return res.status(404).json();
                res.json(updatedTask);
            })
        })
        // passing in req.body smartly combines your existing document with this change, which allows for partial updates too
        // {new:true} an option that asks mongoose to return the updatedd version of the document instead of the pre-updated one
        // Task.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err,task)=>{
        //     if (err) return res.status(500).json("Something went wrong");
        //     return res.json(task);
        // })
    },
    delete:function(req,res){
        Task.findOne({_id:req.params.id}, (err,task)=>{
            if (task){
                Task.remove(task, err=>{});
                console.log("Successfully removed task");
                res.json("Successfully removed task");
            }
            else res.json("Could not find task associated with that id")
        })
    }
}
