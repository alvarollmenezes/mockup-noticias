module.exports = app => {

    const originsController = require( '../controllers/originsController' )();

    app.get( '/origins', originsController.getList );

    return app;
};
