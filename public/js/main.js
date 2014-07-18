requirejs.config({
	baseUrl: './',
	paths: {
		// EXTRA DEPS
		'backbone': '../bower_components/backbone/backbone',
		'jquery':   '../bower_components/jquery/jquery',
		'underscore': '../bower_components/underscore/underscore',
		'json2': '../bower_components/json2/json2',
		// COMMON
		'base-v': './js/lib/base-v',
		'base-m': './js/lib/base-m',
		'base-c': './js/lib/base-c'
	},
	deps: [ 'js/app' ],
	shim: {
		'js/app': {
			deps: [ 'backbone' ]
		},
		'backbone': {
			deps: [ 'underscore', 'jquery', 'json2' ],
			exports: 'Backbone'
		},
		'underscore': {
			exports: '_'
		},
		'jquery': {
			exports: '$'
		}
	}
});