(function (global) {
	'use strict';
	var
		hasOwn = Object.prototype.hasOwnProperty,
		K = {};

	/**
	 * Refer to unit tests for example usage.
	 */
	K.Object = {
		/**
		 * In JavaScript inheritance can only occur directly from one object
		 * to another. Up until ECMAScript 5, there was no native way to do
		 * so without using a constructor function.
		 * This function is a polyfill for that.
		 * @param {Object} origin
		 * @return {Object}
		 */
		create: Object.hasOwnProperty('create') ? Object.create : function (origin) {
			function O() {}
			O.prototype = origin;
			var r = new O();

			return r;
		},

		/**
		 * @param {Function} targetFn
		 * @param {Function} originFn
		 */
		constructorInherit: function (targetFn, originFn) {
			var tmp = targetFn.prototype.constructor;

			targetFn.prototype = K.Object.create(originFn.prototype);

			// Restore original constructor property
			targetFn.prototype.constructor = tmp;
		},

		/**
		 * @param {Object} origin
		 * @return {Object}
		 */
		clone: function (origin) {
			var key, r;

			r = K.Object.create(origin.constructor.prototype);

			for (key in origin) {
				if (hasOwn.call(origin, key)) {
					r[key] = origin[key];
				}
			}

			return r;
		}
	};

	// Expose for server/browser
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = K;
	} else {
		global.K = K;
	}

}(this));
