module.exports = app => {

    var highlightsController = require('../controllers/highlightsController')();

    app.get('/highlights', highlightsController.getList);

    return app;
};
