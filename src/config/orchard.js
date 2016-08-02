const orchardApi = process.env.ORCHARD_API || 'http://orchard.dchm.es.gov.br/api/';

module.exports = {
    api: orchardApi,
    sitesEndpoint: `${orchardApi}noticias/getsitelist`,
    highlightsEndpoint: `${orchardApi}noticias/Getdestaques`
};
