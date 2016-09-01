const newsService = require( '../services/newsService' )();

module.exports = () => {
    const originsController = new Object();

    originsController.getList = ( req, res, next ) => {

        newsService.getOrigins()
            .then( o => {
                return res.json( o );
            } )
            .catch( err => {
                next( err );
            } );
    };

    return originsController;
};
