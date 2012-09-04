var qunit = require('qunit');

qunit.run({
    code: {
		path: './src/K.js',
		namespace: 'K'
    },
    tests: [
		'./test/K.test.js'
    ]
});
