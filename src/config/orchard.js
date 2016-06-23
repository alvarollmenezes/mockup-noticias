module.exports = {
    api: process.env.ORCHARD_API || 'http://orchard.dchm.es.gov.br/api/',
    sitesEndpoint: `${orchardApi}noticias/getsitelist`,
    highlightsEndpoint: `${orchardApi}noticias/Getdestaques`
};
