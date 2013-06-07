var
    base = require('./base')
;

exports.index = function(req, res) {
    base.render(req, res, 'master', 'home/index', {
        title: 'Home Page'
    });
};