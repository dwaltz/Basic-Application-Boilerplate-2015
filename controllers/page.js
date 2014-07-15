'use strict';

var _      = require( 'underscore' );

module.exports = function( server ) {

	server.get( '/', function( req, res ) {
		res.render( 'index', {title: 'test index page'} );
	});

	server.get( '/login', function( req, res){
		res.render( 'login', {layout: 'external'}, {title: 'login'} );
	});

};