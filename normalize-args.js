'use strict';
normalizeArgs.noop = noop;
normalizeArgs.validate = validate;
module.exports = normalizeArgs;
var basename = require('path').basename;
var assert = require('assert');

function normalizeArgs(args) {
	var opts = args[0];
	if (typeof opts === 'string') {
		opts = {
			path: opts
		};
		if (typeof args[1] === 'string') {
			opts.relative = args[1];
		}
	}
	var path = validate(opts.path, 'string', 'path');
	var relative = validate(opts.relative || './' + basename(path), 'string');
	var before = validate(opts.before || noop, 'function', 'before');
	var requireFn = validate(opts.require || require, 'function', 'require');
	var run = validate(opts.run || noop, 'function', 'run');

	return {
		path: path,
		relative: relative,
		before: before,
		require: requireFn,
		run: run
	};
}

function noop() {}

function validate(val, type, prop) {
	assert.strictEqual(typeof val, type, 'typeof options.' + prop);
	return val;
}
