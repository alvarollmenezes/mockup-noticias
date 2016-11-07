module.exports = app => {

    const statusController = require( '../controllers/statusController' )();

    app.get( '/status', statusController.getStatus );
};
