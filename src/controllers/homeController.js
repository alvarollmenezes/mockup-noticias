const sanitize = require('mongo-sanitize');
const extend = require("extend");

const dbNews = require("../../data/db.json");

module.exports = () => {
    var homeController = new Object();

    homeController.getList = (req, res) => {

        let db = extend(true, {}, dbNews);
        let news = db.news;

        news.map(a => {
            delete a.body;
            delete a.summary;
        });

        return res.json(news);
    };

    homeController.getSingle = (req, res) => {

        let db = extend(true, {}, dbNews);
        var _id = sanitize(req.params.id);
        let news = db.news.filter(a => a.id == _id)[0];

        delete news.summary;

        return res.json(news);
    };

    return homeController;
};
