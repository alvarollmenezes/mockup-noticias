const request = require('request-promise');
const elasticsearch = require('elasticsearch');

// Orchard
const orchardApi = process.env.ORCHARD_API || 'http://orchard.dchm.es.gov.br/api/';
const sitesEndpoint = `${orchardApi}noticias/getsitelist`;
const highlightsEndpoint = `${orchardApi}noticias/Getdestaques`;

// ElasticSearch
const client = new elasticsearch.Client({
    host: 'http://10.243.9.4',
    log: 'error'
});
const newsIndex = 'news';
const newsType = 'news';

module.exports = () => {
    var newsService = new Object();

    newsService.getOrigins = function () {
        const options = {
            uri: sitesEndpoint,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        }

        return request(options)
            .then(sites => {
                return sites.map(s => s.sigla).sort();
            });
    };

    newsService.getHighlights = function () {
        const options = {
            uri: highlightsEndpoint,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        }

        return request(options)
            .then(news => {
                return news.map(n => {
                    return {
                        image: n.urlImagemDestaque,
                        title: n.titulo,
                        summary: n.resumo,
                        origin: n.siglaSite,
                        date: n.dataCriacao,
                        lastModified: n.dataPublicacao,
                        id: `${n.siglaSite}_${n.noticiaId}`,
                        url: n.urlNoticia
                    };
                });
            });
    };

    newsService.getList = function (dateMin, dateMax, query, origins, pageNumber, pageSize) {
        const body =
            {
                "sort": [
                    {
                        "dataCriacao": "desc"
                    },
                    "_score"
                ],
                "from": (pageNumber - 1) * pageSize,
                "size": pageSize,
                "query": {
                    "bool": {
                        "must": [
                            {
                                "match": {
                                    "siglaSite": origins.join(' ')
                                }
                            },
                            {
                                "match": {
                                    "publicado": true
                                }
                            }
                        ]
                    }
                }
            };

        if (dateMin || dateMax) {
            const r =
                {
                    "range": {
                        "dataCriacao": new Object()
                    }
                };

            if (dateMin) {
                r.range.dataCriacao.gte = dateMin;
            }
            if (dateMax) {
                r.range.dataCriacao.lte = dateMax;
            }

            body.query.bool.must.push(r);
        }


        if (query) {
            body.query.bool.must.push(
                {
                    "query_string": {
                        "query": query
                    }
                }
            );
        }

        return client.search({
            index: newsIndex,
            type: newsType,
            body: body
        })
            .then(result => {
                return result.hits.hits.map(a => {
                    var n = a._source;
                    return {
                        image: n.urlImagemDestaque,
                        title: n.titulo,
                        origin: n.siglaSite,
                        date: n.dataCriacao,
                        lastModified: n.dataPublicacao,
                        id: a._id,
                        url: n.urlNoticia
                    };
                });
            });
    };

    newsService.getSingle = function (id) {
        return client.get({
            index: newsIndex,
            type: newsType,
            id: id
        })
            .then(result => {
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
            });
    }

    return newsService;
}
