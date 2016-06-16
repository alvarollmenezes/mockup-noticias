let express = require("express");
let extend = require("extend")

let dbNews = require("./db.json");

let app = express();
let subApp = express.Router();

subApp.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

subApp.get('/', (req, res) => {

    let db = extend(true, {}, dbNews);
    let news = db.news;

    news.map(a => {
        delete a.body;
        delete a.summary;
    });

    return res.json(news);
});

subApp.get('/highlights', (req, res) => {

    let db = extend(true, {}, dbNews);
    let highlights = db.news;

    highlights.map(a => {
        delete a.body;
    });

    return res.json(highlights);
});


subApp.get('/:id', (req, res) => {

    let db = extend(true, {}, dbNews);
    let news = db.news.filter(a => a.id == req.params.id)[0];

    delete news.summary;

    return res.json(news);
});

let path = process.env.REQUEST_PATH ? process.env.REQUEST_PATH : '';
app.use(path, subApp);

// Launch server
app.listen(4243);
