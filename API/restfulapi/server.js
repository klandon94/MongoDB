const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

require("./server/config/routes.js")(app);
require("./server/config/mongoose.js");