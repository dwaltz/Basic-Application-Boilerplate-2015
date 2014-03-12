define( function( require ) {
	'use strict';

	//BASE VIEW ALL APP VIEWS SHOULD INHERIT FROM THIS VIEW
	var BaseV = require('base-v');

	//BASIC ROUTER STUB
	//var router = require('js/router');

	//TEST VIEW
	var TestView = BaseV.extend({
		initialize: function() {

		},

		render: function() {
			this.$el.html( 'Boom Backbone Rendered Hello World' );
		},

		destroy: function(){

		}
	});

	var displayView = new TestView({ 'el': '#index-entry' });

	displayView.render();
});