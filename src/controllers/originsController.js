const extend = require("extend");

const dbNews = require("../../data/db.json");

module.exports = () => {
    const originsController = new Object();

    originsController.getList = (req, res) => {

        let origins = dbNews.news.map(n => n.origin).sort();
    
        origins = Array.from(new Set(origins));

        return res.json(origins);
    }

    return originsController;
};
 