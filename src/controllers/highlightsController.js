const newsService = require('../services/newsService')();

module.exports = () => {
    var highlightsController = new Object();

    highlightsController.getList = (req, res) => {

        newsService.getHighlights()
            .then(o => {
                return res.json(o);
            })
            .catch(err => {
                throw err;
            });
    }

    return highlightsController;
};
