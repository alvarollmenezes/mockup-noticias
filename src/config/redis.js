const redis = require( 'redis' );

const port = process.env.REDIS_PORT || 80;
const host = process.env.REDIS_HOST || 'redis.api.dcpr.es.gov.br';
const db = process.env.REDIS_DB || 0;

module.exports = {
    port: port,
    host: host,
    db: db,
    client: redis.createClient( port, host, { db: db } )
};
