const elasticsearch = require( 'elasticsearch' );

const es_host = process.env.ELASTICSEARCH || 'http://10.243.9.4';

module.exports = {
    newsIndex: 'news',
    newsType: 'news',
    highlightsIndex: 'highlights',
    highlightsType: 'highlights',
    host: es_host,
    client: new elasticsearch.Client( {
        host: es_host,
        log: 'error'
    } )
};
