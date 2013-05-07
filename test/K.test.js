(function () {
	'use strict';
	var hasOwn = Object.prototype.hasOwnProperty;

	QUnit.module('K.Object');

	function keys(o) {
		var key,
			r = [];
		for (key in o) {
			if (hasOwn.call(o, key)) {
				r.push(key);
			}
		}
		return r;
	}

	QUnit.test('Native behavior', 1, function (assert) {

		function Foo() {}

		assert.strictEqual(
			Foo.prototype.constructor,
			Foo,
			'Browsers have a reliable default inherited magic "constructor" property'
		);

	});

	QUnit.test('create', 4, function (assert) {
		var foo, bar, fooKeys, barKeys;

		foo = {
			a: 'a of foo',
			b: 'b of foo'
		};

		bar = K.Object.create(foo);

		// Add an own property, hiding the inherited one.
		bar.b = 'b of bar';

		// Add an own property, hiding an inherited property
		// that will be added later
		bar.c = 'c of bar';

		// Add more properties to the origin object,
		// should be visible in the inheriting object.
		foo.c = 'c of foo';
		foo.d = 'd of foo';

		// Different property that only one of each has
		foo.foo = true;
		bar.bar = true;

		assert.deepEqual(
			foo,
			{
				a: 'a of foo',
				b: 'b of foo',
				c: 'c of foo',
				d: 'd of foo',
				foo: true
			},
			'Foo has expected properties'
		);

		assert.deepEqual(
			bar,
			{
				a: 'a of foo',
				b: 'b of bar',
				c: 'c of bar',
				d: 'd of foo',
				foo: true,
				bar: true
			},
			'Bar has expected properties'
		);

		fooKeys = keys(foo);
		barKeys = keys(bar);

		assert.deepEqual(
			fooKeys,
			['a', 'b', 'c', 'd', 'foo'],
			'Own properties of foo'
		);

		assert.deepEqual(
			barKeys,
			['b', 'c', 'bar'],
			'Own properties of bar'
		);
	});

	QUnit.test('constructorInherit', 12, function (assert) {
		var foo, bar;

		function Foo() {
			this.constructedFoo = true;
		}

		Foo.a = 'static of Foo';
		Foo.b = 'static of Foo';
		Foo.prototype.b = 'proto of Foo';
		Foo.prototype.c = 'proto of Foo';
		Foo.prototype.bFn = function () {
			return 'proto of Foo';
		};
		Foo.prototype.cFn = function () {
			return 'proto of Foo';
		};

		foo = new Foo();

		function Bar() {
			this.constructedBar = true;
		}
		K.Object.constructorInherit(Bar, Foo);

		Bar.a = 'static of Bar';
		Bar.prototype.b = 'proto of Bar';
		Bar.prototype.bFn = function () {
			return 'proto of Bar';
		};

		bar = new Bar();

		assert.strictEqual(
			Bar.b,
			undefined,
			'Static properties are not inherited'
		);

		assert.strictEqual(
			foo instanceof Foo,
			true,
			'foo instance of Foo'
		);
		assert.strictEqual(
			foo instanceof Bar,
			false,
			'foo not instance of Bar'
		);

		assert.strictEqual(
			bar instanceof Foo,
			true,
			'bar instance of Foo'
		);
		assert.strictEqual(
			bar instanceof Bar,
			true,
			'bar instance of Bar'
		);

		assert.equal(bar.constructor, Bar, 'constructor property is restored');
		assert.equal(bar.b, 'proto of Bar', 'own methods go first');
		assert.equal(bar.bFn(), 'proto of Bar', 'own properties go first');
		assert.equal(bar.c, 'proto of Foo', 'prototype properties are inherited');
		assert.equal(bar.cFn(), 'proto of Foo', 'prototype methods are inherited');

		Bar.prototype.dFn = function () {
			return 'proto of Bar';
		};
		Foo.prototype.dFn = function () {
			return 'proto of Foo';
		};
		Foo.prototype.eFn = function () {
			return 'proto of Foo';
		};

		assert.equal(bar.dFn(), 'proto of Bar', 'inheritance is live');
		assert.equal(bar.eFn(), 'proto of Foo', 'inheritance is live');
	});

	QUnit.test('constructorMixin', 4, function (assert) {
		var quux;

		function Foo() {}
		Foo.prototype.aFn = function () {
			return 'proto of Foo';
		};

		function Bar() {}
		// constructorInherit makes the 'constructor'
		// property an own property when it restores it.
		K.Object.constructorInherit(Bar, Foo);
		Bar.prototype.bFn = function () {
			return 'mixin of Bar';
		};

		function Quux() {}
		K.Object.constructorMixin(Quux, Bar);

		assert.strictEqual(
			Quux.prototype.aFn,
			undefined,
			'mixin inheritance is not copied over'
		);

		assert.strictEqual(
			Quux.prototype.constructor,
			Quux,
			'constructor property skipped'
		);

		assert.strictEqual(
			Quux.prototype.hasOwnProperty('bFn'),
			true,
			'mixin properties are now own properties, not inherited'
		);

		quux = new Quux();

		assert.equal(quux.bFn(), 'mixin of Bar', 'mixin method works as expected');
	});

	QUnit.test('clone', 4, function (assert) {
		var myfoo, myfooClone, expected;

		function Foo(x) {
			this.x = x;
		}
		Foo.prototype.x = 'default';
		Foo.prototype.aFn = function () {
			return 'proto of Foo';
		};

		myfoo = new Foo(10);
		myfooClone = K.Object.clone(myfoo);

		assert.notStrictEqual(myfoo, myfooClone, 'clone is not equal when compared by reference');
		assert.deepEqual(myfoo, myfooClone, 'clone is equal when recursively compared by value');

		expected = {
			x: 10,
			aFn: 'proto of Foo',
			constructor: Foo,
			instanceOf: true,
			own: {
				x: true,
				aFn: false,
				constructor: false
			}
		};

		assert.deepEqual(
			{
				x: myfoo.x,
				aFn: myfoo.aFn(),
				constructor: myfoo.constructor,
				instanceOf: myfoo instanceof Foo,
				own: {
					x: myfoo.hasOwnProperty('x'),
					aFn: myfoo.hasOwnProperty('aFn'),
					constructor: myfoo.hasOwnProperty('constructor')
				}
			},
			expected,
			'original looks as expected'
		);

		assert.deepEqual(
			{
				x: myfooClone.x,
				aFn: myfooClone.aFn(),
				constructor: myfooClone.constructor,
				instanceOf: myfooClone instanceof Foo,
				own: {
					x: myfooClone.hasOwnProperty('x'),
					aFn: myfooClone.hasOwnProperty('aFn'),
					constructor: myfoo.hasOwnProperty('constructor')
				}
			},
			expected,
			'clone looks as expected'
		);

	});

}());
