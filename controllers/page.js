'use strict';

var _      = require( 'underscore' );
var common = require( '../lib/common' );

module.exports = function( server, passport ) {

	//main authenticated page
	server.get( '/', common.isLoggedIn, function( req, res ){
		res.render( 'index', {title: 'Tech Demo'});
	});

	//un-authenticated pages
	server.get( '/welcome', function( req, res ) {
		res.render( 'welcome', {layout: 'external', title: 'Welcome'});
	});

	server.get( '/login', function( req, res){
		res.render( 'login', {layout: 'external', title: 'Login'} );
	});

	server.get( '/signup', function( req, res){
		res.render( 'signup', {layout: 'external', title: 'login'} );
	});

};