'use strict';

var _       = require( 'underscore' );
var common  = require( '../lib/common' );

module.exports = function( server, passport ) {

	// process the login form
	server.route('/login')
		.get(function( req, res ){
			var msg = { error: false};
			var error = req.flash('error');

			if( error.length ){
				msg.error = true;
				msg.msg = error[0];
			}

			res.render( 'login', _.extend({layout: 'external', title: 'Login'}, msg) );
		})
		.post(passport.authenticate('local-login', {
			successRedirect : '/', // redirect to the secure profile section
			failureRedirect : '/login', // redirect back to the signup page if there is an error
			failureFlash: true
		}));

	// process the signup form
	server.route('/signup')
		.get(function( req, res ){
			var msg = { error: false};
			var error = req.flash('error');

			if( error.length ){
				msg.error = true;
				msg.msg = error[0];
			}

			res.render( 'signup', _.extend({layout: 'external', title: 'login'}, msg) );
		})
		.post(passport.authenticate('local-signup', {
			successRedirect : '/', // redirect to the secure profile section
			failureRedirect : '/signup', // redirect back to the signup page if there is an error
			failureFlash: true
		}));

	//logout of the application
	server.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	//FACEBOOK
	server.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

	// handle the callback after facebook has authenticated the user
	server.get('/auth/facebook/callback',
		passport.authenticate('facebook', {
			successRedirect : '/',
			failureRedirect : '/welcome'
		}));

	//TWITTER
	server.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

	// handle the callback after twitter has authorized the user
	server.get('/connect/twitter/callback',
		passport.authorize('twitter', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));


	//GOOGLE
	server.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

	// the callback after google has authorized the user
	server.get('/connect/google/callback',
		passport.authorize('google', {
			successRedirect : '/profile',
			failureRedirect : '/'
		}));
};