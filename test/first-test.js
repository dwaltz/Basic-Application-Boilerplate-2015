/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/

require(['jquery'], function($) {
	"use strict";

	module('Testing Main',{
		setup: function(){
			this.$testHTML = $('<div></div>');
		}
	});

	test('general test', function() {
		ok(this.$testHTML.length === 1, 'test');
		equal(this.$testHTML.length, 1, 'test test');
	});

});