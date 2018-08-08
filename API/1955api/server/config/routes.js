const people = require("../controllers/people.js");

module.exports = function(app){
    app.listen(1234,function(){
        console.log("listening on port 1234");
    })

    app.get('/', function(req,res){
        people.showAll(req,res);
    })

    app.get('/new/:name', function(req,res){
        people.create(req, res);
    })
    
    app.get('/remove/:name', function(req,res){
        people.destroy(req,res);
    })
    
    app.get('/:name', function(req,res){
        people.showOne(req,res);
    })
}