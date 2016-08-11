const elasticsearch = require( '../config/elasticsearch' );

module.exports = () => {
    var newsService = new Object();

    newsService.getOrigins = function() {
        const body =
            {
                size: 0,
                aggs: {
                    siglas: {
                        terms: {
                            field: 'siglaSite',
                            size: 0
                        }
                    }
                }
            };

        return elasticsearch.client.search( {
            index: elasticsearch.newsIndex,
            type: elasticsearch.newsType,
            body: body
        } ).then( result => {
            return result.aggregations.siglas.buckets.map( a => a.key ).sort();
        } );
    };

    newsService.getHighlights = function() {
        return elasticsearch.client.search( {
            index: elasticsearch.highlightsIndex,
            type: elasticsearch.highlightsType
        } )
        .then( result => {
            return result.hits.hits.map( a => {
                var n = a._source;
                return {
                    image: n.urlImagemDestaqueThumbnail,
                    imageHighlight: n.urlImagemDestaque,
                    title: n.titulo,
                    summary: n.resumo,
                    origin: n.siglaSite,
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
                                    'siglaSite': origins.join( ' ' )
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
                        origin: n.siglaSite,
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
                    origin: n.siglaSite,
                    date: n.dataCriacao,
                    lastModified: n.dataPublicacao,
                    id: result._id,
                    body: n.body,
                    url: n.urlNoticia
                };
            } );
    };

    return newsService;
};
