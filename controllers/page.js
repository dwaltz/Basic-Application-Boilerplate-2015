'use strict';

var _      = require( 'underscore' );

module.exports = function( server ) {

	server.get( '/', function( req, res ) {
		res.render( 'index', {title: 'test index page'} );
	});

};