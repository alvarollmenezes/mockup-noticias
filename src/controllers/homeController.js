const sanitize = require('mongo-sanitize');
const extend = require("extend");

const dbNews = require("../../data/db.json");

module.exports = () => {
    var homeController = new Object();

    function normalizeArrayParameter(arrayParam) {
        if (!arrayParam) {
            origins = [];
        }
        else if (!Array.isArray(arrayParam)) {
            origins = [arrayParam];
        }
        else {
            origins = arrayParam;
        }

        // Remove duplicates
        return Array.from(new Set(origins));
    }

    homeController.getList = (req, res) => {

        let db = extend(true, {}, dbNews);
        let news = db.news;

        const dateMin = new Date(req.query.dateMin);
        let dateMax = new Date(req.query.dateMax);
        dateMax = dateMax.setDate(dateMax.getDate() + 1) - 1;
        const query = req.query.query;
        const origins = normalizeArrayParameter(req.query.origins);
        const pageNumber = req.query.pageNumber || 1;
        const pageSize = req.query.pageSize || 10;

        news = news.filter(a => {
            let get = true;
            if (dateMin) {
                get = get && new Date(a.date) >= dateMin;
            }
            if (get && dateMax) {
                get = get && new Date(a.date) <= dateMax;
            }
            //TODO: use query with elasticsearch in release version
            if (get && origins.length > 0) {
                get = get && origins.indexOf(a.origin) != -1;
            }
            else {
                get = false;
            }

            return get;
        });

        news = news.map(a => {
            delete a.body;
            delete a.summary;

            return a;
        }).sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });

        news = news.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

        return res.json(news);
    };

    homeController.getSingle = (req, res) => {

        let db = extend(true, {}, dbNews);
        var _id = sanitize(req.params.id);
        let news = db.news.filter(a => a.id == _id)[0];

        delete news.summary;

        return res.json(news);
    };

    return homeController;
};
