define(function (require) {
	"use strict";

	var baseM = require('content/common/base-m');

	/*
	 * Base Collection
	 * Includes parse method for calls that return payload data wrapped in object:
	 *
	 * Use example:
	 * Example = baseM.extend({layer: 'entry'})
	 * For a payload where collection data is wrapped in an object called 'entry'
	 */

	return Backbone.Collection.extend({
		model: baseM,
		/*
		 * For non-backbone friendly ajax responses
		 * this method will place the right data into the models
		 * options.layer can be passed to define the name of layer in which the model data is located.
		 * options.layer can be a string or an array if the model data is nested deeper
		 * than the base layer of the object
		 */
		parse:function (response) {
			var layer = this.layer;
			var local;

			if( !layer ){
				return response;
			} else if ( typeof(layer) === "string" ){
				return response[layer];
			} else {
				if(layer.length){
					for (var i = 0; i < layer.length; i++) {
						local = response[layer[i]];
					}
					return local;
				}
			}
		},

		/*
		 * For data retrieve through non-native fetch methods
		 */
		fill: function ( items ) {
			var context = this;

			$.each(items, function(index, item){
				var model = new context.model();

				model.attributes = item;
				context.add(model);
			});
		}
	});
});
