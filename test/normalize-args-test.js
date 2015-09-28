var assert = require('assert');
var normalizeArgs = require('../normalize-args');

describe('normalize-args', function () {
	it('single string argument', function () {
		var opts = normalizeArgs(['myModule/bin/cli']);
		assert.strictEqual(opts.path, 'myModule/bin/cli', 'opts.path');
		assert.strictEqual(opts.relative, './cli', 'opts.relative');
		assert.strictEqual(opts.before, normalizeArgs.noop, 'opts.before defaults to noop');
		assert.strictEqual(opts.run, normalizeArgs.noop, 'opts.run defaults to noop');
	});

	it('two string arguments', function () {
		var opts = normalizeArgs(['myModule/bin/cli', '../global-fallback']);
		assert.strictEqual(opts.path, 'myModule/bin/cli', 'opts.path');
		assert.strictEqual(opts.relative, '../global-fallback', 'opts.relative');
		assert.strictEqual(opts.before, normalizeArgs.noop, 'opts.before defaults to noop');
		assert.strictEqual(opts.run, normalizeArgs.noop, 'opts.run defaults to noop');
	});

	describe('object hash', function () {
		it('path only', function () {
			var opts = normalizeArgs([{
				path: 'someModule/someDir/someCli'
			}]);
			assert.strictEqual(opts.path, 'someModule/someDir/someCli', 'opts.path');
			assert.strictEqual(opts.relative, './someCli', 'opts.relative');
			assert.strictEqual(opts.before, normalizeArgs.noop, 'opts.before defaults to noop');
			assert.strictEqual(opts.run, normalizeArgs.noop, 'opts.run defaults to noop');
		});

		it('fully specified', function () {
			function beforeFn() {}
			function runFn() {}
			function requireFn() {}

			var opts = normalizeArgs([{
				path: 'someModule/someDir/someCli',
				relative: '../someOtherCli',
				before: beforeFn,
				require: requireFn,
				run: runFn
			}]);
			assert.strictEqual(opts.path, 'someModule/someDir/someCli', 'opts.path');
			assert.strictEqual(opts.relative, '../someOtherCli', 'opts.relative');
			assert.strictEqual(opts.before, beforeFn, 'opts.before');
			assert.strictEqual(opts.before, beforeFn, 'opts.before');
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
		test('before must be a fn', {path: 'mod/cli', before: 3}, /options\.before/);
		test('require must be a fn', {path: 'mod/cli', require: 3}, /options\.require/);
		test('run must be a fn', {path: 'mod/cli', run: 3}, /options\.run/);
	});
});
