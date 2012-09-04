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
		 * Create an object that inherits from another object.
		 *
		 * @until ES5: Object.create.
		 * @source https://github.com/Krinkle/K-js.
		 * @param {Object} origin Object to inherit from.
		 * @return {Object} Empty object that inherits from origin.
		 */
		create: Object.hasOwnProperty('create') ? Object.create : function (origin) {
			function O() {}
			O.prototype = origin;
			var r = new O();

			return r;
		},


		/**
		 * Utility for common usage of Object.create for inheriting
		 * from one prototype to another.
		 * Beware: This re-defines the prototype property, call
		 * before setting any prototypes.
		 *
		 * @example
		 * <code>
		 *     function Foo() {}
		 *     Foo.prototype.jump = function () {};
		 *
		 *     function Bar() {}
		 *     K.Object.constructorInherit(Bar, Foo);
		 *     Bar.prototype.walk = function () {};
		 *
		 *     var bar = new Bar();
		 *     bar.jump();
		 *     bar.walk();
		 *     bar instanceof Foo && bar instanceof Bar; // true
		 * </code>
		 *
		 * @source https://github.com/Krinkle/K-js.
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
		 * Create a new object that is an instance of the same
		 * constructor as the input, inherits from the same object
		 * and contains the same own properties.
		 *
		 * This makes a shallow non-recursive copy of own properties.
		 * To create a recursive copy of plain objects, use something
		 * like `jQuery.extend(true, {}, origin);` instead.
		 *
		 * @example
		 * <code>
		 * var foo = new Person( mom, dad );
		 * foo.setAge(21);
		 * var foo2 = K.Object.clone(foo);
		 * foo.setAge(22);
		 * // Then
		 * foo2 !== foo; // true
		 * foo2 instance of Person; // true
		 * foo2.getAge(); // 21
		 * foo.getAge(); // 22
		 * </code>
		 *
		 * @source https://github.com/Krinkle/K-js.
		 * @param {Object} origin
		 * @return {Object} Clone of origin.
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
