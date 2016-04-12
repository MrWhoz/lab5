var express = require('express');
var app = express();
var bodyParser  = require('body-parser');


var app = express();   
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.use('/api',require('./routes/api'));


app.listen(3000);
console.log("run...");