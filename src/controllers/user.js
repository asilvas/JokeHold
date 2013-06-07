var
    base = require('./base')
;

exports.login = function (req, res) {
    base.render(req, res, 'master', 'user/login', { title: 'Login' });
};

exports.logout = function (req, res) {
	req.session.regenerate(function(err) {
		res.redirect('/');
	});
};