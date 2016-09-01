const newsService = require( '../services/newsService' )();

module.exports = () => {
    var highlightsController = new Object();

    highlightsController.getList = ( req, res, next ) => {

        newsService.getHighlights()
            .then( o => {
                return res.json( o );
            } )
            .catch( err => {
                next( err );
            } );
    };

    return highlightsController;
};
