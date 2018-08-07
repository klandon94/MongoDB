const cats = require('../controllers/cats.js');

module.exports = function(app){
    app.get('/', function(req,res){
        cats.showAll(req,res);
    })

    app.get('/cats/new', function(req,res){
        res.render('newcat');
    })
    
    app.post('/cats', function(req,res){
        cats.create(req,res);
    })

    app.get('/cats/:id', function(req,res){
        cats.showOne(req,res);
    })

    app.get('/cats/edit/:id', function(req,res){
        cats.editPage(req,res);
    })

    app.post('/cats/:id', function(req,res){
        cats.edit(req,res);
    })

    app.post('/cats/delete/:id', function(req,res){
        cats.delete(req,res);
    })
    
    app.listen(1234,function(){
        console.log("listening on port 1234");
    })
}