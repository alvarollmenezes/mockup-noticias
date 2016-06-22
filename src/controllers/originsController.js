const extend = require("extend");
const newsService = require('../services/newsService')();

const dbNews = require("../../data/db.json");

module.exports = () => {
    const originsController = new Object();

    originsController.getList = (req, res) => {

        newsService.getOrigins()
            .then(o => {
                return res.json(o);
            })
            .catch(err => {
                console.log(err);
                return res.send(err.message);
            });
    }

    return originsController;
};
