var _ = require('underscore');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//User model for saving users
var User       = require('./data/user');

//Loading configuration options
var configAuth = require('../config')['local'];

module.exports = function(passport){

	//Configuring passport.js to use session authentication
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
			done(err, user);
		});
	});

	// local login
	passport.use('local-login', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		},
		function(req, email, password, done) {
			if (email)
				email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

			// asynchronous
			process.nextTick(function() {
				User.findOne({ 'local.email' :  email }, function(err, user) {
					// if there are any errors, return the error
					if (err)
						return done(err);

					// if no user is found, return the message
					if (!user)
						return done(null, false, req.flash('loginMessage', 'No user found.'));

					if (!user.validPassword(password))
						return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

					// all is well, return user
					else
						return done(null, user);
				});
			});

		}
	));

	// local signup
	passport.use('local-signup', new LocalStrategy({
			// by default, local strategy uses username and password, we will override with email
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		},
		function(req, email, password, done) {
			if (email)
				email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

			// asynchronous
			process.nextTick(function() {
				// if the user is not already logged in:
				if (!req.user) {
					User.findOne({ 'local.email' :  email }, function(err, user) {
						// if there are any errors, return the error
						if (err)
							return done(err);

						// check to see if theres already a user with that email
						if (user) {
							return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
						} else {

							// create the user
							var newUser            = new User();

							newUser.local.email    = email;
							newUser.local.password = newUser.generateHash(password);

							newUser.save(function(err) {
								if (err)
									throw err;

								return done(null, newUser);
							});
						}

					});
					// if the user is logged in but has no local account...
				} else if ( !req.user.local.email ) {
					// ...presumably they're trying to connect a local account
					var user            = req.user;
					user.local.email    = email;
					user.local.password = user.generateHash(password);
					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});
				} else {
					// user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
					return done(null, req.user);
				}

			});

		}
	));

	//facebook authentication
	passport.use(new FacebookStrategy({

			clientID        : configAuth.facebookAuth.clientID,
			clientSecret    : configAuth.facebookAuth.clientSecret,
			callbackURL     : configAuth.facebookAuth.callbackURL,
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

		},
		function(req, token, refreshToken, profile, done) {

			// asynchronous
			process.nextTick(function() {

				// check if the user is already logged in
				if (!req.user) {

					User.findOne({ 'facebook.id' : profile.id }, function(err, user) {
						if (err)
							return done(err);

						if (user) {

							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.facebook.token) {
								user.facebook.token = token;
								user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
								user.facebook.email = (profile.emails[0].value || '').toLowerCase();

								user.save(function(err) {
									if (err)
										throw err;
									return done(null, user);
								});
							}

							return done(null, user); // user found, return that user
						} else {
							// if there is no user, create them
							var newUser            = new User();

							newUser.facebook.id    = profile.id;
							newUser.facebook.token = token;
							newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
							newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});

				} else {
					// user already exists and is logged in, we have to link accounts
					var user            = req.user; // pull the user out of the session

					user.facebook.id    = profile.id;
					user.facebook.token = token;
					user.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
					user.facebook.email = (profile.emails[0].value || '').toLowerCase();

					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});

				}
			});

		}
	));

};