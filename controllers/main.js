'use strict';

var pageController = require( './page' );
var errorController = require( './error' );
var restController = require( './error' );

module.exports = function( server ) {

	pageController(server);
	restController(server);
	errorController(server);

};
