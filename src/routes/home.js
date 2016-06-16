module.exports = app => {

    var homeController = require('../controllers/homeController')();

    app.get('/', homeController.getList);

    app.get('/:id', homeController.getSingle);

    return app;
};
