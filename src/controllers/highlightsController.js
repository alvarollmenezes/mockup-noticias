const extend = require("extend");

const dbNews = require("../../data/db.json");

module.exports = () => {
    var highlightsController = new Object();

    highlightsController.getList = (req, res) => {

        let db = extend(true, {}, dbNews);
        let highlights = db.news;

        highlights.map(a => {
            delete a.body;
        });

        return res.json(highlights);
    };

    return highlightsController;
};
