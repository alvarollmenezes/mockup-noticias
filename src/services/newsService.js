const elasticsearch = require( '../config/elasticsearch' );

module.exports = () => {
    var newsService = new Object();

    elasticsearch.client.ping({
        // ping usually has a 3000ms timeout
        requestTimeout: 1000
      }, function (error) {
        if (error) {
          console.trace('elasticsearch fora do ar.');
        } else {
          console.log('Conectado corretamente.');
        }
      });

    newsService.getOrigins = function() {
        const body = 
        {            
            size: 0,
            aggs: {
                siglas: {
                    terms: {
                        field: 'siglaPublica.keyword'
                    }
                }
            }                     
        };

        return elasticsearch.client.search( {
            index: elasticsearch.newsIndex,
            // type: elasticsearch.newsType,
            body: body
        } ).then( result => {
            return result.aggregations.siglas.buckets.map( a => a.key.toUpperCase() ).sort();
        } );
    };

    newsService.getHighlights = function() {
        const body =
            {
                'sort': [
                    {
                        'dataCriacao': 'desc'
                    },
                    '_score'
                ]
            };

        return elasticsearch.client.search( {
            index: elasticsearch.highlightsIndex,
            type: elasticsearch.highlightsType,
            body: body
        } )
        .then( result => {
            return result.hits.hits.map( a => {
                var n = a._source;
                return {
                    image: n.urlImagemDestaqueThumbnail,
                    imageHighlight: n.urlImagemDestaque,
                    title: n.titulo,
                    summary: n.resumo,
                    origin: n.siglaPublica.toUpperCase(),
                    date: n.dataCriacao,
                    lastModified: n.dataPublicacao,
                    id: `${n.siglaSite}_${n.noticiaId}`,
                    url: n.urlNoticia
                };
            } );
        } );
    };

    newsService.getList = function( dateMin, dateMax, query, origins, pageNumber, pageSize ) {
        const body =
            {
                'sort': [
                    {
                        'dataCriacao': 'desc'
                    },
                    '_score'
                ],
                'from': ( pageNumber - 1 ) * pageSize,
                'size': pageSize,
                'query': {
                    'bool': {
                        'must': [
                            {
                                'match': {
                                    'siglaPublica': origins.join( ' ' )
                                }
                            },
                            {
                                'match': {
                                    'publicado': true
                                }
                            }
                        ]
                    }
                }
            };

        if ( dateMin || dateMax ) {
            const r =
                {
                    'range': {
                        'dataCriacao': new Object()
                    }
                };

            if ( dateMin ) {
                r.range.dataCriacao.gte = dateMin;
            }
            if ( dateMax ) {
                r.range.dataCriacao.lte = dateMax;
            }

            body.query.bool.must.push( r );
        }


        if ( query ) {
            body.query.bool.must.push(
                {
                    'query_string': {
                        'query': query
                    }
                }
            );
        }

        return elasticsearch.client.search( {
            index: elasticsearch.newsIndex,
            type: elasticsearch.newsType,
            body: body
        } )
            .then( result => {
                return result.hits.hits.map( a => {
                    var n = a._source;
                    return {
                        image: n.urlImagemDestaqueThumbnail,
                        imageHighlight: n.urlImagemDestaque,
                        title: n.titulo,
                        origin: n.siglaPublica.toUpperCase(),
                        date: n.dataCriacao,
                        lastModified: n.dataPublicacao,
                        id: a._id,
                        url: n.urlNoticia
                    };
                } );
            } );
    };

    newsService.getSingle = function( id ) {
        return elasticsearch.client.get( {
            index: elasticsearch.newsIndex,
            type: elasticsearch.newsType,
            id: id
        } )
            .then( result => {
                const n = result._source;
                return {
                    image: n.urlImagemDestaque,
                    title: n.titulo,
                    origin: n.siglaPublica.toUpperCase(),
                    date: n.dataCriacao,
                    lastModified: n.dataPublicacao,
                    id: result._id,
                    body: n.body,
                    url: n.urlNoticia
                };
            } );
    };

    newsService.getLastUpdate = function( ) {
        const body =
            {
                sort: [
                    {
                        date: 'desc'
                    }
                ],
                size: 1
            };

        return elasticsearch.client.search( {
            index: elasticsearch.lastUpdateIndex,
            type: elasticsearch.lastUpdateType,
            body: body
        } )
        .then( result => {
            return new Date( result.hits.hits[ 0 ]._source.date );
        } );
    };

    return newsService;
};
