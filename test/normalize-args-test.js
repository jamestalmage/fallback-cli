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

	xit('object hash');

	xit('validates values');
});
