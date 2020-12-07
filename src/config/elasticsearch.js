const elasticsearch = require( 'elasticsearch' );

const es_host = process.env.ELASTICSEARCH || 'http://10.243.9.4';

module.exports = {
    newsIndex: process.env.NEWS_INDEX || 'espm-news',
    newsType: process.env.NEWS_TYPE || 'news',
    highlightsIndex: process.env.HIGHLIGHTS_INDEX || 'espm-highlights',
    highlightsType: process.env.HIGHLIGHTS_TYPE || 'highlights',
    lastUpdateIndex: process.env.LAST_UPDATE_INDEX || 'espm-news-last-update',
    lastUpdateType: process.env.LAST_UPDATE_TYPE || 'news-last-update',
    host: es_host,
    client: new elasticsearch.Client( {
        host: es_host,
        log: 'error',
        apiVersion: '6.8'
    } )
};
