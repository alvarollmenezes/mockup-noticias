const apicache = require( 'apicache' ).options( { debug: false } ).middleware;

module.exports = app => {

    const originsController = require( '../controllers/originsController' )();

    app.get( '/origins', apicache( '30 minutes' ), originsController.getList );

    return app;
};
