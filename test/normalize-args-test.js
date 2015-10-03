var assert = require('assert');
var normalizeArgs = require('../normalize-args');
var defaultRunner = require('../default-runner');

describe('normalize-args', function () {
	it('single string argument', function () {
		var opts = normalizeArgs(['myModule/bin/cli']);
		assert.strictEqual(opts.path, 'myModule/bin/cli', 'opts.path');
		assert.strictEqual(opts.relative, './cli', 'opts.relative');
		assert.strictEqual(opts.run, defaultRunner, 'opts.run defaults to noop');
	});

	it('two string arguments', function () {
		var opts = normalizeArgs(['myModule/bin/cli', '../global-fallback']);
		assert.strictEqual(opts.path, 'myModule/bin/cli', 'opts.path');
		assert.strictEqual(opts.relative, '../global-fallback', 'opts.relative');
		assert.strictEqual(opts.run, defaultRunner, 'opts.run defaults to noop');
	});

	it('single string and a custom runner', function () {
		function customRunner() {}
		var opts = normalizeArgs(['myModule/bin/cli', customRunner]);
		assert.strictEqual(opts.path, 'myModule/bin/cli', 'opts.path');
		assert.strictEqual(opts.relative, './cli', 'opts.relative');
		assert.strictEqual(opts.run, customRunner, 'opts.run');
	});

	it('two strings and a custom runner', function () {
		function customRunner() {}
		var opts = normalizeArgs(['myModule/bin/cli', '../global-fallback', customRunner]);
		assert.strictEqual(opts.path, 'myModule/bin/cli', 'opts.path');
		assert.strictEqual(opts.relative, '../global-fallback', 'opts.relative');
		assert.strictEqual(opts.run, customRunner, 'opts.run');
	});

	describe('object hash', function () {
		it('path only', function () {
			var opts = normalizeArgs([{
				path: 'someModule/someDir/someCli'
			}]);
			assert.strictEqual(opts.path, 'someModule/someDir/someCli', 'opts.path');
			assert.strictEqual(opts.relative, './someCli', 'opts.relative');
			assert.strictEqual(opts.run, defaultRunner, 'opts.run defaults to noop');
		});

		it('fully specified', function () {
			function runFn() {}

			var opts = normalizeArgs([{
				path: 'someModule/someDir/someCli',
				relative: '../someOtherCli',
				run: runFn
			}]);
			assert.strictEqual(opts.path, 'someModule/someDir/someCli', 'opts.path');
			assert.strictEqual(opts.relative, '../someOtherCli', 'opts.relative');
			assert.strictEqual(opts.run, runFn, 'opts.run');
		});
	});

	it('validates values', function () {
		function test(message, opts, test) {
			assert.throws(function () {
				normalizeArgs([opts]);
			}, test, message);
		}
		test('path must be a string', {path: 3}, /options\.path/);
		test('relative must be a string', {path: 'mod/cli', relative: 3}, /options\.relative/);
		test('run must be a fn', {path: 'mod/cli', run: 3}, /options\.run/);
	});
});
