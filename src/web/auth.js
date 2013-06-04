var
    config = require('../config.json'),
    data = require('../data/data'),
    passport = require('passport'),
    GoogleStrategy = require('passport-google').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    TwitterStrategy = require('passport-twitter').Strategy
;

function onRequest(req, res, next) {
	if (req.path != '/' && req.path.indexOf('/user/') < 0 && req.path.indexOf('/res/') < 0) {
		/*if (!req.user) { // not logged in
			res.redirect('/user/login');
			return;
		}*/
	}

	next();
}

exports.init = function(app) {
	app.use(onRequest);

	passport.serializeUser(function(user, done) {
		//console.log("passport.serializeUser:");
		//console.dir(user);
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
		data.users.getByAuth(id, function (err, user) {
            console.log("passport.deserializeUser.byAuth: " + id);
            if (err) {
                console.dir(err);
            } else {
                console.dir(user);
            }
			done(err, user);
		});
	});

	app.use(passport.initialize());
	app.use(passport.session());

	// google
	if (config.auth.google) {
		var gg_ops = config.auth.google;
		gg_ops.returnURL = config.root + '/user/google/return';
		gg_ops.realm = config.root;
		passport.use(
			new GoogleStrategy(gg_ops,
				function(id, profile, done) {
					profile.id = id;
					profile.provider = "google"; // module bug that this is not set
					data.users.getOrCreateByPassport(profile, function (user) {
						done(null, profile);
					});
				}
			)
		);
		app.get('/user/google', passport.authenticate('google'));
		app.get('/user/google/return', passport.authenticate('google',
			{ successRedirect: '/', failureRedirect: '/user/login' }
			)
		);
	}

	// facebook
	if (config.auth.facebook) {
		var fb_ops = config.auth.facebook;
		fb_ops.callbackURL = config.root + '/user/facebook/return';
		passport.use(
			new FacebookStrategy(fb_ops,
				function(accessToken, refreshToken, profile, done) {
    				data.users.getOrCreateByPassport(profile, function (user) {
						done(null, profile);
					});
				}
			)
		);
		app.get('/user/facebook', passport.authenticate('facebook'));
		app.get('/user/facebook/return', passport.authenticate('facebook',
			{ successRedirect: '/', failureRedirect: '/user/login' }
			)
		);
	}
	
	// twitter
	if (config.auth.twitter) {
		var tw_opts = config.auth.twitter;
		tw_opts.callbackURL = config.root + '/user/twitter/return';
		passport.use(
			new TwitterStrategy(tw_opts,
				function(token, tokenSecret, profile, done) {
    				data.users.getOrCreateByPassport(profile, function (user) {
						done(null, profile);
					});
				}
			)
		);
		app.get('/user/twitter', passport.authenticate('twitter'));
		app.get('/user/twitter/return', passport.authenticate('twitter',
			{ successRedirect: '/', failureRedirect: '/user/login' }
			)
		);
	}
	
}
