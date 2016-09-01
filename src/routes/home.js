module.exports = app => {

    const homeController = require( '../controllers/homeController' )();

    app.get( '/', homeController.getList );

    app.get( '/:id', homeController.getSingle );
};
