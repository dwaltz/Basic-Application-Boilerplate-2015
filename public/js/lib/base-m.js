define(function () {
	"use strict";

	/*
	 * Base Model
	 * Includes parse method for calls that return payload data wrapped in object:
	 *
	 * Use example:
	 * Example = baseM.extend({layer: 'entry'})
	 * For a payload where model data is wrapped in an object called 'entry'
	 */

	return Backbone.Model.extend({
		/*
		 * For non-backbone friendly ajax responses
		 * this method will place the right data into the models
		 * options.layer can be passed to define the name of layer in which the model data is located.
		 * options.layer can be a string or an array if the model data is nested deeper
		 * than the base layer of the object
		 */
		parse:function ( response ) {
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
		}
	});
});
