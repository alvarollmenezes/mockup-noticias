const apicache = require('apicache').options({ debug: false }).middleware;

module.exports = app => {

    const highlightsController = require( '../controllers/highlightsController' )();

    app.get('/highlights', apicache('10 minutes'), highlightsController.getList);

    return app;
};
