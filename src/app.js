var express = require("express");
var db = require("./db.json");

var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/destaques', function (req, res) {

    var destaques = db.destaques;

    res.json(destaques);
});

// Launch server
app.listen(4243);

