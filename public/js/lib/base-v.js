define(function () {
	"use strict";

	/*
	 * Base View
	 * Includes event buss in the case that view to view communication is needed
	 * SPECIAL NOTE - event bus events should be avoided and stateModel should be used in most cases
	 * In the event that you do use the event bus please namespace your event to avoid conflicts
	 *
	 * Use example:
	 * this.bus.trigger('some_event', data1, data2, data3, ...);
	 */

	var bus				= {};
	_.extend(bus, Backbone.Events);

	return Backbone.View.extend({
		bus:bus,

		//MAKE SURE VIEWS ARE WRAPPED BEFORE USING THIS
		destroy: function( replacement ) {
			var $parent;

			if( this.$el ) { $parent = this.$el.parent(); }
			//REMOVE ALL BACKBONE EVENTS
			this.undelegateEvents();

			//REMOVE ALL DATA ATTRIBUTES UNBIND ALL NON BACKBONE EVENTS ON
			this.$el.removeData();
			this.unbind();
			this.bus.unbind(null, null, this);

			//REMOVE VIEW FROM DOM
			this.remove();

			if( replacement ) { $parent.append( replacement ); }
		}
	});


});
