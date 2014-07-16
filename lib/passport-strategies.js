'use strict';

var _ = require('underscore');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;

//User model for saving users
var User       = require('./data/user');

//Loading configuration options
var config = require('config');

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

			User.findOne({ 'local.email' :  email }, function(err, user) {
				// if there are any errors, return the error
				if (err)
					return done(err);

				// if no user is found, return the message
				if (!user)
					return done(null, false, { message: 'No user found.' });

				if (!user.validPassword(password))
					return done(null, false, { message: 'Oops! Wrong password.' });

				// all is well, return user
				else
					return done(null, user);
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


			if (!req.user) {
				User.findOne({ 'local.email' :  email }, function(err, user) {
					// if there are any errors, return the error
					if (err)
						return done(err);

					// check to see if theres already a user with that email
					if (user) {
						return done(null, false, { message: 'That email is already taken.' });
					} else {

						// create the user
						var newUser            = new User();

						newUser.local.email    = email;
						newUser.local.password = password;

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

		}
	));

	//facebook authentication
	passport.use(new FacebookStrategy({

			clientID        : config.facebookAuth.clientID,
			clientSecret    : config.facebookAuth.clientSecret,
			callbackURL     : config.facebookAuth.callbackURL,
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

		},
		function(req, token, refreshToken, profile, done) {

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

		}
	));

	//twitter authentication
	passport.use(new TwitterStrategy({
			consumerKey     : config.twitterAuth.consumerKey,
			consumerSecret  : config.twitterAuth.consumerSecret,
			callbackURL     : config.twitterAuth.callbackURL,
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

		},
		function(req, token, tokenSecret, profile, done) {

			// asynchronous
			process.nextTick(function() {

				// check if the user is already logged in
				if (!req.user) {

					User.findOne({ 'twitter.id' : profile.id }, function(err, user) {
						if (err)
							return done(err);

						if (user) {
							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.twitter.token) {
								user.twitter.token       = token;
								user.twitter.username    = profile.username;
								user.twitter.displayName = profile.displayName;

								user.save(function(err) {
									if (err)
										throw err;
									return done(null, user);
								});
							}

							return done(null, user); // user found, return that user
						} else {
							// if there is no user, create them
							var newUser                 = new User();

							newUser.twitter.id          = profile.id;
							newUser.twitter.token       = token;
							newUser.twitter.username    = profile.username;
							newUser.twitter.displayName = profile.displayName;

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});

				} else {
					// user already exists and is logged in, we have to link accounts
					var user                 = req.user; // pull the user out of the session

					user.twitter.id          = profile.id;
					user.twitter.token       = token;
					user.twitter.username    = profile.username;
					user.twitter.displayName = profile.displayName;

					user.save(function(err) {
						if (err)
							throw err;
						return done(null, user);
					});
				}

			});

		}
	));

	//google authentication
	passport.use(new GoogleStrategy({
			consumerKey     : config.twitterAuth.consumerKey,
			consumerSecret  : config.twitterAuth.consumerSecret,
			callbackURL     : config.twitterAuth.callbackURL,
			passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
		},
		function(req, token, refreshToken, profile, done) {

			// asynchronous
			process.nextTick(function() {

				// check if the user is already logged in
				if (!req.user) {

					User.findOne({ 'google.id' : profile.id }, function(err, user) {
						if (err)
							return done(err);

						if (user) {

							// if there is a user id already but no token (user was linked at one point and then removed)
							if (!user.google.token) {
								user.google.token = token;
								user.google.name  = profile.displayName;
								user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

								user.save(function(err) {
									if (err)
										throw err;
									return done(null, user);
								});
							}

							return done(null, user);
						} else {
							var newUser          = new User();

							newUser.google.id    = profile.id;
							newUser.google.token = token;
							newUser.google.name  = profile.displayName;
							newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

							newUser.save(function(err) {
								if (err)
									throw err;
								return done(null, newUser);
							});
						}
					});

				} else {
					// user already exists and is logged in, we have to link accounts
					var user               = req.user; // pull the user out of the session

					user.google.id    = profile.id;
					user.google.token = token;
					user.google.name  = profile.displayName;
					user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

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