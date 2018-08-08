const tasks = require("../controllers/tasks");

module.exports = function(app){
    app.listen(1234, ()=>{
        console.log("Live on port 1234");
    })
    app.get('/tasks', (req,res)=>{
        tasks.showAll(req,res);
    })
    app.get('/tasks/:id', (req,res)=>{
        tasks.find(req,res);
    })
    app.post('/tasks', (req,res)=>{
        tasks.create(req,res);
    })
    app.put('/tasks/:id', (req,res)=>{
        tasks.edit(req,res);
    })
    app.delete('/tasks/:id', (req,res)=>{
        tasks.delete(req,res);
    })
}