define( function() {
	"use strict";

	//MAY WANT TO ABSTRACT ROUTS OUT INTO A CONTROLLER
	//var Controller	= require('js/controller');

	var Router = Backbone.Router.extend({
		routes: {
			'':                     'test',
			'test(/)(:version)':    'test'
		},

		test: function( /*query*/ ){
			//query contains :version information
		},

		initialize: function () {
			console.log('App router initialized');
		}
	});

	var router = new Router();

	//enabling push state. NOTE: this creates complications for the middle ware because it is not using # and instead just
	//modifying and re-directing the url
	Backbone.history.start({ pushState: true });

	return router;
});
