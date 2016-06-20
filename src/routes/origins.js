module.exports = app => {

    var originsController = require('../controllers/originsController')();

    app.get('/origins', originsController.getList);

    return app;
};
