const request = require('request-promise');
const elasticsearch = require('elasticsearch');

// Orchard
const orchardApi = process.env.ORCHARD_API || 'http://orchard.dchm.es.gov.br/api/';
const sitesEndpoint = `${orchardApi}noticias/getsitelist`;
const highlightsEndpoint = `${orchardApi}noticias/Getdestaques`;

// ElasticSearch
const client = null;
// new elasticsearch.Client({
//     host: 'http://es.labs.prodest.dcpr.es.gov.br',
//     log: 'error'
// });
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
                return sites.map(s => s.sigla);
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
                        date: n.dataPublicacao,
                        id: `${n.siglaSite}_${n.noticiaId}`,
                        url: n.urlNoticia
                    };
                });
            });
    };

    newsService.getList = function (dateMin, dateMax, query, origins, pageNumber, pageSize) {
        return new Promise((resolve, reject) => {
            return resolve(
                [
                    { a: 1 }
                ]);
        });

        const body =
            {
                "sort": [
                    {
                        "dataPublicacao": "desc"
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
                        "dataPublicacao": new Object()
                    }
                };

            if (dateMin) {
                r.range.dataPublicacao.gte = dateMin;
            }
            if (dateMax) {
                r.range.dataPublicacao.lte = dateMax;
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
                        date: n.dataPublicacao,
                        id: a._id,
                        url: n.urlNoticia
                    };
                });
            });
    };

    newsService.getSingle = function (id) {
        return new Promise((resolve, reject) => {
            return resolve(
                [
                    { a: 1 }
                ]);
        });

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
                    date: n.dataPublicacao,
                    id: result._id,
                    body: n.body,
                    url: n.urlNoticia
                };
            });
    }

    return newsService;
}
