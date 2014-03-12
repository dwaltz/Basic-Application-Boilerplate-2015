"use strict";

module.exports = function( server ) {

	server.get('/data', function( req, res ){
		//dataset is currently undefined but this is just a sample RESTFUL type response
		if ( !req.session.dataset ) req.session.dataset = data;
		res.setHeader( 'content-type', 'application/json' );
		res.send( JSON.stringify(req.session.dataset) );
	});

};