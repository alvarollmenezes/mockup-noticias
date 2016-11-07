const newsService = require( '../services/newsService' )();

module.exports = () => {
    var statusController = new Object();

    statusController.getStatus = ( req, res ) => {

        newsService.getLastUpdate()
        .then( lastUpdate => {
            const diff = new Date() - lastUpdate;
            const aDay = 24 * 60 * 60 * 1000;

            if ( diff > aDay ) {
                res.status( 500 ).send( 'Última atualização tem mais que 1 dia.' );
            } else {
                res.send( 'ok' );
            }
        } )
        .catch( err => {
            console.error( err );

            res.status( 500 ).send( 'Ocorreu um erro.' );
        } );
    };

    return statusController;
};
