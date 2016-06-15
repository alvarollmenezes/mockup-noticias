var express = require("express");

var app = express();

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/destaques', function (req, res) {
    var db = require("./db.json");
    
    let destaques = db.noticias;

    destaques.map(a => {
        delete a.corpo;
    });

    return res.json(destaques);
});


app.get('/noticia/:id', (req, res) => {
    var db = require("./db.json");

    let noticia = db.noticias.filter(a => a.id == req.params.id)[0];

    delete noticia.resumo;

    return res.json(noticia);
});

app.get('/lista', (req, res) => {
    var db = require("./db.json");

    let noticias = db.noticias;

    noticias.map(a => {
        delete a.corpo;
        delete a.resumo;
    });

    return res.json(noticias);
});


// Launch server
app.listen(4243);
