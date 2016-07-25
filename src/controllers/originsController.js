const newsService = require( '../services/newsService' )();

module.exports = () => {
    const originsController = new Object();

    originsController.getList = ( req, res ) => {

        newsService.getOrigins()
            .then( o => {
                return res.json( o );
            } )
            .catch( err => {
                throw err;
            } );
    };

    return originsController;
};
