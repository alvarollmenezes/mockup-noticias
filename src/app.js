const configMiddleware = require( './config/apiMiddleware' );
const config = require( './config/app' );

if ( config.env === 'production' ) {
    require( 'newrelic' );
}

const express = require( 'express' );
const apiMiddleware = require( 'node-mw-api-prodest' ).middleware;

let app = express();

app.use( apiMiddleware( {
    compress: true,
    cors: true,
    authentication: {
        jwtPublicKey: config.jwtPublicKey
    },
    limit: {
        max: configMiddleware.max,
        duration: configMiddleware.duration * 60 * 1000,
        perSecond: configMiddleware.perSecond,
        redisUrl: config.redisUrl,
        apiId: 'api-noticias'
    }
} ) );

// load our routes
require( './routes/origins' )( app );
require( './routes/highlights' )( app );
require( './routes/home' )( app );

app.use( apiMiddleware( {
    error: {
        notFound: true,
        debug: config.env === 'development'
    }
} ) );

let pathApp = express();

let path = config.path;
pathApp.use( path, app );

module.exports = pathApp;
