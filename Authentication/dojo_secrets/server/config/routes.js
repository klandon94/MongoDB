const users = require("../controllers/users");
const secrets = require("../controllers/secrets");
const comments = require("../controllers/comments");

module.exports = function(app){
    app.listen(1234,function(){
        console.log("listening on port 1234");
    })

    app.get('/', (req,res)=>{
        res.render('logreg', {session:req.session});
    })

    app.post('/register', (req,res)=>{
        users.register(req,res);
    })

    app.post('/login', (req,res)=>{
        users.login(req,res);
    })

    app.get('/secrets', (req,res)=>{
        if (!req.session.user_id){
            req.flash('badlogin', "You must be logged in to enter this website");
            return res.redirect("/");
        }
        secrets.findAll(req,res);
    })

    app.get('/secrets/:id', (req,res)=>{
        secrets.findOne(req,res);
    })

    app.post("/secret", (req,res)=>{
        secrets.create(req,res);
    })
    
    app.post("/comment", (req,res)=>{
        comments.create(req,res);
    })

    app.post("/delete", (req,res)=>{
        secrets.delete(req,res);
    })

    app.get('/logout', (req,res)=>{
        req.session.destroy();
        res.redirect('/');
    })
}