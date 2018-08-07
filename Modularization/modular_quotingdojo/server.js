const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const flash = require("express-flash");
const session = require("express-session")

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {maxAge:60000}
}))
app.use(flash());
app.use(express.static(__dirname + '/client/static'));
app.set('views', __dirname + '/client/views');
app.set('view engine', 'ejs');

// where the routes used to be, we're requiring routes.js
// since routes.js exports a function, server.js will receive that function
// invoke the function we get from the require and pass it app as an argument
require('./server/config/routes.js')(app)
require('./server/config/mongoose.js');