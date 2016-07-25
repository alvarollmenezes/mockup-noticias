module.exports = app => {

    const highlightsController = require( '../controllers/highlightsController' )();

    app.get('/highlights', highlightsController.getList);

    return app;
};
