var
    BaseController = require('./base').BaseController
;

exports.init = function(app, req, res) {
    app.get('/', index);
}

function index(req, res) {
    var base = new BaseController(req, res);
    res.render('index', {
        title: 'Home Page via Express'
    });
}


