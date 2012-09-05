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
		 * @static
		 * @method
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
		 * Utility for common usage of Object.create for inheriting from one
		 * prototype to another.
		 *
		 * Beware: This redefines the prototype, call before setting your prototypes.
		 * Beware: This redefines the prototype, can only be called once on a function.
		 *  If called multiple times on the same function, the previous prototype is lost.
		 *  This is how prototypal inheritance works, it can only be one straight chain
		 *  (just like classical inheritance in PHP for example). If you need to work with
		 *  multiple constructors consider storing an instance of the other constructor in a
		 *  property instead, or perhaps use a mixin (see Object.mixin).
		 *
		 * @example
		 * <code>
		 *     function Foo() {}
		 *     Foo.prototype.jump = function () {};
		 *
		 *     function FooBar() {}
		 *     K.Object.constructorInherit(FooBar, Foo);
		 *     FooBar.prototype.walk = function () {};
		 *
		 *     var fb = new FooBar();
		 *     fb.jump();
		 *     fb.walk();
		 *     fb instanceof Foo && fb instanceof FooBar;
		 * </code>
		 *
		 * @static
		 * @method
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
		 * Utility to copy over *own* prototype properties of a mixin.
		 * The 'constructor' (whether implicit or explicit) is not copied over.
		 *
		 * This does not create inheritance to the origin. If inheritance is needed
		 * use Object.constructorInherit instead.
		 *
		 * Beware: This can redefine a prototype property, call before setting your prototypes.
		 * Beware: Don't call before Object.constructorInherit.
		 *
		 * @example
		 * <code>
		 *     function Foo() {}
		 *     function Context() {}
		 *
		 *     // Avoid repeating this code
		 *     function ContextLazyLoad() {}
		 *     ContextLazyLoad.prototype.getContext = function () {
		 *         if (!this.context) {
		 *             this.context = new Context();
		 *         }
		 *         return this.context;
		 *     };
		 *
		 *     function FooBar() {}
		 *     K.Object.constructorInherit(FooBar, Foo);
		 *     K.Object.constructorMixin(FooBar, ContextLazyLoad);
		 * </code>
		 *
		 * @static
		 * @method
		 * @source https://github.com/Krinkle/K-js.
		 * @param {Function} targetFn
		 * @param {Function} originFn
		 */
		constructorMixin: function (targetFn, originFn) {
			for (var key in originFn.prototype) {
				if (key !== 'constructor' && hasOwn.call(originFn.prototype, key)) {
					targetFn.prototype[key] = originFn.prototype[key];
				}
			}
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
		 * var foo = new Person(mom, dad);
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
		 * @static
		 * @method
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
