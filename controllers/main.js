'use strict';

var pageController = require( './page' );
var errorController = require( './error' );
var restController = require( './error' );
var authController = require( './auth' );

module.exports = function( server, passport ) {

	pageController(server, passport);
	restController(server);
	errorController(server);
	authController(server, passport);

};
