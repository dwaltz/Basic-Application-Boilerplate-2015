requirejs.config({
	baseUrl: '/vendor',
	paths: {
		// APP PATHS
		js: '../js',

		'templates': '../templates',
		// COMMON
		'base-v': '../js/lib/base-v',
		'base-m': '../js/lib/base-m',
		'base-c': '../js/lib/base-c'
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