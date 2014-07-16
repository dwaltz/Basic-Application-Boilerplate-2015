'use strict';

module.exports = function( server ) {

	//404 not found error
	server.use( function(err, req, res, next ) {
		var errorCode = err.status || 500;

		if( res.status( errorCode ) ){
			// html response
			if( req.accepts( 'html' ) ) {
				res.render( '404', {
					layout: 'error',
					error: '404: Not Found'
				});
				return;
			}

			// json response
			if( req.accepts( 'json' ) ) {
				res.send( { error: '404: Not found' } );
				return;
			}

			// text response
			res.type( 'txt' ).send( '404: Not found' );
			next( err );
		} else {
			next();
		}
	});

	// 500 Server Error
	server.use( function( err, req, res, next ) {
		var errorCode = err.status || 500;

		if( res.status( errorCode ) ){
			//server error html response
			res.render( '500', {
				layout: 'error',
				error: 'Server Error'
			});
			next( err );
		} else {
			next();
		}
	});
};